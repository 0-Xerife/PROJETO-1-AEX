export type LearningModule = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  lessons: number;
  completed: number;
  status: 'completed' | 'current' | 'locked';
  topics: string[];
};

// Dados de demonstração compartilhados pelas telas. Sem persistência nesta etapa.
export const learner = { name: 'Maria' };

export const modules: Omit<LearningModule, 'lessons' | 'completed' | 'status'>[] = [
  {
    id: 'primeiros-passos',
    title: 'Primeiros passos digitais',
    description: 'Mais confiança para usar o celular no dia a dia.',
    minutes: 5,
    topics: ['Conhecer os recursos do celular', 'Navegar com calma', 'Pedir ajuda quando precisar'],
  },
  {
    id: 'mensagens',
    title: 'Mensagens com cuidado',
    description: 'Aprenda a reconhecer mensagens que merecem atenção.',
    minutes: 5,
    topics: ['Observar quem enviou a mensagem', 'Reconhecer pedidos com urgência', 'Conferir antes de tocar em um link'],
  },
  {
    id: 'senhas',
    title: 'Suas senhas, sua proteção',
    description: 'Pequenos cuidados para proteger suas contas.',
    minutes: 6,
    topics: ['Conhecer uma senha forte', 'Cuidar dos códigos de acesso', 'Proteger suas informações'],
  },
  {
    id: 'compras',
    title: 'Compras com confiança',
    description: 'Conheça os cuidados ao comprar pela internet.',
    minutes: 5,
    topics: ['Conhecer a loja', 'Observar ofertas', 'Conferir os dados da compra'],
  },
];

