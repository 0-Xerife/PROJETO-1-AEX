import type { ExerciseAttempt, ExerciseResult, TrainingProgress, TrainingService, PerformanceSummary, Achievement } from '@aex/types/training';
import type { Exercise } from '../exercises/types';
import type { AnswerResult } from '../exercises/evaluation';
import type { ProgressState } from '../progression/progression';

export interface ProgressStorage {
  read(): Promise<string | null>;
  write(value: string): Promise<void>;
}

type StoredAttempt = ExerciseAttempt & { completedAt: string | null };
type MockModel = {
  exercises: readonly Exercise[];
  evaluateAnswer: (exercise: Exercise, optionId: string | null) => AnswerResult | null;
  getSummary: (state: ProgressState, exercises: readonly Exercise[]) => PerformanceSummary;
  getAchievements: (state: ProgressState, exercises: readonly Exercise[]) => Achievement[];
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isDate = (value: unknown): value is string => typeof value === 'string'
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const isId = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);

/** Persistimos somente campos permitidos; nunca texto livre ou dados pessoais. */
function decode(raw: string | null, catalog: readonly Exercise[]): StoredAttempt[] {
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!isObject(parsed) || parsed.schemaVersion !== 1 || !Array.isArray(parsed.attempts)) {
    throw new Error('Formato de progresso não suportado.');
  }
  const ids = new Set<string>();
  return parsed.attempts.map((item: unknown) => {
    if (!isObject(item) || !isId(item.id) || ids.has(item.id) || typeof item.exerciseId !== 'string'
      || typeof item.selectedOptionId !== 'string' || !isDate(item.submittedAt)
      || !(item.completedAt === null || isDate(item.completedAt))) throw new Error('Histórico inválido.');
    const exercise = catalog.find((entry) => entry.id === item.exerciseId);
    if (!exercise?.options.some((option) => option.id === item.selectedOptionId)) throw new Error('Atividade desconhecida no histórico.');
    ids.add(item.id);
    return { id: item.id, exerciseId: item.exerciseId, selectedOptionId: item.selectedOptionId,
      submittedAt: item.submittedAt, completedAt: item.completedAt };
  });
}

/** Fábrica sem React ou acesso nativo: armazenamento e cálculos são injetáveis. */
export function createMockTrainingService(storage: ProgressStorage, model: MockModel, now = () => new Date().toISOString()): TrainingService {
  let records: StoredAttempt[] | null = null;
  let queue: Promise<unknown> = Promise.resolve();

  function serialize<T>(operation: () => Promise<T>): Promise<T> {
    const task = queue.then(operation);
    queue = task.catch(() => undefined);
    return task;
  }

  async function load() {
    if (records === null) records = decode(await storage.read(), model.exercises);
    return records;
  }

  async function save(next: StoredAttempt[]) {
    await storage.write(JSON.stringify({ schemaVersion: 1, attempts: next }));
    // Só publica a mudança depois de o armazenamento confirmar a gravação.
    records = next;
  }

  function resultFor(record: StoredAttempt): ExerciseResult {
    const exercise = model.exercises.find((item) => item.id === record.exerciseId);
    const answer = exercise ? model.evaluateAnswer(exercise, record.selectedOptionId) : null;
    if (!answer) throw new Error('Resposta inválida.');
    const { completedAt, ...attempt } = record;
    return { attempt, ...answer, completedAt, evaluation: 'demonstrative' };
  }

  function snapshot(current: StoredAttempt[]): TrainingProgress {
    const results = current.map(resultFor);
    const completions: ProgressState['completions'][number][] = [];
    for (const result of results) {
      if (result.completedAt && !completions.some((item) => item.exerciseId === result.attempt.exerciseId)) {
        completions.push({ exerciseId: result.attempt.exerciseId, correct: result.correct });
      }
    }
    const state = { completions };
    return {
      evaluation: 'demonstrative', completions, results,
      summary: {
        ...model.getSummary(state, model.exercises),
        exerciseStats: model.exercises.map((exercise) => {
          const attempts = results.filter((result) => result.attempt.exerciseId === exercise.id);
          const correct = attempts.filter((result) => result.correct).length;
          return { exerciseId: exercise.id, attempts: attempts.length, correct, incorrect: attempts.length - correct };
        }),
      },
      achievements: model.getAchievements(state, model.exercises),
      modules: [...new Set(model.exercises.map((exercise) => exercise.moduleId))].map((moduleId) => ({
        moduleId, ...model.getSummary(state, model.exercises.filter((exercise) => exercise.moduleId === moduleId)),
      })),
    };
  }

  return {
    getExercises: () => Promise.resolve(model.exercises.map(({ correctOptionId: _answer, options, ...exercise }) => ({
      ...exercise, scenario: { ...exercise.scenario }, options: options.map(({ id, label }) => ({ id, label })),
    }))),
    getProgress: () => serialize(async () => snapshot(await load())),
    submitAttempt: (input) => serialize(async () => {
      const current = await load();
      if (!isId(input.id)) throw new Error('Identificador inválido.');
      const previous = current.find((item) => item.id === input.id);
      if (previous) {
        if (previous.exerciseId !== input.exerciseId || previous.selectedOptionId !== input.selectedOptionId) throw new Error('Identificador já usado para outra resposta.');
        return resultFor(previous);
      }
      const record: StoredAttempt = { id: input.id, exerciseId: input.exerciseId,
        selectedOptionId: input.selectedOptionId, submittedAt: now(), completedAt: null };
      const result = resultFor(record);
      await save([...current, record]);
      return result;
    }),
    completeAttempt: (attemptId) => serialize(async () => {
      const current = await load();
      const record = current.find((item) => item.id === attemptId);
      if (!record) throw new Error('Confirme uma resposta antes de concluir.');
      if (record.completedAt) return snapshot(current);
      // A ordem das conclusões preserva o primeiro resultado, mesmo fora de ordem.
      const next = [...current.filter((item) => item.id !== attemptId), { ...record, completedAt: now() }];
      await save(next);
      return snapshot(next);
    }),
  };
}
