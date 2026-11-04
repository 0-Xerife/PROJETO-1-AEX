import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Achievements, LocalProgressNote, PerformanceSummary } from '../../components/LearningRewards';
import { Badge, Button, Header, Screen } from '../../components/ui';
import { FeedbackSymbol, useExerciseReducedMotion } from '../../components/exercises/motion';
import { exercises } from '../../data/exercises';
import { useProgress } from '../../progression/ProgressProvider';
import { getModuleProgress } from '../../progression/progression';
import { colors, textStyles } from '../../theme';

export default function ModuleCompletionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, modules } = useProgress();
  const reducedMotion = useExerciseReducedMotion();
  const module = modules.find((item) => item.id === id);
  const summary = getModuleProgress(state, exercises, id);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen>
        {module && summary.isComplete ? (
          <>
            <FeedbackSymbol name="star" reducedMotion={reducedMotion} celebrate />
            <Badge label="Módulo concluído" icon="check" />
            <Header eyebrow="MAIS UM PASSO" title={module.title} description="Você concluiu todas as atividades e conferiu as explicações. Muito bem!" />
            <PerformanceSummary summary={summary} />
            <Achievements />
            <Button label="Rever módulo" secondary onPress={() => router.replace(`/atividade/${module.id}`)} />
          </>
        ) : (
          <>
            <Header eyebrow="SUA JORNADA" title={module ? 'Continue no seu ritmo' : 'Módulo não encontrado'} />
            <Text style={textStyles.body}>O resumo de conclusão fica disponível depois de terminar todas as atividades do módulo.</Text>
            {module ? <Button label="Ver módulo" onPress={() => router.replace(`/atividade/${module.id}`)} /> : null}
          </>
        )}
        <Button label="Voltar ao início" icon="home" onPress={() => router.replace('/')} />
        <LocalProgressNote />
      </Screen>
    </SafeAreaView>
  );
}
