import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises } from '../src/data/exercises.ts';
import { evaluateAnswer, initialExerciseState, transitionExercise } from '../src/exercises/evaluation.ts';

for (const exercise of exercises) {
  test(`${exercise.title}: identifica a alternativa correta e sua explicação`, () => {
    const result = evaluateAnswer(exercise, exercise.correctOptionId);
    assert.equal(result.correct, true);
    assert.equal(result.selectedLabel, result.correctLabel);
    assert.ok(result.explanation.length > 0);
  });

  test(`${exercise.title}: explica cada alternativa incorreta e informa a correta`, () => {
    for (const option of exercise.options.filter((item) => item.id !== exercise.correctOptionId)) {
      const result = evaluateAnswer(exercise, option.id);
      assert.equal(result.correct, false);
      assert.equal(result.selectedLabel, option.label);
      assert.equal(result.explanation, option.explanation);
      assert.equal(result.correctLabel, exercise.options.find((item) => item.id === exercise.correctOptionId).label);
    }
  });

  test(`${exercise.title}: rejeita resposta ausente ou desconhecida`, () => {
    assert.equal(evaluateAnswer(exercise, null), null);
    assert.equal(evaluateAnswer(exercise, ''), null);
    assert.equal(evaluateAnswer(exercise, 'opcao-inexistente'), null);
  });

  test(`${exercise.title}: conclui a prática após o feedback, mesmo quando a resposta é incorreta`, () => {
    for (const option of exercise.options) {
      const selected = transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: option.id });
      const feedback = transitionExercise(exercise, selected, { type: 'confirm' });
      assert.equal(feedback.phase, 'feedback');
      assert.equal(feedback.result.correct, option.id === exercise.correctOptionId);
      const completed = transitionExercise(exercise, feedback, { type: 'continue' });
      assert.equal(completed.phase, 'completed');
      assert.deepEqual(completed.result, feedback.result);
      assert.equal(transitionExercise(exercise, completed, { type: 'continue' }), completed);
    }
  });
}

const exercise = exercises[0];

test('não confirma nem avança antes de uma resposta válida', () => {
  assert.equal(transitionExercise(exercise, initialExerciseState, { type: 'confirm' }), initialExerciseState);
  assert.equal(transitionExercise(exercise, initialExerciseState, { type: 'continue' }), initialExerciseState);
  assert.equal(transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: 'inexistente' }), initialExerciseState);
  const selected = transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: exercise.correctOptionId });
  assert.equal(transitionExercise(exercise, selected, { type: 'continue' }), selected);
});

test('permite trocar a seleção antes de confirmar e preserva o estado anterior', () => {
  const first = transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: exercise.options[0].id });
  const second = transitionExercise(exercise, first, { type: 'select', optionId: exercise.correctOptionId });
  assert.equal(second.selectedId, exercise.correctOptionId);
  assert.equal(first.selectedId, exercise.options[0].id);
  assert.deepEqual(initialExerciseState, { phase: 'answering', selectedId: null });
});

test('bloqueia alterações de resposta e confirmações repetidas após avaliar', () => {
  const selected = transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: exercise.correctOptionId });
  const feedback = transitionExercise(exercise, selected, { type: 'confirm' });
  const completed = transitionExercise(exercise, feedback, { type: 'continue' });
  for (const state of [feedback, completed]) {
    assert.equal(transitionExercise(exercise, state, { type: 'select', optionId: exercise.options[0].id }), state);
    assert.equal(transitionExercise(exercise, state, { type: 'confirm' }), state);
  }
});

test('reiniciar limpa a seleção e o resultado', () => {
  const selected = transitionExercise(exercise, initialExerciseState, { type: 'select', optionId: exercise.correctOptionId });
  const feedback = transitionExercise(exercise, selected, { type: 'confirm' });
  const completed = transitionExercise(exercise, feedback, { type: 'continue' });
  for (const state of [selected, feedback, completed]) {
    assert.deepEqual(transitionExercise(exercise, state, { type: 'restart' }), { phase: 'answering', selectedId: null });
  }
});

test('um gabarito inválido não produz uma avaliação enganosa', () => {
  const invalid = { ...exercise, correctOptionId: 'inexistente' };
  assert.equal(evaluateAnswer(invalid, exercise.options[0].id), null);
  const selected = transitionExercise(invalid, initialExerciseState, { type: 'select', optionId: exercise.options[0].id });
  assert.equal(transitionExercise(invalid, selected, { type: 'confirm' }), selected);
});

test('fixtures têm IDs únicos, gabarito válido e endereços reservados para demonstração', () => {
  assert.equal(exercises.length, 3);
  assert.equal(new Set(exercises.map((item) => item.id)).size, exercises.length);
  for (const item of exercises) {
    assert.equal(new Set(item.options.map((option) => option.id)).size, item.options.length);
    assert.equal(item.options.filter((option) => option.id === item.correctOptionId).length, 1);
    if (item.scenario.address) assert.match(new URL(item.scenario.address).hostname, /\.invalid$/);
  }
});
