import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises } from '../src/data/exercises.ts';
import { evaluateAnswer } from '../src/exercises/evaluation.ts';
import { getAchievements, getSummary } from '../src/progression/progression.ts';
import { createMockTrainingService } from '../src/services/mockTrainingService.ts';

const model = { exercises, evaluateAnswer, getSummary, getAchievements };
const timestamp = '2026-11-03T12:00:00.000Z';
const first = exercises[0];
const wrongId = first.options.find((option) => option.id !== first.correctOptionId).id;
const attempt = (id = 'attempt-1', exercise = first, selectedOptionId = exercise.correctOptionId) => ({ id, exerciseId: exercise.id, selectedOptionId });

function setup(raw = null) {
  let value = raw;
  let writes = 0;
  let failWrite = false;
  let failRead = false;
  const storage = {
    read() { return failRead ? Promise.reject(new Error('read failed')) : Promise.resolve(value); },
    write(next) {
      writes++;
      if (failWrite) return Promise.reject(new Error('write failed'));
      value = next;
      return Promise.resolve();
    },
  };
  return {
    create: () => createMockTrainingService(storage, model, () => timestamp),
    raw: () => value,
    writes: () => writes,
    failWrites: (enabled) => { failWrite = enabled; },
    failReads: (enabled) => { failRead = enabled; },
  };
}

test('carregamento inicial não grava estado vazio e catálogo público não revela gabarito', async () => {
  const store = setup();
  const service = store.create();
  const progress = await service.getProgress();
  assert.equal(progress.summary.points, 0);
  assert.equal(store.writes(), 0);
  const catalog = await service.getExercises();
  assert.equal(catalog.length, 3);
  for (const exercise of catalog) {
    assert.equal('correctOptionId' in exercise, false);
    assert.ok(exercise.options.every((option) => !('explanation' in option)));
  }
});

test('confirmar registra resultado demonstrativo, sem dar pontos antes de concluir', async () => {
  const store = setup();
  const service = store.create();
  const result = await service.submitAttempt(attempt('answer', first, wrongId));
  assert.equal(result.correct, false);
  assert.equal(result.evaluation, 'demonstrative');
  assert.equal(result.attempt.submittedAt, timestamp);
  assert.equal(result.completedAt, null);
  const progress = await service.getProgress();
  assert.equal(progress.results.length, 1);
  assert.equal(progress.summary.points, 0);
  assert.deepEqual(progress.summary.exerciseStats[0], { exerciseId: first.id, attempts: 1, correct: 0, incorrect: 1 });
});

test('fechar e reabrir restaura histórico, conclusões, pontos, módulos e conquistas', async () => {
  const store = setup();
  const service = store.create();
  for (const exercise of exercises) {
    await service.submitAttempt(attempt(exercise.id, exercise));
    await service.completeAttempt(exercise.id);
  }
  const before = await service.getProgress();
  const after = await store.create().getProgress();
  assert.deepEqual(after, before);
  assert.equal(after.summary.points, 30);
  assert.equal(after.modules[0].isComplete, true);
  assert.ok(after.achievements.every((achievement) => achievement.unlocked));
});

test('resposta sem conclusão também é recuperada ao reabrir', async () => {
  const store = setup();
  await store.create().submitAttempt(attempt());
  const restored = store.create();
  assert.equal((await restored.getProgress()).summary.completed, 0);
  assert.equal((await restored.getProgress()).results.length, 1);
  assert.equal((await restored.completeAttempt('attempt-1')).summary.points, 10);
});

test('reenvio idempotente e conclusão repetida sobrevivem ao reinício sem duplicação', async () => {
  const store = setup();
  const service = store.create();
  await service.submitAttempt(attempt());
  await service.completeAttempt('attempt-1');
  const writes = store.writes();
  const restored = store.create();
  await restored.submitAttempt(attempt());
  const progress = await restored.completeAttempt('attempt-1');
  assert.equal(progress.results.length, 1);
  assert.equal(progress.summary.points, 10);
  assert.equal(store.writes(), writes);
});

test('novas tentativas mantêm acertos e erros, sem multiplicar pontos nem mudar a primeira conclusão', async () => {
  const service = setup().create();
  await service.submitAttempt(attempt('wrong', first, wrongId));
  await service.completeAttempt('wrong');
  await service.submitAttempt(attempt('right'));
  const progress = await service.completeAttempt('right');
  assert.equal(progress.summary.points, 10);
  assert.equal(progress.summary.correct, 0);
  assert.equal(progress.summary.reviewed, 1);
  assert.deepEqual(progress.summary.exerciseStats[0], { exerciseId: first.id, attempts: 2, correct: 1, incorrect: 1 });
});

test('primeira conclusão considera a ordem de conclusão, não a ordem de envio', async () => {
  const store = setup();
  const service = store.create();
  await service.submitAttempt(attempt('earlier', first, wrongId));
  await service.submitAttempt(attempt('later'));
  await service.completeAttempt('later');
  await service.completeAttempt('earlier');
  assert.equal((await store.create().getProgress()).summary.correct, 1);
});

test('envios e conclusões concorrentes são serializados sem perder dados', async () => {
  const store = setup();
  const service = store.create();
  await Promise.all(exercises.map((exercise) => service.submitAttempt(attempt(exercise.id, exercise))));
  await Promise.all(exercises.flatMap((exercise) => [service.completeAttempt(exercise.id), service.completeAttempt(exercise.id)]));
  const restored = await store.create().getProgress();
  assert.equal(restored.results.length, 3);
  assert.equal(restored.summary.points, 30);
});

test('falha de gravação não anuncia sucesso; repetir o envio não duplica o histórico', async () => {
  const store = setup();
  const service = store.create();
  store.failWrites(true);
  await assert.rejects(service.submitAttempt(attempt()));
  assert.equal((await service.getProgress()).results.length, 0);
  store.failWrites(false);
  await service.submitAttempt(attempt());
  assert.equal((await store.create().getProgress()).results.length, 1);
});

test('falha ao salvar conclusão preserva a resposta e permite tentar novamente', async () => {
  const store = setup();
  const service = store.create();
  await service.submitAttempt(attempt());
  store.failWrites(true);
  await assert.rejects(service.completeAttempt('attempt-1'));
  assert.equal((await service.getProgress()).summary.points, 0);
  assert.equal((await store.create().getProgress()).results.length, 1);
  store.failWrites(false);
  assert.equal((await service.completeAttempt('attempt-1')).summary.points, 10);
});

test('falha de leitura não substitui dados e pode ser repetida', async () => {
  const store = setup();
  await store.create().submitAttempt(attempt());
  const service = store.create();
  store.failReads(true);
  await assert.rejects(service.getProgress());
  assert.equal(store.writes(), 1);
  store.failReads(false);
  assert.equal((await service.getProgress()).results.length, 1);
});

test('JSON inválido, versão futura e registros inválidos não são sobrescritos', async () => {
  const record = { ...attempt(), submittedAt: timestamp, completedAt: null };
  const invalid = ['{', JSON.stringify({ schemaVersion: 2, attempts: [] }),
    JSON.stringify({ schemaVersion: 1, attempts: [record, record] }),
    JSON.stringify({ schemaVersion: 1, attempts: [{ ...record, submittedAt: 'amanhã' }] }),
    JSON.stringify({ schemaVersion: 1, attempts: [{ ...record, selectedOptionId: 'unknown' }] })];
  for (const raw of invalid) {
    const store = setup(raw);
    const service = store.create();
    await assert.rejects(service.getProgress());
    await assert.rejects(service.submitAttempt(attempt()));
    assert.equal(store.raw(), raw);
    assert.equal(store.writes(), 0);
  }
});

test('rejeita exercício/opção desconhecidos, conclusão sem resposta e reuso conflitante de ID', async () => {
  const service = setup().create();
  await assert.rejects(service.submitAttempt({ ...attempt(), exerciseId: 'unknown' }));
  await assert.rejects(service.submitAttempt({ ...attempt(), selectedOptionId: 'unknown' }));
  await assert.rejects(service.completeAttempt('unknown'));
  await service.submitAttempt(attempt());
  await assert.rejects(service.submitAttempt(attempt('attempt-1', first, wrongId)));
  assert.equal((await service.getProgress()).results.length, 1);
});

test('persistência usa lista explícita de campos, sem aceitar texto livre ou resultados do cliente', async () => {
  const store = setup();
  await store.create().submitAttempt({ ...attempt(), freeText: 'conteudo-nao-permitido', correct: false, points: 999 });
  const saved = JSON.parse(store.raw());
  assert.deepEqual(Object.keys(saved.attempts[0]).sort(), ['completedAt', 'exerciseId', 'id', 'selectedOptionId', 'submittedAt']);
  assert.equal(store.raw().includes('conteudo-nao-permitido'), false);
});
