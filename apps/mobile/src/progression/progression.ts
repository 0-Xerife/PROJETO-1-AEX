import type { Exercise } from '../exercises/types';

export const POINTS_PER_EXERCISE = 10;
export type Completion = { exerciseId: string; correct: boolean };
export type ProgressState = { completions: readonly Completion[] };
export const initialProgress: ProgressState = { completions: [] };

export function completeExercise(state: ProgressState, exercises: readonly Exercise[], exerciseId: string, optionId: string): ProgressState {
  const exercise = exercises.find((item) => item.id === exerciseId);
  if (!exercise || !exercise.options.some((option) => option.id === optionId)
    || state.completions.some((item) => item.exerciseId === exerciseId)) return state;
  return { completions: [...state.completions, { exerciseId, correct: optionId === exercise.correctOptionId }] };
}

export function getSummary(state: ProgressState, exercises: readonly Exercise[]) {
  const completed = exercises.filter((exercise) => state.completions.some((item) => item.exerciseId === exercise.id));
  const correct = completed.filter((exercise) => state.completions.find((item) => item.exerciseId === exercise.id)?.correct).length;
  return {
    total: exercises.length,
    completed: completed.length,
    correct,
    reviewed: completed.length - correct,
    points: completed.length * POINTS_PER_EXERCISE,
    isComplete: exercises.length > 0 && completed.length === exercises.length,
  };
}

export function getModuleProgress(state: ProgressState, exercises: readonly Exercise[], moduleId: string) {
  return getSummary(state, exercises.filter((exercise) => exercise.moduleId === moduleId));
}

export function getAchievements(state: ProgressState, exercises: readonly Exercise[]) {
  const hasPhishing = exercises.some((exercise) => exercise.category === 'phishing'
    && state.completions.some((item) => item.exerciseId === exercise.id));
  const hasModule = [...new Set(exercises.map((exercise) => exercise.moduleId))]
    .some((id) => getModuleProgress(state, exercises, id).isComplete);
  return [
    { id: 'first', title: 'Primeiro passo', description: 'Concluir a primeira atividade.', unlocked: getSummary(state, exercises).completed > 0 },
    { id: 'phishing', title: 'Olhar atento', description: 'Concluir uma atividade de phishing.', unlocked: hasPhishing },
    { id: 'module', title: 'Mais preparado', description: 'Concluir um módulo.', unlocked: hasModule },
  ];
}
