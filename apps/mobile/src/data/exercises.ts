import type { Exercise } from '../exercises/types';

export const exercises: readonly Exercise[] = [
  {
    id: 'sms-suspeito',
    category: 'phishing',
    moduleId: 'mensagens',
    title: 'SMS suspeito',
    introduction: 'Uma mensagem inesperada chegou. Leia com calma antes de decidir o que fazer.',
    scenario: {
      kind: 'sms',
      label: 'Mensagem fictícia recebida',
      sender: 'Entrega Nuvem — empresa fictícia',
      message: 'Sua encomenda será cancelada em 10 minutos! Confirme seus dados no endereço abaixo para liberar a entrega.',
      address: 'https://entrega-nuvem.invalid/confirmar',
    },
    question: 'Qual é a atitude mais segura diante desta mensagem?',
    options: [
      { id: 'abrir', label: 'Abrir o endereço logo para não perder a entrega.', explanation: 'A ameaça de cancelamento e o prazo curto tentam fazer você agir sem conferir. Não abra um endereço só porque a mensagem exige pressa.' },
      { id: 'conferir', label: 'Não abrir o endereço e conferir a entrega pelo aplicativo ou canal oficial que já conheço.', explanation: 'Isso evita seguir o caminho indicado por uma mensagem inesperada. A urgência e o pedido de dados são sinais de alerta; confira por um canal conhecido.' },
      { id: 'responder', label: 'Responder à mensagem com meus dados para confirmar.', explanation: 'Enviar dados em resposta a uma mensagem inesperada pode expor suas informações. Confira a situação por um canal oficial que você já conhece.' },
    ],
    correctOptionId: 'conferir',
    takeaway: 'Pare, desconfie da pressa e confira por um canal conhecido antes de agir.',
  },
  {
    id: 'link-fraudulento',
    category: 'phishing',
    moduleId: 'mensagens',
    title: 'Link fraudulento',
    introduction: 'O nome de uma loja pode aparecer em um endereço que não pertence a ela.',
    scenario: {
      kind: 'link',
      label: 'Convite fictício para uma promoção',
      sender: 'Loja Jardim — loja fictícia',
      message: 'Você ganhou um desconto! No exemplo, o endereço conhecido da loja é loja-jardim.invalid. Mas a mensagem mostra este outro endereço:',
      address: 'https://loja-jardim.premio-falso.invalid/resgatar',
    },
    question: 'O que merece atenção neste endereço?',
    options: [
      { id: 'https', label: 'Começar com HTTPS garante que a promoção é verdadeira.', explanation: 'HTTPS protege a conexão, mas não garante que o site ou a promoção sejam legítimos. Um site fraudulento também pode usar HTTPS.' },
      { id: 'nome', label: 'Ter o nome da loja em alguma parte do endereço é suficiente para confiar.', explanation: 'O nome da loja pode ser colocado em um endereço diferente para confundir. Confira o endereço completo, não apenas uma palavra conhecida.' },
      { id: 'dominio', label: 'O endereço é diferente do conhecido. Devo conferir a promoção por um canal oficial.', explanation: 'Neste exemplo, loja-jardim aparece antes de premio-falso.invalid. Isso não é o mesmo endereço que loja-jardim.invalid. A escolha segura é não abrir o link e conferir por um canal conhecido.' },
    ],
    correctOptionId: 'dominio',
    takeaway: 'Um nome conhecido ou HTTPS, sozinho, não prova que um endereço é confiável.',
  },
  {
    id: 'falsa-central',
    category: 'social-engineering',
    moduleId: 'mensagens',
    title: 'Falsa central bancária',
    introduction: 'Alguém liga dizendo ser de uma central. Você não precisa decidir nada com pressa.',
    scenario: {
      kind: 'call',
      label: 'Conversa fictícia por telefone',
      sender: 'Pessoa que diz representar o Banco Aurora — banco fictício',
      message: '“Detectamos um problema na sua conta. Para cancelar agora, diga sua senha e o código que chegou por mensagem. Não desligue: precisamos resolver imediatamente.”',
    },
    question: 'Qual é a ação mais segura nesta situação?',
    options: [
      { id: 'senha', label: 'Informar a senha porque a pessoa diz trabalhar no banco.', explanation: 'Dizer que trabalha no banco não comprova a identidade de quem ligou. Não compartilhe sua senha em uma ligação recebida.' },
      { id: 'encerrar', label: 'Encerrar a ligação sem informar dados e procurar o banco por um canal oficial que já conheço.', explanation: 'Você interrompe a pressão e pode verificar a situação com segurança. Use o aplicativo oficial ou um contato que você já conhece, sem seguir instruções de quem ligou.' },
      { id: 'codigo', label: 'Informar apenas o código recebido, sem contar a senha.', explanation: 'Um código de confirmação também pode permitir acesso à conta ou autorizar ações. Não o compartilhe com quem fez a ligação.' },
    ],
    correctOptionId: 'encerrar',
    takeaway: 'Senhas e códigos de confirmação são pessoais. Desligue e confira por um canal oficial conhecido.',
  },
];
