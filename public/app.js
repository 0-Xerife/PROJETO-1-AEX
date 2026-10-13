import { scenarios, makeCampaign, makeAttempt, summarize, initialState, validState } from './domain.js';

const storageKey = 'antifraude-g9-v1';
const main = document.querySelector('#main');
const storageWarning = document.querySelector('#storage-warning');
let state = initialState();
let area = 'participant';
let answered = false;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

function warnStorage(message) {
  storageWarning.textContent = message;
  storageWarning.hidden = false;
}
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (validState(parsed)) state = parsed;
    else warnStorage('Os dados salvos não puderam ser lidos. Você pode praticar nesta sessão; ao salvar uma nova atividade, os dados inválidos serão substituídos.');
  }
} catch {
  warnStorage('Não foi possível acessar os dados salvos. Você pode praticar nesta sessão, mas os registros podem não permanecer ao fechar a página.');
}

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { warnStorage('Não foi possível salvar no navegador. A prática continua nesta sessão, mas os registros podem não permanecer ao fechar a página.'); }
}

function showArea(nextArea) {
  area = nextArea;
  answered = false;
  for (const [id, selected] of [['participant-nav', area === 'participant'], ['admin-nav', area === 'admin']]) {
    const button = document.getElementById(id);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  render();
  main.focus();
}

document.querySelector('#participant-nav').addEventListener('click', () => showArea('participant'));
document.querySelector('#admin-nav').addEventListener('click', () => showArea('admin'));

function guide() {
  return `<details class="guide"><summary>Acho que caí em um golpe. O que fazer?</summary>
    <ol><li>Interrompa o contato. Não envie mais dinheiro, códigos ou documentos.</li>
    <li>Se houver risco para sua conta ou dinheiro, procure imediatamente o banco pelo aplicativo ou atendimento oficial para relatar e solicitar as medidas disponíveis.</li>
    <li>Se uma senha foi exposta, altere-a pelo aplicativo ou site oficial, usando um dispositivo confiável. Ative a verificação em duas etapas quando disponível.</li>
    <li>Guarde mensagens, comprovantes e outras evidências. Procure a polícia pelos canais oficiais para registrar a ocorrência e denuncie o perfil na plataforma.</li>
    <li>Peça apoio a alguém de confiança. Sofrer um golpe não é motivo de vergonha.</li></ol></details>`;
}

function renderParticipant() {
  const scenario = scenarios.find(s => s.id === state.campaign.scenarioId);
  main.innerHTML = `<div class="eyebrow">Sua segurança começa com uma pausa</div>
    <h1>Pratique hoje.<br>Reconheça os sinais amanhã.</h1>
    <p class="intro">Um exercício por vez, no seu ritmo. Aqui você pode aprender sem colocar seu dinheiro ou seus dados em risco.</p>
    <div class="grid"><section class="card" aria-labelledby="exercise-title">
      <span class="tag">Treinamento ativo · ${escape(scenario.label)}</span>
      <h2 id="exercise-title">${escape(state.campaign.title)}</h2>
      <p class="small">${escape(scenario.title)}. Leia a situação e escolha o que você faria.</p>
      <div class="message"><span class="sender">${escape(scenario.channel)} · ${escape(scenario.sender)}</span><p>${escape(scenario.message)}</p></div>
      <p class="question">Como você agiria nessa situação?</p>
      <div class="choices">${scenario.choices.map((choice, index) => `<button class="choice" data-choice="${index}"><span class="choice-number" aria-hidden="true">${index + 1}</span><span>${escape(choice.text)}</span></button>`).join('')}</div>
      <div id="feedback" hidden tabindex="-1"></div>
    </section><aside class="card side-card" aria-labelledby="practice-title"><h2 id="practice-title">Como funciona</h2>
      <ol class="steps"><li>Leia a situação com calma.</li><li>Escolha uma das ações.</li><li>Entenda os sinais de alerta.</li></ol>
      <div class="divider"><h3>Você está em um lugar seguro</h3><p>Não existe contato real com golpistas. Nada será enviado para fora desta aplicação.</p><p class="small">Não precisamos do seu nome, telefone ou dados bancários.</p></div>
    </aside></div>${guide()}`;
  main.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const choiceIndex = Number(button.dataset.choice);
    const choice = scenario.choices[choiceIndex];
    state.attempts.push(makeAttempt(state.campaign, choiceIndex, crypto.randomUUID()));
    persist();
    main.querySelectorAll('[data-choice]').forEach(item => { item.disabled = true; });
    const feedback = document.querySelector('#feedback');
    feedback.className = `feedback${choice.safe ? '' : ' caution'}`;
    feedback.hidden = false;
    feedback.innerHTML = `<h2>${choice.safe ? 'Você escolheu uma ação segura.' : 'Vamos olhar os sinais juntos?'}</h2>
      <p>${escape(choice.explanation)}</p><h3>Sinais de alerta</h3><p>${escape(scenario.warning)}</p>
      <button id="repeat" class="primary">Praticar novamente</button>`;
    feedback.focus();
    document.querySelector('#repeat').addEventListener('click', () => { answered = false; renderParticipant(); main.focus(); });
  }));
}

function renderResults() {
  const totals = summarize(state.attempts);
  const groups = new Map();
  for (const attempt of state.attempts) {
    if (!groups.has(attempt.campaignId)) groups.set(attempt.campaignId, { title: attempt.campaignTitle, attempts: [] });
    groups.get(attempt.campaignId).attempts.push(attempt);
  }
  return `<div class="metrics"><div class="metric"><strong>${totals.total}</strong><span>Tentativas</span></div>
    <div class="metric"><strong>${totals.safe}</strong><span>Decisões seguras</span></div>
    <div class="metric"><strong>${totals.percentage === null ? '—' : totals.percentage + '%'}</strong><span>Ações seguras</span></div></div>
    <p class="small">Tentativas deste navegador, incluindo repetições. Estes números não representam pessoas únicas.</p>
    ${groups.size ? `<ul class="result-list">${[...groups.values()].reverse().map(group => {
      const result = summarize(group.attempts);
      const last = group.attempts.at(-1);
      return `<li><strong>${escape(group.title)}</strong><p>${result.safe} de ${result.total} decisões seguras</p><p class="small">Última prática: ${escape(new Date(last.createdAt).toLocaleString('pt-BR'))}</p></li>`;
    }).join('')}</ul>` : '<p>Nenhuma tentativa ainda. Abra a área do participante e faça o primeiro exercício.</p>'}`;
}

function renderAdmin() {
  main.innerHTML = `<div class="eyebrow">Área do facilitador</div><h1>Transforme informação<br>em prática segura.</h1>
    <p class="intro">Selecione um cenário e organize o próximo exercício. Os resultados ajudam a escolher o que revisar com o participante.</p>
    <p class="small">Demonstração sem login: esta área está disponível para todos neste navegador.</p>
    <div class="grid"><section class="card" aria-labelledby="setup-title"><span class="tag">Configuração do treinamento</span>
      <h2 id="setup-title">Qual situação vamos praticar?</h2><form id="campaign-form">
      <label for="campaign-title">Título do treinamento</label><input id="campaign-title" name="title" required maxlength="80" value="${escape(state.campaign.title)}" autocomplete="off">
      <label for="scenario">Tipo de golpe simulado</label><select id="scenario" name="scenario">${scenarios.map(s => `<option value="${s.id}" ${state.campaign.scenarioId === s.id ? 'selected' : ''}>${escape(s.label)}</option>`).join('')}</select>
      <p class="small" id="scenario-description"></p><button class="primary" type="submit">Salvar e ativar treinamento</button>
      <p id="save-status" class="status" role="status"></p></form>
      <div class="divider"><p class="small">O treinamento salvo substitui o exercício ativo. As tentativas anteriores continuam no resumo. Nenhuma mensagem ou ligação real é enviada.</p></div>
    </section><section class="card" aria-labelledby="results-title"><h2 id="results-title">Resultados da prática</h2>${renderResults()}</section></div>`;
  const select = document.querySelector('#scenario');
  const describe = () => { document.querySelector('#scenario-description').textContent = scenarios.find(s => s.id === select.value).title; };
  select.addEventListener('change', describe);
  describe();
  document.querySelector('#campaign-form').addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#save-status');
    try {
      state.campaign = makeCampaign(document.querySelector('#campaign-title').value, select.value, crypto.randomUUID());
      persist();
      status.textContent = 'Treinamento ativado. Abra a área Participante para praticar.';
    } catch (error) { status.textContent = error.message; }
  });
}

function render() { area === 'participant' ? renderParticipant() : renderAdmin(); }
render();
