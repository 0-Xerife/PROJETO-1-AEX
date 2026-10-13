# Simulador Antifraude — Grupo G9

Projeto de AEX para prevenção de golpes e engenharia social, com foco em pessoas idosas. A proposta é uma plataforma de treinamento com interface pensada primeiro para o celular: participantes praticam decisões seguras e administradores organizam simulações educativas.

**Integrantes:** Abner Effgen de Almeida, Bruno Vinicius Rodrigues Barroso e Tulio Fogaça Panza.

**Supervisor:** Prof. Paulo Cugnasca.

**Base da proposta:** apresentação inicial “Prevenção de golpes e engenharia social voltada a grupos vulneráveis”, fornecida pela equipe.

## 1. Problema e objetivo

Golpes exploram confiança, urgência, medo e falta de familiaridade com ferramentas digitais. Pedidos de um suposto familiar, falsas centrais bancárias e links que prometem benefícios podem induzir a vítima a transferir dinheiro ou revelar informações.

O objetivo é desenvolver autonomia e reflexão crítica pela prática: reconhecer sinais de alerta, decidir como agir e receber uma explicação simples após cada decisão. O treinamento deve acolher o participante, sem culpabilizar quem já sofreu um golpe.

A KnowBe4 é uma referência funcional para conscientização e gestão de treinamentos. Este projeto terá escopo próprio e reduzido, voltado ao celular, sem reproduzir uma plataforma corporativa completa.

## 2. Público-alvo

### Público principal

Pessoas de terceira idade, com referência inicial em adultos de **60 anos ou mais**, especialmente quem usa celular para conversar com familiares, acessar serviços e realizar operações financeiras, mas tem dificuldade para avaliar solicitações suspeitas. Idade não determina habilidade digital: a interface deve atender diferentes níveis de experiência, sem infantilizar os usuários.

**Necessidades:** linguagem direta, letras legíveis, botões grandes, poucas ações por tela, possibilidade de repetir exercícios, explicação de termos técnicos e orientações para verificar solicitações por outro canal.

**Contextos de uso:** prática com familiares, oficinas de inclusão digital e atividades em instituições que atendem idosos. A participação deve ser voluntária e precedida da explicação de que se trata de uma simulação.

### Público secundário e administradores

- Pessoas em letramento digital ou em situação de vulnerabilidade tecnológica, conforme a apresentação.
- Educadores, facilitadores e integrantes da equipe que selecionam cenários e acompanham dificuldades.
- Familiares e cuidadores que apoiam a prática, respeitando a autonomia do participante.

### Perfis de referência a validar

| Perfil hipotético | Situação | Necessidade |
| --- | --- | --- |
| Participante que usa principalmente mensagens | Suposto filho pede transferência de um número novo | Confirmar a identidade pelo contato já conhecido |
| Participante que usa serviços bancários | Suposta central solicita código por telefone | Encerrar a ligação e procurar o canal oficial |
| Facilitador de oficina | Grupo com diferentes níveis de experiência digital | Selecionar o tema e revisar dificuldades |

São hipóteses de projeto, não resultados de entrevistas. A equipe deverá validá-las com pessoas do público-alvo, documentando consentimento e sugestões sem expor dados pessoais. A apresentação registra contato parcial em ambientes de estágio e intenção de incluir familiares; não estabelece validação concluída.

## 3. Especificação do projeto

### 3.1 Visão e fluxo

Aplicação web responsiva com duas áreas:

1. **Administrador:** escolhe o tipo de golpe, define o título do treinamento e acompanha resultados.
2. **Participante:** abre o treinamento ativo, lê uma situação simulada, escolhe uma ação e recebe feedback educativo imediato.

Após a resposta, a aplicação destaca os sinais de alerta, explica a decisão e registra a tentativa. O participante pode repetir a prática; o administrador usa o resumo para orientar atividades futuras.

As situações aparecem somente dentro da aplicação. Não são enviados SMS, mensagens ou chamadas reais. Links são textos ilustrativos, sem navegação externa. Nenhum exercício pede senhas, códigos bancários ou transferências.

### 3.2 Escopo do MVP planejado

- Cenários de falso familiar em aplicativo de mensagens, SMS com link suspeito e falsa central bancária.
- Configuração de treinamentos pelo administrador.
- Alternativas de ação e explicação imediata dos sinais de alerta.
- Histórico de tentativas e resumo de decisões seguras por treinamento.
- Guia prático de resposta a incidentes.
- Interface utilizável no celular, por teclado e com leitores de tela.

**Evoluções posteriores:** autenticação e permissões reais, identificação consentida de participantes, banco de dados, campanhas para grupos, desafios semanais/mensais, áudio para ligações e exportação de relatórios. Aplicativos nativos Android/iOS ficam fora da primeira entrega.

### 3.3 Requisitos funcionais e critérios de aceite

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| RF01 | Separar áreas de participante e administrador | Ambas acessíveis no protótipo; a versão com servidor deverá exigir autorização administrativa |
| RF02 | Configurar treinamento | Título obrigatório e tipo selecionado; treinamento salvo aparece para o participante |
| RF03 | Apresentar simulação segura | Exercício identificado como simulação, sem contatos, pagamentos ou links externos acionáveis |
| RF04 | Receber decisão | Cada alternativa gera feedback coerente; cada tentativa aceita somente uma resposta |
| RF05 | Explicar sinais de alerta | Feedback explica a ação e sugere uma forma segura de verificar a situação |
| RF06 | Registrar tentativa | Armazena treinamento, cenário, alternativa, resultado e data; recarregar mantém dados quando o armazenamento está disponível |
| RF07 | Exibir resultados | Totais de tentativas e decisões seguras correspondem aos registros, com resumo por treinamento |
| RF08 | Disponibilizar guia | Orienta a interromper contato, preservar evidências e procurar canais oficiais |
| RF09 | Repetir exercício | Nova prática após feedback gera uma nova tentativa |

### 3.4 Requisitos não funcionais

| ID | Requisito | Verificação planejada |
| --- | --- | --- |
| RNF01 | Adaptação ao celular | Uso a partir de 360 px sem rolagem horizontal |
| RNF02 | Legibilidade e acessibilidade | Texto base de 18 px, contraste conforme WCAG 2.2 AA, controles de pelo menos 44 px, foco visível e uso por teclado; validação manual com leitores de tela e público-alvo ainda necessária |
| RNF03 | Linguagem acolhedora | Explicações simples, sem culpa e sem depender apenas de cor |
| RNF04 | Privacidade | Protótipo sem nome, telefone ou credenciais; futura coleta exige finalidade, base legal, retenção e acesso definidos |
| RNF05 | Segurança | Não executar ataques, enviar comunicações externas ou armazenar segredos |
| RNF06 | Recuperação de falhas | Falha no armazenamento gera aviso e permite continuar a prática na sessão |

### 3.5 Modelo de dados

| Entidade | Campos | Relações |
| --- | --- | --- |
| Treinamento | ID, título, cenário, data de criação | Possui tentativas; o último salvo fica ativo no protótipo |
| Cenário | ID, tipo, mensagem, alternativas, explicação | Catálogo educativo incluído na aplicação |
| Tentativa | ID, ID e título do treinamento, cenário, alternativa, decisão segura, data | Pertence a um treinamento; não identifica uma pessoa |

### 3.6 Arquitetura e limites atuais

O protótipo usa **HTML, CSS e JavaScript**, servido por um servidor HTTP local em Node.js, sem dependências externas. O estado é salvo no `localStorage` do navegador. A troca entre participante e administrador demonstra o fluxo, mas **não oferece autenticação ou isolamento de dados**.

Os dados não são compartilhados entre dispositivos e podem ser apagados ao limpar os dados do navegador. O painel conta tentativas, não pessoas únicas. Apenas um treinamento fica ativo por vez. A falsa ligação é representada por texto, sem áudio.

Para uma versão compartilhada serão necessários API, banco de dados e autorização no servidor. Hospedagem, política de dados e critérios de segurança devem ser definidos antes de um piloto com dados pessoais.

## 4. Planejamento e avaliação

Cronograma proposto na apresentação para o terceiro quadrimestre de 2026:

| Período | Etapa | Entregas previstas |
| --- | --- | --- |
| Outubro | Levantamento e design | Mapear golpes, detalhar público, especificar requisitos, prototipar interface e validar arquitetura |
| Novembro | Desenvolvimento e conteúdo | Cenários interativos, estudos de caso e desafios periódicos |
| Dezembro | Aplicação prática e avaliação | Testes de usabilidade, métricas e relatório final |

**Previsão:** 60 horas por integrante, total de 180 horas da equipe. Essa previsão é distinta das horas realizadas abaixo.

**Avaliação planejada:** observar conclusão de exercícios sem ajuda, compreensão do feedback e reconhecimento de canais seguros. Comparar decisões ao longo das atividades sem tratar a taxa de acerto como diagnóstico individual. Testes com usuários e alinhamento com o supervisor ainda precisam ser registrados.

## 5. Registro semanal de atividades e horas

Atualizar toda semana, acrescentando registros sem substituir os anteriores. Incluir descrição individual das atividades, horas efetivamente realizadas, evidências e dificuldades.

### Semana de 12 a 18 de outubro de 2026

Registro inicial de **2 horas por integrante**, conforme informado pela equipe. A distribuição individual das atividades deve ser detalhada pelos membros; não são atribuídas tarefas que não foram confirmadas.

| Integrante | Horas informadas | Detalhamento individual |
| --- | ---: | --- |
| Abner Effgen de Almeida | 2 h | A complementar pelo integrante |
| Bruno Vinicius Rodrigues Barroso | 2 h | A complementar pelo integrante |
| Tulio Fogaça Panza | 2 h | A complementar pelo integrante |
| **Total da semana** | **6 h** | |

**Entregas desta atualização:** público-alvo, especificação inicial e primeiro protótipo de participante/administração neste repositório. Essas entregas não comprovam autoria ou divisão individual das horas.

| Integrante | Acumulado registrado | Previsão total |
| --- | ---: | ---: |
| Abner Effgen de Almeida | 2 h | 60 h |
| Bruno Vinicius Rodrigues Barroso | 2 h | 60 h |
| Tulio Fogaça Panza | 2 h | 60 h |
| **Equipe** | **6 h** | **180 h** |

### Modelo para as próximas semanas

Copiar e preencher com o período da semana:

| Integrante | Atividades realizadas | Horas | Evidência (commit, documento ou reunião) |
| --- | --- | ---: | --- |
| Abner Effgen de Almeida | A preencher | — | — |
| Bruno Vinicius Rodrigues Barroso | A preencher | — | — |
| Tulio Fogaça Panza | A preencher | — | — |

Acrescentar entregas, dificuldades, próximos passos e novo acumulado.

## 6. Executar e verificar o protótipo

Requisito: **Node.js 22 ou superior**. Não há pacotes a instalar.

```sh
cd /workspace/PROJETO-1-AEX
npm start
```

Fora da nuvem, use o diretório onde o repositório foi clonado. Porta padrão: `3000`. Para outra porta: `PORT=3001 npm start`. Acesse o servidor pelo navegador no seu ambiente de desenvolvimento.

```sh
npm test
```

Os testes verificam o catálogo, o registro de respostas e os resumos. Verificação manual do fluxo:

1. Abrir **Administrador**, selecionar um tipo e salvar um treinamento.
2. Voltar a **Participante**, responder e conferir a explicação.
3. Consultar resultados e recarregar para verificar persistência.
4. Repetir com os três tipos e conferir teclado e layout de celular.

O protótipo é uma base de desenvolvimento; não substitui validação de acessibilidade com usuários nem infraestrutura de produção.
