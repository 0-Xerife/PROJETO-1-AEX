import type { Exercise } from './types';

export type AnswerResult = {
  correct: boolean;
  selectedLabel: string;
  correctLabel: string;
  explanation: string;
};

// Sem efeitos colaterais, pontuação, rede ou persistência.
export function evaluateAnswer(exercise: Exercise, optionId: string | null): AnswerResult | null {
  const selected = exercise.options.find((option) => option.id === optionId);
  const correct = exercise.options.find((option) => option.id === exercise.correctOptionId);
  if (!selected || !correct) return null;

  return {
    correct: selected.id === correct.id,
    selectedLabel: selected.label,
    correctLabel: correct.label,
    explanation: selected.explanation,
  };
}

export type ExerciseState =
  | { phase: 'answering'; selectedId: string | null }
  | { phase: 'feedback'; selectedId: string; result: AnswerResult }
  | { phase: 'completed'; selectedId: string; result: AnswerResult };

export type ExerciseAction =
  | { type: 'select'; optionId: string }
  | { type: 'confirm' }
  | { type: 'continue' }
  | { type: 'restart' };

export const initialExerciseState: ExerciseState = { phase: 'answering', selectedId: null };

export function transitionExercise(
  exercise: Exercise,
  state: ExerciseState,
  action: ExerciseAction,
): ExerciseState {
  switch (action.type) {
    case 'restart':
      return initialExerciseState;
    case 'select':
      if (state.phase !== 'answering' || !exercise.options.some((option) => option.id === action.optionId)) return state;
      return { phase: 'answering', selectedId: action.optionId };
    case 'confirm': {
      if (state.phase !== 'answering' || state.selectedId === null) return state;
      const result = evaluateAnswer(exercise, state.selectedId);
      return result ? { phase: 'feedback', selectedId: state.selectedId, result } : state;
    }
    case 'continue':
      return state.phase === 'feedback' ? { ...state, phase: 'completed' } : state;
  }
}
