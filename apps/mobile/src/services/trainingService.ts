import type { TrainingService } from '@aex/types/training';
import { exercises } from '../data/exercises';
import { evaluateAnswer } from '../exercises/evaluation';
import { getAchievements, getSummary } from '../progression/progression';
import { createMockTrainingService } from './mockTrainingService';
import { progressStorage } from './progressStorage';

// Único ponto de composição: substituir por um adaptador REST quando a API existir.
export const trainingService: TrainingService = createMockTrainingService(progressStorage, {
  exercises, evaluateAnswer, getAchievements, getSummary,
});
