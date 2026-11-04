import { createContext, useContext, useReducer, type PropsWithChildren } from 'react';
import { exercises } from '../data/exercises';
import { modules as moduleFixtures, type LearningModule } from '../data/learning';
import { completeExercise, getAchievements, getModuleProgress, getSummary, initialProgress } from './progression';

function useProgressValue() {
  const [state, dispatch] = useReducer(
    (current: typeof initialProgress, action: { exerciseId: string; optionId: string }) =>
      completeExercise(current, exercises, action.exerciseId, action.optionId), initialProgress,
  );
  const modules: LearningModule[] = moduleFixtures.map((module) => {
    const progress = getModuleProgress(state, exercises, module.id);
    return { ...module, lessons: progress.total, completed: progress.completed,
      status: progress.isComplete ? 'completed' : progress.total > 0 ? 'current' : 'locked' };
  });
  return {
    state, modules,
    summary: getSummary(state, exercises),
    achievements: getAchievements(state, exercises),
    recommendedModule: modules.find((module) => module.status === 'current') ?? modules.find((module) => module.status === 'completed'),
    complete: (exerciseId: string, optionId: string) => dispatch({ exerciseId, optionId }),
    isCompleted: (exerciseId: string) => state.completions.some((item) => item.exerciseId === exerciseId),
  };
}

const ProgressContext = createContext<ReturnType<typeof useProgressValue> | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const value = useProgressValue();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('ProgressProvider é necessário para acessar o progresso.');
  return context;
}
