import { useEffect, useReducer } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import { initialExerciseState, transitionExercise } from '../../exercises/evaluation';
import type { ExerciseAction, ExerciseState } from '../../exercises/evaluation';
import type { Exercise } from '../../exercises/types';
import { textStyles } from '../../theme';
import { Badge, Button, Card, Header, Screen, uiStyles } from '../ui';
import { AnswerFeedback } from './AnswerFeedback';
import { AnswerOptions } from './AnswerOptions';
import { ExerciseScenario } from './ExerciseScenario';
import { ExerciseProgress } from './ExerciseProgress';
import { ExerciseTransition, FeedbackSymbol, useExerciseReducedMotion } from './motion';
import { useProgress } from '../../progression/ProgressProvider';
import { POINTS_PER_EXERCISE } from '../../progression/progression';

export function ExercisePlayer({ exercise, position, total, onExit, onNext, onModuleSummary }: {
  exercise: Exercise;
  position: number;
  total: number;
  onExit: () => void;
  onNext?: () => void;
  onModuleSummary: () => void;
}) {
  const reducedMotion = useExerciseReducedMotion();
  const progress = useProgress();
  const moduleCompleted = progress.modules.find((module) => module.id === exercise.moduleId)?.status === 'completed';
  const [state, dispatch] = useReducer(
    (current: ExerciseState, action: ExerciseAction) => transitionExercise(exercise, current, action),
    initialExerciseState,
  );

  useEffect(() => {
    if (state.phase === 'feedback') {
      AccessibilityInfo.announceForAccessibility(
        `${state.result.correct ? 'Muito bem! Resposta correta.' : 'Boa tentativa! Vamos aprender juntos. Esta alternativa não é a mais segura.'} ${state.result.explanation}`,
      );
    } else if (state.phase === 'completed') {
      AccessibilityInfo.announceForAccessibility('Exercício concluído. Você pode continuar ou praticar novamente.');
    }
  }, [state]);

  // Cada fase começa no topo; a transição visual nunca bloqueia os botões.
  return (
    <Screen key={state.phase}>
      <ExerciseTransition reducedMotion={reducedMotion}>
      <Button label="Voltar às atividades" secondary icon="back" onPress={onExit} />
      <Header eyebrow={`EXERCÍCIO ${position} DE ${total}`} title={exercise.title}
        description={exercise.introduction} />
      <ExerciseProgress phase={state.phase} reducedMotion={reducedMotion} />
      {state.phase === 'answering' ? (
        <>
          <ExerciseScenario scenario={exercise.scenario} />
          <View style={uiStyles.section}>
            <Text accessibilityRole="header" style={textStyles.heading}>{exercise.question}</Text>
            <Text style={textStyles.detail}>Escolha uma alternativa e depois confirme sua resposta.</Text>
            <AnswerOptions options={exercise.options} selectedId={state.selectedId}
              onSelect={(optionId) => dispatch({ type: 'select', optionId })} reducedMotion={reducedMotion} />
          </View>
          <Button label="Confirmar resposta" icon="check" disabled={state.selectedId === null}
            hint={state.selectedId === null ? 'Selecione uma alternativa para confirmar' : 'Mostra o resultado e a explicação'}
            onPress={() => dispatch({ type: 'confirm' })} />
        </>
      ) : state.phase === 'feedback' ? (
        <>
          <AnswerFeedback result={state.result} reducedMotion={reducedMotion} />
          <Card>
            <Text accessibilityRole="header" style={textStyles.heading}>Para lembrar</Text>
            <Text style={textStyles.body}>{exercise.takeaway}</Text>
          </Card>
          <Button label="Continuar" onPress={() => {
            progress.complete(exercise.id, state.selectedId);
            dispatch({ type: 'continue' });
          }} />
        </>
      ) : (
        <>
          <Card tone="green">
            <FeedbackSymbol name="star" reducedMotion={reducedMotion} celebrate />
            <Badge label="Exercício concluído" icon="check" />
            <Text accessibilityRole="header" style={textStyles.heading}>Mais um cuidado para o dia a dia</Text>
            <Text style={textStyles.body}>{exercise.takeaway}</Text>
            <Text style={textStyles.detail}>Você terminou esta prática e conferiu a explicação. Pode repetir quantas vezes quiser.</Text>
            <Text style={textStyles.body}>{POINTS_PER_EXERCISE} pontos registrados para esta atividade.</Text>
            <Text style={textStyles.detail}>A recompensa vale pela conclusão. Repetir esta atividade não soma novos pontos.</Text>
          </Card>
          {moduleCompleted ? <Button label="Ver conclusão do módulo" onPress={onModuleSummary} />
            : onNext ? <Button label="Próximo exercício" onPress={onNext} /> : <Button label="Concluir prática" onPress={onExit} />}
          <Button label="Praticar novamente" secondary onPress={() => dispatch({ type: 'restart' })} />
        </>
      )}
      <Text style={uiStyles.note}>Pontos demonstrativos de aprendizagem: não medem sua segurança digital real. O progresso dura apenas esta sessão.</Text>
      </ExerciseTransition>
    </Screen>
  );
}
