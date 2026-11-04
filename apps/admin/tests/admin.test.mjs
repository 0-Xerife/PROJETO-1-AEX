import assert from 'node:assert/strict';
import test from 'node:test';
import { adminFixtures } from '../src/data/adminFixtures.ts';
import { buildReport, createMockAdminService, filterParticipants, resultMetrics } from '../src/services/adminService.ts';

test('indicadores gerais refletem as fixtures e incluem repetições', async () => {
  const report = await createMockAdminService(adminFixtures).getReport();
  assert.equal(report.source, 'demonstrative');
  assert.deepEqual(report.metrics, { participants: 6, active: 5, completed: 1, simulations: 3, responses: 12, correct: 7, incorrect: 5, accuracy: 58.3 });
});

test('resultados por exercício reconciliam com o total', () => {
  const report = buildReport(adminFixtures);
  for (const key of ['responses', 'correct', 'incorrect']) {
    assert.equal(report.exercises.reduce((total, row) => total + row.metrics[key], 0), report.metrics[key]);
  }
  assert.deepEqual(report.exercises[0].metrics, { responses: 6, correct: 3, incorrect: 3, accuracy: 50 });
  assert.equal(report.exercises[0].participants, 5);
});

test('participantes distinguem respostas repetidas de conclusões únicas', () => {
  const ana = buildReport(adminFixtures).participants[0];
  assert.equal(ana.responses, 4);
  assert.equal(ana.summary.completed, 3);
  assert.equal(ana.summary.correct, 2);
  assert.equal(ana.summary.points, 30);
  assert.equal(ana.accuracy, 75);
  assert.equal(ana.status, 'completed');
});

test('resposta confirmada sem conclusão não conclui o percurso', () => {
  const carlos = buildReport(adminFixtures).participants[1];
  assert.equal(carlos.responses, 3);
  assert.equal(carlos.summary.completed, 2);
  assert.equal(carlos.status, 'started');
});

test('participante sem respostas não recebe percentual fictício', () => {
  const miguel = buildReport(adminFixtures).participants[5];
  assert.equal(miguel.accuracy, null);
  assert.equal(miguel.status, 'pending');
  assert.equal(miguel.summary.completed, 0);
});

test('base vazia suporta estado de ausência de dados sem divisão por zero', () => {
  const report = buildReport({ participants: [], exercises: [], results: [] });
  assert.equal(report.metrics.accuracy, null);
  assert.equal(report.metrics.completed, 0);
  assert.deepEqual(report.exercises, []);
  assert.deepEqual(report.participants, []);
  assert.deepEqual(resultMetrics([]), { responses: 0, correct: 0, incorrect: 0, accuracy: null });
});

test('base sem respostas mantém catálogo e participantes não iniciados', () => {
  const report = buildReport({ ...adminFixtures, results: [] });
  assert.equal(report.exercises.length, 3);
  assert.ok(report.exercises.every((row) => row.metrics.accuracy === null));
  assert.ok(report.participants.every((row) => row.status === 'pending'));
});

test('busca ignora acentos e combina situação, nome, turma e identificação', () => {
  const rows = buildReport(adminFixtures).participants;
  assert.equal(filterParticipants(rows, 'jose', 'all')[0].name, 'José Almeida');
  assert.equal(filterParticipants(rows, '  DEMO-001  ', 'completed').length, 1);
  assert.equal(filterParticipants(rows, 'Turma exemplo B', 'pending').length, 1);
  assert.equal(filterParticipants(rows, 'Ana', 'pending').length, 0);
  assert.equal(filterParticipants(rows, 'inexistente', 'all').length, 0);
});

test('fixture rejeita respostas duplicadas, de origem real ou sem referência válida', () => {
  const entry = adminFixtures.results[0];
  assert.throws(() => buildReport({ ...adminFixtures, results: [entry, entry] }));
  assert.throws(() => buildReport({ ...adminFixtures, results: [{ ...entry, participantId: 'unknown' }] }));
  assert.throws(() => buildReport({ ...adminFixtures, results: [{ ...entry, result: { ...entry.result, evaluation: 'server' } }] }));
});

test('todos os exemplos usam resultados demonstrativos e domínios reservados', () => {
  assert.ok(adminFixtures.results.every((entry) => entry.result.evaluation === 'demonstrative'));
  for (const exercise of adminFixtures.exercises) {
    if (exercise.scenario.address) assert.match(new URL(exercise.scenario.address).hostname, /\.invalid$/);
  }
});

test('o cálculo não altera fixtures nem depende da ordem de entrega dos resultados', () => {
  const before = JSON.stringify(adminFixtures);
  const first = buildReport(adminFixtures);
  const reversed = buildReport({ ...adminFixtures, results: [...adminFixtures.results].reverse() });
  assert.deepEqual(first, reversed);
  assert.equal(JSON.stringify(adminFixtures), before);
});
