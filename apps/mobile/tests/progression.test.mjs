import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises } from '../src/data/exercises.ts';
import { completeExercise, getAchievements, getModuleProgress, getSummary, initialProgress } from '../src/progression/progression.ts';

const first = exercises[0];
const wrong = first.options.find((option) => option.id !== first.correctOptionId).id;

test('a sessão começa sem pontos, conclusões ou conquistas', () => {
  assert.deepEqual(getSummary(initialProgress, exercises), { total: 3, completed: 0, correct: 0, reviewed: 0, points: 0, isComplete: false });
  assert.ok(getAchievements(initialProgress, exercises).every((item) => !item.unlocked));
});

test('concluir com erro dá os mesmos pontos que concluir com acerto', () => {
  const incorrect = completeExercise(initialProgress, exercises, first.id, wrong);
  const correct = completeExercise(initialProgress, exercises, first.id, first.correctOptionId);
  assert.equal(getSummary(incorrect, exercises).points, 10);
  assert.equal(getSummary(correct, exercises).points, 10);
  assert.equal(getSummary(incorrect, exercises).reviewed, 1);
  assert.equal(getSummary(correct, exercises).correct, 1);
});

test('repetições e confirmações duplicadas não acumulam pontos nem alteram o primeiro resultado', () => {
  const state = completeExercise(initialProgress, exercises, first.id, wrong);
  let repeated = state;
  for (let index = 0; index < 100; index++) repeated = completeExercise(repeated, exercises, first.id, first.correctOptionId);
  assert.equal(repeated, state);
  assert.equal(getSummary(repeated, exercises).points, 10);
  assert.equal(getSummary(repeated, exercises).correct, 0);
});

test('IDs e alternativas inválidos não geram recompensas', () => {
  assert.equal(completeExercise(initialProgress, exercises, 'desconhecido', wrong), initialProgress);
  assert.equal(completeExercise(initialProgress, exercises, first.id, 'desconhecido'), initialProgress);
  assert.equal(completeExercise(initialProgress, exercises, first.id, ''), initialProgress);
});

test('a primeira conclusão de phishing libera Primeiro passo e Olhar atento mesmo com erro', () => {
  const state = completeExercise(initialProgress, exercises, first.id, wrong);
  assert.deepEqual(getAchievements(state, exercises).filter((item) => item.unlocked).map((item) => item.title), ['Primeiro passo', 'Olhar atento']);
});

test('atividade sem phishing não libera Olhar atento', () => {
  const exercise = exercises.find((item) => item.category !== 'phishing');
  const state = completeExercise(initialProgress, exercises, exercise.id, exercise.correctOptionId);
  assert.deepEqual(getAchievements(state, exercises).filter((item) => item.unlocked).map((item) => item.title), ['Primeiro passo']);
});

test('módulo parcial não libera Mais preparado', () => {
  const state = completeExercise(initialProgress, exercises, first.id, wrong);
  const module = getModuleProgress(state, exercises, first.moduleId);
  assert.equal(module.completed, 1);
  assert.equal(module.total, 3);
  assert.equal(module.isComplete, false);
  assert.equal(getAchievements(state, exercises).find((item) => item.id === 'module').unlocked, false);
});

test('concluir todas fora de ordem e com erros libera módulo e todas as conquistas', () => {
  const state = [...exercises].reverse().reduce((current, exercise) => completeExercise(current, exercises, exercise.id,
    exercise.options.find((option) => option.id !== exercise.correctOptionId).id), initialProgress);
  assert.deepEqual(getModuleProgress(state, exercises, first.moduleId), { total: 3, completed: 3, correct: 0, reviewed: 3, points: 30, isComplete: true });
  assert.ok(getAchievements(state, exercises).every((item) => item.unlocked));
});

test('progresso de um módulo não inclui exercícios de outro módulo', () => {
  const catalog = [...exercises, { ...first, id: 'outro', moduleId: 'outro-modulo' }];
  const state = completeExercise(initialProgress, catalog, 'outro', first.correctOptionId);
  assert.equal(getModuleProgress(state, catalog, first.moduleId).completed, 0);
  assert.equal(getModuleProgress(state, catalog, 'outro-modulo').isComplete, true);
});

test('módulos vazios e desconhecidos não são considerados concluídos', () => {
  assert.equal(getModuleProgress(initialProgress, exercises, 'senhas').isComplete, false);
  assert.equal(getModuleProgress(initialProgress, exercises, 'desconhecido').isComplete, false);
  assert.equal(getSummary(initialProgress, []).isComplete, false);
});

test('cálculo não modifica o estado de origem e uma nova sessão começa zerada', () => {
  const state = completeExercise(initialProgress, exercises, first.id, wrong);
  assert.equal(state.completions.length, 1);
  assert.deepEqual(initialProgress, { completions: [] });
  assert.equal(getSummary({ completions: [] }, exercises).points, 0);
});
