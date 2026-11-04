import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExercisePlayer } from '../../components/exercises/ExercisePlayer';
import { Button, Header, Screen } from '../../components/ui';
import { exercises } from '../../data/exercises';
import { colors } from '../../theme';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = exercises.findIndex((exercise) => exercise.id === id);
  const exercise = exercises[index];
  const next = exercises[index + 1];
  const exit = () => router.replace('/atividades');

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {exercise ? (
        <ExercisePlayer key={exercise.id} exercise={exercise} position={index + 1} total={exercises.length}
          onExit={exit} {...(next ? { onNext: () => router.replace(`/exercicio/${next.id}`) } : {})} />
      ) : (
        <Screen>
          <Header eyebrow="ATIVIDADES" title="Exercício não encontrado" description="Escolha uma das práticas disponíveis na lista de atividades." />
          <Button label="Ver atividades" onPress={exit} />
        </Screen>
      )}
    </SafeAreaView>
  );
}
