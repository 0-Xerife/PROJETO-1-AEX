import type { Exercise as PublicExercise, ExerciseOption as PublicOption } from '@aex/types/training';

// Gabarito restrito ao mock local; não faz parte do contrato público da API.
export type ExerciseOption = PublicOption & { explanation: string };
export type Exercise = Omit<PublicExercise, 'options'> & {
  options: readonly ExerciseOption[];
  correctOptionId: string;
};
