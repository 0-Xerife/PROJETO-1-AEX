# Arquitetura

## Implementado na Fase 3

Monorepo privado com npm workspaces e um único lockfile. Turborepo ordena tarefas; cada app mantém suas ferramentas convencionais.

| Unidade               | Responsabilidade                                              |
| --------------------- | ------------------------------------------------------------- |
| `apps/api`            | Processo NestJS, módulo Health e endpoint REST de liveness    |
| `apps/admin`          | Next.js App Router, layout e página inicial                   |
| `apps/mobile`         | Expo Router, layout e tela inicial nativa                     |
| `packages/types`      | Contratos públicos mínimos: HealthResponse e ApplicationInfo  |
| `packages/validation` | Schema de porta, com limites e rejeição de entradas inválidas |
| `packages/config`     | Configurações TypeScript, ESLint e Prettier                   |
| `examples/prototype`  | Primeira versão funcional, isolada e preservada               |

Os apps não importam uns aos outros. API usa types e validation; os clientes usam types. Config é uma dependência de desenvolvimento. Validation mantém uma dependência declarada em types para a evolução dos contratos; não contém código de servidor.

Types e validation são compilados com TypeScript para CommonJS e declarações em `dist`, com exports explícitos. A API também usa CommonJS. Next e Metro usam resolução de bundler. Não há aliases que atravessem diretamente o código-fonte de outro workspace.

## Configuração e tarefas

No admin, `strictRouteTypes` faz o Next importar os validadores de rotas pelo `next-env.d.ts`. O tsconfig não inclui simultaneamente os diretórios gerados de desenvolvimento e produção: isso duplicava declarações globais de `LayoutProps`. A configuração usa ES2024 para as declarações requeridas pelo Next; o alvo de emissão compartilhado continua ES2022.

TypeScript 6.0.3 compartilhado, com strict, exactOptionalPropertyTypes e noUncheckedIndexedAccess. A configuração Node não força opções de compilação sobre os clientes. Expo estende a configuração do SDK e a configuração compartilhada.

ESLint usa flat config, análise de tipos e regras específicas das plataformas. Prettier é separado do lint. O protótipo e arquivos gerados não são reformatados.

Build, typecheck e testes dependem da compilação dos pacotes consumidos. `turbo watch dev` reconstrói dependências e reinicia tarefas persistentes quando necessário. Testes não usam cache. Cache remoto não foi configurado.

## Segurança e fronteiras atuais

A API expõe apenas `GET /health/live`. Não oferece endpoints de negócio ou gravação. O protótipo continua explicitamente sem autenticação e com dados locais.

Nenhum cliente depende de Prisma, Nest ou APIs Node de execução. Variáveis com prefixos públicos podem ser incluídas nos bundles e jamais devem conter credenciais.

## Próximas fases — ainda não implementadas

Backend monolítico modular: auth, users, organizations, roles, campaigns, simulations, training, analytics e audit. Supabase autentica; a API valida tokens e aplica permissões no servidor. Os dados organizacionais serão isolados por vínculos e verificações em consultas e operações.

Persistência, migrations, autenticação, CORS de integração, rate limiting e módulos de negócio pertencem à Fase 4. As telas atuais não simulam essas funcionalidades.
