export const scenarios = [
  {
    id: 'familiar', label: 'Falso familiar', channel: 'Conversa simulada', sender: 'Número desconhecido',
    title: 'Um pedido urgente de alguém da família',
    message: 'Oi, mãe! Meu celular quebrou e este é meu número novo. Preciso pagar uma conta agora. Você faz um Pix para mim? Depois explico, não dá para ligar!',
    warning: 'Número novo, urgência e pedido de dinheiro sem confirmar a identidade são sinais de alerta.',
    choices: [
      { text: 'Enviar o dinheiro para ajudar rapidamente.', safe: false, explanation: 'A urgência pode dificultar a verificação. Antes de enviar dinheiro, fale com a pessoa pelo número que você já conhece.' },
      { text: 'Ligar para o familiar pelo número que eu já conheço.', safe: true, explanation: 'Confirmar por um contato já conhecido ajuda a verificar quem está falando. Não use apenas as informações enviadas na mensagem suspeita.' },
      { text: 'Pedir os dados do Pix e continuar a conversa.', safe: false, explanation: 'Receber uma chave Pix não confirma a identidade. Interrompa o pedido e procure seu familiar por um contato já conhecido.' },
    ],
  },
  {
    id: 'sms', label: 'SMS com link suspeito', channel: 'SMS simulado', sender: 'Remetente desconhecido',
    title: 'Uma mensagem promete um benefício',
    message: 'Seu benefício está bloqueado! Atualize seus dados hoje para não perder o pagamento: https://beneficio-exemplo.invalid/atualizar',
    warning: 'Ameaça de perder um benefício, prazo urgente e endereço desconhecido merecem atenção. O endereço deste exercício é fictício.',
    choices: [
      { text: 'Abrir o link e preencher meus dados.', safe: false, explanation: 'Uma página recebida por mensagem pode imitar um serviço verdadeiro. Evite o link e consulte o aplicativo ou canal oficial que você já utiliza.' },
      { text: 'Responder à mensagem com meus documentos.', safe: false, explanation: 'Não envie documentos a um remetente desconhecido. Verifique a situação diretamente com o serviço por um canal oficial.' },
      { text: 'Consultar o serviço pelo aplicativo ou canal oficial.', safe: true, explanation: 'Você escolheu verificar por um caminho independente da mensagem. Acesse o aplicativo conhecido ou procure o atendimento oficial sem usar o link recebido.' },
    ],
  },
  {
    id: 'banco', label: 'Falsa central bancária', channel: 'Ligação simulada em texto', sender: 'Suposta central do banco',
    title: 'Uma ligação pede um código de segurança',
    message: 'Identificamos uma compra suspeita na sua conta. Para cancelar, diga o código que acabou de chegar no seu celular. Não desligue: precisamos resolver agora.',
    warning: 'Pedido de código e pressão para manter a ligação são sinais de alerta. O número exibido em uma chamada pode ser falsificado.',
    choices: [
      { text: 'Informar o código para cancelar a compra.', safe: false, explanation: 'Códigos podem autorizar acesso ou operações. Não os compartilhe em uma ligação recebida. Encerre o contato e consulte o banco pelo aplicativo ou canal oficial.' },
      { text: 'Encerrar a ligação e procurar o banco pelo canal oficial.', safe: true, explanation: 'Encerrar o contato e consultar um canal oficial permite verificar a situação sem entregar códigos. Use o aplicativo ou o contato informado no cartão, fora da ligação suspeita.' },
      { text: 'Pedir o nome do atendente e depois informar o código.', safe: false, explanation: 'Um nome não comprova que a pessoa representa o banco. Não compartilhe códigos; confirme o ocorrido em um canal oficial independente.' },
    ],
  },
];

export function makeCampaign(title, scenarioId, id, date = new Date().toISOString()) {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 80) throw new Error('Informe um título de até 80 caracteres.');
  if (!scenarios.some(s => s.id === scenarioId)) throw new Error('Selecione um cenário disponível.');
  return { id, title: title.trim(), scenarioId, createdAt: date };
}

export function makeAttempt(campaign, choiceIndex, id, date = new Date().toISOString()) {
  const scenario = scenarios.find(s => s.id === campaign.scenarioId);
  if (!Number.isInteger(choiceIndex) || !scenario?.choices[choiceIndex]) throw new Error('Resposta inválida.');
  return { id, campaignId: campaign.id, campaignTitle: campaign.title, scenarioId: scenario.id,
    choiceIndex, safe: scenario.choices[choiceIndex].safe, createdAt: date };
}

export function summarize(attempts) {
  const safe = attempts.filter(a => a.safe).length;
  return { total: attempts.length, safe, percentage: attempts.length ? Math.round(safe * 100 / attempts.length) : null };
}

export function initialState() {
  return { version: 1, campaign: makeCampaign('Primeiros passos: reconhecer um falso familiar', 'familiar', 'initial'), attempts: [] };
}

export function validState(state) {
  const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
  const validCampaign = c => c && typeof c.id === 'string' && typeof c.title === 'string' && c.title.trim().length > 0 && c.title.length <= 80
    && scenarios.some(s => s.id === c.scenarioId) && validDate(c.createdAt);
  return !!state && state.version === 1 && validCampaign(state.campaign) && Array.isArray(state.attempts)
    && state.attempts.every(a => a && typeof a.id === 'string' && typeof a.campaignId === 'string'
      && typeof a.campaignTitle === 'string' && a.campaignTitle.length <= 80 && validDate(a.createdAt)
      && Number.isInteger(a.choiceIndex) && typeof a.safe === 'boolean'
      && scenarios.find(s => s.id === a.scenarioId)?.choices[a.choiceIndex]?.safe === a.safe);
}
