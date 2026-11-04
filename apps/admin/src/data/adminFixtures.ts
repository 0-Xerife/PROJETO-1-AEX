import type { Exercise } from '@aex/types/training';
import type { AdminDataset } from '../services/adminService';

// Catálogo e participantes próprios do admin. Nenhum acesso ao estado do mobile.
const exercises: readonly Exercise[] = [
  {
    id: 'sms-suspeito', moduleId: 'mensagens', category: 'phishing', title: 'SMS suspeito',
    introduction: 'Reconhecer urgência e pedidos de dados em mensagens inesperadas.',
    scenario: { kind: 'sms', label: 'SMS fictício', sender: 'Entrega Nuvem (fictícia)', message: 'Sua entrega será cancelada. Confirme seus dados agora.', address: 'https://entrega-nuvem.invalid' },
    question: 'Qual atitude evita seguir uma mensagem suspeita?',
    options: [{ id: 'conferir', label: 'Conferir pelo canal oficial conhecido.' }, { id: 'abrir', label: 'Abrir o endereço recebido.' }],
    takeaway: 'Confira mensagens inesperadas por um canal conhecido.',
  },
  {
    id: 'link-fraudulento', moduleId: 'mensagens', category: 'phishing', title: 'Link fraudulento',
    introduction: 'Distinguir um endereço conhecido de uma imitação.',
    scenario: { kind: 'link', label: 'Endereço fictício', sender: 'Loja Jardim (fictícia)', message: 'Resgate sua promoção.', address: 'https://loja-jardim.premio-falso.invalid' },
    question: 'O nome de uma loja no endereço basta para confiar?',
    options: [{ id: 'dominio', label: 'Não. É preciso conferir o endereço completo.' }, { id: 'nome', label: 'Sim. O nome da loja é suficiente.' }],
    takeaway: 'Um nome conhecido não comprova a autenticidade de um endereço.',
  },
  {
    id: 'falsa-central', moduleId: 'mensagens', category: 'social-engineering', title: 'Falsa central bancária',
    introduction: 'Identificar pressão e pedidos de senha ou códigos em ligações.',
    scenario: { kind: 'call', label: 'Ligação fictícia', sender: 'Banco Aurora (fictício)', message: 'Diga sua senha e seu código para resolver um problema.' },
    question: 'Como agir diante de um pedido de informações sensíveis?',
    options: [{ id: 'encerrar', label: 'Encerrar e procurar um canal oficial conhecido.' }, { id: 'codigo', label: 'Informar o código recebido.' }],
    takeaway: 'Não compartilhe senhas nem códigos em ligações recebidas.',
  },
];

const participants = [
  { id: 'DEMO-001', name: 'Ana Ribeiro', group: 'Turma exemplo A' },
  { id: 'DEMO-002', name: 'Carlos Mendes', group: 'Turma exemplo A' },
  { id: 'DEMO-003', name: 'Helena Costa', group: 'Turma exemplo A' },
  { id: 'DEMO-004', name: 'José Almeida', group: 'Turma exemplo B' },
  { id: 'DEMO-005', name: 'Lúcia Santos', group: 'Turma exemplo B' },
  { id: 'DEMO-006', name: 'Miguel Rocha', group: 'Turma exemplo B' },
];

// Índices de participante e exercício, acerto e conclusão da prática.
const responses: readonly (readonly [number, number, boolean, boolean])[] = [
  [0, 0, false, true], [0, 0, true, true], [0, 1, true, true], [0, 2, true, true],
  [1, 0, false, true], [1, 1, true, true], [1, 2, false, false],
  [2, 0, true, true], [2, 1, false, true], [3, 0, true, true], [3, 2, true, true], [4, 0, false, true],
];

export const adminFixtures: AdminDataset = {
  participants, exercises,
  results: responses.map(([participantIndex, exerciseIndex, correct, completed], index) => {
    const participant = participants[participantIndex];
    const exercise = exercises[exerciseIndex];
    const correctOption = exercise?.options[0];
    const selected = exercise?.options[correct ? 0 : 1];
    if (!participant || !exercise || !correctOption || !selected) throw new Error('Referência inválida na fixture.');
    const submittedAt = new Date(Date.UTC(2026, 9, 20, 12, index * 5)).toISOString();
    return { participantId: participant.id, result: {
      attempt: { id: `admin-attempt-${index + 1}`, exerciseId: exercise.id, selectedOptionId: selected.id, submittedAt },
      correct, selectedLabel: selected.label, correctLabel: correctOption.label, explanation: exercise.takeaway,
      completedAt: completed ? new Date(Date.parse(submittedAt) + 60000).toISOString() : null,
      evaluation: 'demonstrative',
    } };
  }),
};
