import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import type { Exercise, ExerciseResult } from '@aex/types/training';
import { textStyles } from '../../theme';
import { Badge, Button, Card, Header, Screen, uiStyles } from '../ui';
import { AnswerFeedback } from './AnswerFeedback';
import { AnswerOptions } from './AnswerOptions';
import { ExerciseScenario } from './ExerciseScenario';
import { ExerciseProgress } from './ExerciseProgress';
import { ExerciseTransition, FeedbackSymbol, useExerciseReducedMotion } from './motion';
import { useProgress } from '../../progression/ProgressProvider';

type PlayerState = { phase: 'answering'; selectedId: string | null }
  | { phase: 'feedback' | 'completed'; selectedId: string; result: ExerciseResult };

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
  const [state, setState] = useState<PlayerState>({ phase: 'answering', selectedId: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const requestId = useRef<string | null>(null);

  async function confirm() {
    if (busy.current || state.phase !== 'answering' || !state.selectedId) return;
    busy.current = true;
    setSaving(true);
    setError(null);
    requestId.current ??= `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const result = await progress.submit({ id: requestId.current, exerciseId: exercise.id, selectedOptionId: state.selectedId });
      setState({ phase: 'feedback', selectedId: state.selectedId, result });
    } catch {
      setError('Não foi possível salvar sua resposta. Sua escolha foi mantida. Toque em Confirmar resposta para tentar novamente.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  async function finish() {
    if (busy.current || state.phase !== 'feedback') return;
    busy.current = true;
    setSaving(true);
    setError(null);
    try {
      await progress.complete(state.result.attempt.id);
      setState({ ...state, phase: 'completed' });
    } catch {
      setError('Não foi possível salvar a conclusão. Sua resposta já está no histórico. Toque em Continuar para tentar novamente.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

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
      <Button label="Voltar às atividades" secondary icon="back" onPress={onExit} disabled={saving} />
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
              onSelect={(optionId) => {
                if (busy.current) return;
                if (state.selectedId !== optionId) requestId.current = null;
                setError(null);
                setState({ phase: 'answering', selectedId: optionId });
              }} reducedMotion={reducedMotion} disabled={saving} />
          </View>
          <Button label={saving ? 'Salvando resposta…' : 'Confirmar resposta'} icon="check" disabled={state.selectedId === null || saving}
            hint={state.selectedId === null ? 'Selecione uma alternativa para confirmar' : 'Mostra o resultado e a explicação'}
            onPress={() => { void confirm(); }} />
        </>
      ) : state.phase === 'feedback' ? (
        <>
          <AnswerFeedback result={state.result} reducedMotion={reducedMotion} />
          <Card>
            <Text accessibilityRole="header" style={textStyles.heading}>Para lembrar</Text>
            <Text style={textStyles.body}>{exercise.takeaway}</Text>
          </Card>
          <Button label={saving ? 'Salvando conclusão…' : 'Continuar'} disabled={saving} onPress={() => { void finish(); }} />
        </>
      ) : (
        <>
          <Card tone="green">
            <FeedbackSymbol name="star" reducedMotion={reducedMotion} celebrate />
            <Badge label="Exercício concluído" icon="check" />
            <Text accessibilityRole="header" style={textStyles.heading}>Mais um cuidado para o dia a dia</Text>
            <Text style={textStyles.body}>{exercise.takeaway}</Text>
            <Text style={textStyles.detail}>Você terminou esta prática e conferiu a explicação. Pode repetir quantas vezes quiser.</Text>
            <Text style={textStyles.body}>Seu total: {progress.summary.points} pontos de aprendizagem.</Text>
            <Text style={textStyles.detail}>A recompensa vale pela conclusão. Repetir esta atividade não soma novos pontos.</Text>
          </Card>
          {moduleCompleted ? <Button label="Ver conclusão do módulo" onPress={onModuleSummary} />
            : onNext ? <Button label="Próximo exercício" onPress={onNext} /> : <Button label="Concluir prática" onPress={onExit} />}
          <Button label="Praticar novamente" secondary onPress={() => {
            requestId.current = null;
            setError(null);
            setState({ phase: 'answering', selectedId: null });
          }} />
        </>
      )}
      {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={textStyles.body}>{error}</Text> : null}
      <Text style={uiStyles.note}>Avaliação local demonstrativa. As respostas e o progresso ficam salvos neste aparelho. Os pontos não medem sua segurança digital real.</Text>
      </ExerciseTransition>
    </Screen>
  );
}
