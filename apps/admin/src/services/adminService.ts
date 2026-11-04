import type { Exercise, ExerciseResult, ParticipantSummary } from '@aex/types/training';

export type Participant = { id: string; name: string; group: string };
export type AdminDataset = {
  participants: readonly Participant[];
  exercises: readonly Exercise[];
  results: readonly { participantId: string; result: ExerciseResult }[];
};
export type ResultMetrics = { responses: number; correct: number; incorrect: number; accuracy: number | null };
export type ParticipantRow = Participant & ResultMetrics & { summary: ParticipantSummary; status: 'completed' | 'started' | 'pending' };
export type ExerciseRow = { exercise: Exercise; metrics: ResultMetrics; participants: number };
export type AdminReport = {
  source: 'demonstrative';
  participants: ParticipantRow[];
  exercises: ExerciseRow[];
  metrics: ResultMetrics & { participants: number; active: number; completed: number; simulations: number };
};
export interface AdminService { getReport(): Promise<AdminReport> }

export function resultMetrics(results: readonly ExerciseResult[]): ResultMetrics {
  const correct = results.filter((result) => result.correct).length;
  return { responses: results.length, correct, incorrect: results.length - correct,
    accuracy: results.length > 0 ? Math.round(correct / results.length * 1000) / 10 : null };
}

export function buildReport(data: AdminDataset): AdminReport {
  const ids = new Set<string>();
  for (const { participantId, result } of data.results) {
    const exercise = data.exercises.find((item) => item.id === result.attempt.exerciseId);
    if (!data.participants.some((participant) => participant.id === participantId)
      || !exercise?.options.some((option) => option.id === result.attempt.selectedOptionId)
      || result.evaluation !== 'demonstrative' || ids.has(result.attempt.id)) throw new Error('Fixture administrativa inválida.');
    ids.add(result.attempt.id);
  }
  const participants = data.participants.map((participant): ParticipantRow => {
    const results = data.results.filter((entry) => entry.participantId === participant.id).map((entry) => entry.result);
    const firstCompletions = new Map<string, ExerciseResult>();
    for (const result of [...results].sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''))) {
      if (result.completedAt && !firstCompletions.has(result.attempt.exerciseId)) firstCompletions.set(result.attempt.exerciseId, result);
    }
    const completed = firstCompletions.size;
    const correct = [...firstCompletions.values()].filter((result) => result.correct).length;
    const isComplete = data.exercises.length > 0 && completed === data.exercises.length;
    const summary: ParticipantSummary = {
      total: data.exercises.length, completed, correct, reviewed: completed - correct,
      points: completed * 10, isComplete,
      exerciseStats: data.exercises.map((exercise) => {
        const metrics = resultMetrics(results.filter((result) => result.attempt.exerciseId === exercise.id));
        return { exerciseId: exercise.id, attempts: metrics.responses, correct: metrics.correct, incorrect: metrics.incorrect };
      }),
    };
    return { ...participant, ...resultMetrics(results), summary,
      status: isComplete ? 'completed' : results.length > 0 ? 'started' : 'pending' };
  });
  return {
    source: 'demonstrative', participants,
    exercises: data.exercises.map((exercise) => {
      const entries = data.results.filter((entry) => entry.result.attempt.exerciseId === exercise.id);
      return { exercise, metrics: resultMetrics(entries.map((entry) => entry.result)), participants: new Set(entries.map((entry) => entry.participantId)).size };
    }),
    metrics: { ...resultMetrics(data.results.map((entry) => entry.result)), participants: participants.length,
      active: participants.filter((participant) => participant.responses > 0).length,
      completed: participants.filter((participant) => participant.status === 'completed').length, simulations: data.exercises.length },
  };
}

export function filterParticipants(rows: readonly ParticipantRow[], query: string, status: string): ParticipantRow[] {
  const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const search = normalized(query.trim());
  return rows.filter((row) => normalized(`${row.name} ${row.id} ${row.group}`).includes(search)
    && (status === 'all' || row.status === status));
}

export function createMockAdminService(data: AdminDataset): AdminService {
  return { getReport: () => Promise.resolve(buildReport(data)) };
}
