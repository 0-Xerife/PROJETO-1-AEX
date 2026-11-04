# Matriz de versões — pré-voo de 21/10/2026

Versões consultadas diretamente no registro npm; módulos mobile conferidos no bundledNativeModules.json do pacote Expo 58.0.16. Dependências diretas fixadas; a árvore resolvida está em package-lock.json.

| Ferramenta                                | Versão escolhida           |
| ----------------------------------------- | -------------------------- |
| Node.js / npm                             | 22.14.0 / 10.9.2           |
| TypeScript                                | 6.0.3                      |
| Turborepo                                 | 2.11.10                    |
| ESLint / typescript-eslint                | 9.39.5 / 8.72.0            |
| Prettier                                  | 3.9.10                     |
| Nest core/common/platform-express/testing | 11.2.7                     |
| Nest CLI                                  | 11.0.24                    |
| Next / eslint-config-next                 | 16.4.2                     |
| React / React DOM                         | 19.3.0                     |
| React Native                              | 0.88.0                     |
| Expo / Expo Router                        | 58.0.16 / 58.0.24          |
| Expo Constants / Linking / Status Bar     | 58.0.12 / 58.0.13 / 58.0.3 |
| Safe Area Context / Screens               | 5.10.1 / 4.30.0            |
| eslint-config-expo / expo-doctor          | 58.0.4 / 1.21.5            |
| Jest / ts-jest                            | 30.5.2 / 29.4.15           |
| Supertest                                 | 7.3.1                      |
| Zod                                       | 4.6.7                      |
| @types/node / @types/react                | 22.20.5 / 19.3.0           |

TypeScript latest consultado era 7.0.2, mas ts-jest exige TypeScript menor que 7 e typescript-eslint menor que 6.1. A versão 5.9.3 aprovada permanece compatível. ESLint 9.39.5 está no canal maintenance e é aceito pelas configurações selecionadas.

O Expo recomenda React 19.3.0 e React Native 0.88.0. Ambos os clientes usam React 19.3.0 para evitar divergências desnecessárias. Expo e React Native aceitam Node 22 a partir de 22.13; o ambiente 22.14.0 satisfaz esse requisito.

Prisma 7.10.1 e jest-expo 58.0.11 foram apenas consultados. Não são dependências da Fase 3.

Na retomada foram adicionados `expo-symbols` 58.0.4 (peer referenciado nas declarações do Router) e `@types/xcode` 3.0.0 (declarações usadas pela configuração Expo). A biblioteca DOM do SDK foi preservada na configuração TypeScript mobile. `urlpattern-polyfill` foi avaliado e removido: TypeScript 6.0.3 já fornece as declarações web exigidas pelo Next.

Essa matriz passa na verificação de versões do Expo Doctor, mas ainda não está aprovada para encerrar a fase: o typecheck mobile encontra incompatibilidades nas declarações publicadas. Consulte [validation.md](validation.md).

Todos os manifests dos workspaces e a raiz declaram TypeScript 6.0.3. O Nest CLI mantém sua dependência transitiva privada de TypeScript 5.9.3; `npm ls typescript --all` identifica essa cópia. Não foi aplicado override sobre dependências internas da ferramenta. O script de typecheck da API usa o compilador 6.0.3 declarado pelo workspace.

A tentativa inicial com Nest 12.2.0 / CLI 12.0.10 foi rejeitada por engine-strict: @angular-devkit/core 22.2.3 exige Node ^22.22.3. A combinação final usa a linha estável Nest 11 e CLI 11.0.24, cujo Angular DevKit é 19.2.27. A verificação de engines permanece ativa; não houve uso de force ou legacy-peer-deps.

Referências: [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [Next instalação](https://nextjs.org/docs/app/getting-started/installation), [Nest](https://docs.nestjs.com/first-steps), [Turbo](https://turborepo.dev/docs/reference/configuration).
