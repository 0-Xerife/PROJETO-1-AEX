import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { Exercise, ExerciseAttempt, TrainingProgress } from '@aex/types/training';
import { modules as moduleFixtures, type LearningModule } from '../data/learning';
import { Button, Header, Screen } from '../components/ui';
import { trainingService } from '../services/trainingService';

function useProgressValue(exercises: readonly Exercise[], initial: TrainingProgress) {
  const [state, setState] = useState(initial);
  const modules: LearningModule[] = moduleFixtures.map((module) => {
    const progress = state.modules.find((item) => item.moduleId === module.id);
    return { ...module, lessons: progress?.total ?? 0, completed: progress?.completed ?? 0,
      status: progress?.isComplete ? 'completed' : progress && progress.total > 0 ? 'current' : 'locked' };
  });
  return {
    state, modules, exercises,
    summary: state.summary,
    achievements: state.achievements,
    recommendedModule: modules.find((module) => module.status === 'current') ?? modules.find((module) => module.status === 'completed'),
    submit: async (attempt: Omit<ExerciseAttempt, 'submittedAt'>) => {
      const result = await trainingService.submitAttempt(attempt);
      setState(await trainingService.getProgress());
      return result;
    },
    complete: async (attemptId: string) => {
      const progress = await trainingService.completeAttempt(attemptId);
      setState(progress);
    },
    isCompleted: (exerciseId: string) => state.completions.some((item) => item.exerciseId === exerciseId),
  };
}

const ProgressContext = createContext<ReturnType<typeof useProgressValue> | null>(null);

function ReadyProgressProvider({ children, exercises, progress }: PropsWithChildren<{
  exercises: readonly Exercise[]; progress: TrainingProgress;
}>) {
  const value = useProgressValue(exercises, progress);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

type LoadState = { status: 'loading' | 'failed' }
  | { status: 'ready'; exercises: readonly Exercise[]; progress: TrainingProgress };

export function ProgressProvider({ children }: PropsWithChildren) {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    void Promise.all([trainingService.getExercises(), trainingService.getProgress()]).then(([exercises, progress]) => {
      if (active) setLoad({ status: 'ready', exercises, progress });
    }).catch(() => {
      if (active) setLoad({ status: 'failed' });
    });
    return () => { active = false; };
  }, [retry]);

  if (load.status === 'ready') {
    return <ReadyProgressProvider exercises={load.exercises} progress={load.progress}>{children}</ReadyProgressProvider>;
  }
  return (
    <Screen>
      <Header eyebrow="AEX" title={load.status === 'loading' ? 'Recuperando seu progresso…' : 'Não foi possível recuperar seu progresso'}
        description={load.status === 'loading' ? 'Só um instante. Vamos continuar de onde você parou.' : 'Seus dados salvos não foram substituídos. Tente novamente para continuar.'} />
      {load.status === 'failed' ? <Button label="Tentar novamente" onPress={() => {
        setLoad({ status: 'loading' });
        setRetry((value) => value + 1);
      }} /> : null}
    </Screen>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('ProgressProvider é necessário para acessar o progresso.');
  return context;
}
