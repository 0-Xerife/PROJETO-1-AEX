import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, makeCampaign, makeAttempt, summarize, initialState, validState } from '../public/domain.js';

test('cada cenário tem uma ação segura e explicações para todas as respostas', () => {
  assert.equal(scenarios.length, 3);
  assert.equal(new Set(scenarios.map(s => s.id)).size, scenarios.length);
  for (const scenario of scenarios) {
    assert.equal(scenario.choices.filter(c => c.safe).length, 1);
    assert.ok(scenario.warning.length > 0);
    assert.ok(scenario.choices.every(c => c.text && c.explanation));
  }
});

test('treinamentos exigem título e cenário válidos', () => {
  assert.throws(() => makeCampaign('  ', 'familiar', '1'));
  assert.throws(() => makeCampaign('x'.repeat(81), 'familiar', '1'));
  assert.throws(() => makeCampaign('Oficina', 'inexistente', '1'));
  assert.equal(makeCampaign('  Oficina  ', 'sms', '1').title, 'Oficina');
});

test('resultado corresponde à alternativa escolhida nos três cenários', () => {
  for (const scenario of scenarios) {
    const campaign = makeCampaign('Oficina', scenario.id, 'campaign');
    scenario.choices.forEach((choice, index) => {
      const attempt = makeAttempt(campaign, index, 'attempt');
      assert.equal(attempt.safe, choice.safe);
      assert.equal(attempt.campaignId, campaign.id);
      assert.equal(attempt.campaignTitle, campaign.title);
      assert.equal(attempt.scenarioId, scenario.id);
    });
    assert.throws(() => makeAttempt(campaign, -1, 'bad'));
    assert.throws(() => makeAttempt(campaign, 9, 'bad'));
    assert.throws(() => makeAttempt(campaign, '1', 'bad'));
  }
});

test('resumo distingue ausência de dados de taxa zero', () => {
  assert.deepEqual(summarize([]), { total: 0, safe: 0, percentage: null });
  assert.deepEqual(summarize([{ safe: false }]), { total: 1, safe: 0, percentage: 0 });
  assert.deepEqual(summarize([{ safe: true }, { safe: false }, { safe: true }]), { total: 3, safe: 2, percentage: 67 });
});

test('persistência aceita estado válido e rejeita dados incoerentes', () => {
  const state = initialState();
  state.attempts.push(makeAttempt(state.campaign, 1, 'a'));
  assert.ok(validState(JSON.parse(JSON.stringify(state))));
  assert.equal(validState(null), false);
  assert.equal(validState({ ...state, version: 2 }), false);
  assert.equal(validState({ ...state, campaign: { ...state.campaign, scenarioId: 'unknown' } }), false);
  assert.equal(validState({ ...state, attempts: [{ ...state.attempts[0], safe: false }] }), false);
  assert.equal(validState({ ...state, attempts: [{ ...state.attempts[0], createdAt: 'invalid' }] }), false);
});

test('trocar treinamento não altera o vínculo das tentativas anteriores', () => {
  const state = initialState();
  state.attempts.push(makeAttempt(state.campaign, 1, 'a'));
  state.campaign = makeCampaign('Outro treinamento', 'banco', 'next');
  state.attempts.push(makeAttempt(state.campaign, 0, 'b'));
  assert.equal(state.attempts[0].campaignId, 'initial');
  assert.equal(state.attempts[1].campaignId, 'next');
  assert.deepEqual(summarize(state.attempts), { total: 2, safe: 1, percentage: 50 });
  assert.ok(validState(state));
});
