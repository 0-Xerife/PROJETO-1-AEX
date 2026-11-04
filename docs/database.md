# Banco de dados — planejamento

**Não implementado na Fase 3.** Não existem schema Prisma, migrations, conexão, seed ou dependências de banco instaladas.

A fase seguinte prevê PostgreSQL no Supabase e Prisma na raiz:

- `prisma/schema.prisma`, `prisma/migrations/` e `prisma/seed.ts`.
- `prisma.config.ts` para o CLI.
- Cliente gerado exclusivamente em `apps/api/src/generated/prisma/`, ignorado pelo Git.
- DatabaseModule e PrismaService na API; controllers não acessam o banco diretamente.
- Credenciais de execução e migrations separadas.
- Modelos do banco não são contratos públicos compartilhados.

## Modelagem aprovada para detalhamento posterior

User, Organization, OrganizationMembership, Campaign, participantes, SimulationTemplate, SimulationTemplateVersion, Simulation, SimulationEvent, Training, atribuições, TrainingProgress e AuditLog.

Papéis USER/ADMIN por organização; SUPER_ADMIN global. Identidade vinculada ao subject verificado do Supabase. Relações e consultas devem impedir acesso cruzado entre organizações.

Templates terão rascunhos editáveis e versões publicadas imutáveis, com unicidade por template e versão. Simulações referenciarão a versão utilizada. O resultado será calculado pelo servidor; nenhuma mudança de gabarito reinterpretará tentativas anteriores.

Migrations serão verificadas em bancos descartáveis, nunca automaticamente durante build ou instalação. O seed educativo deverá ser idempotente e não criar contas ou credenciais reais.

Prisma 7.10.1 foi consultado no pré-voo e é compatível com o Node atual segundo seus engines; não foi instalado. A versão e os requisitos deverão ser reconfirmados na Fase 4, inclusive porque o dist-tag latest consultado apontava para um release candidate 8.
