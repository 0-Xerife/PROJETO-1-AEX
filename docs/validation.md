# Validação da fundação — retomada em 21/10/2026

**Fase 3 ainda aberta.** A retomada começou na validação da subetapa 3.3. O typecheck mobile impede sua conclusão e, portanto, o encerramento da subetapa 3.4. Este documento registra o checkpoint; não autoriza avançar à Fase 4.

## Estado de entrada

Branch `feat/fase-3-foundation`, referência histórica `d985cc5`. Foram examinados status, diff e arquivos antes das edições. Os oito arquivos do protótipo já estavam realocados, o monorepo e os apps mínimos já existiam, as dependências estavam instaladas e a documentação estava em rascunho.

Já havia evidência de preservação por hashes, seis testes originais aprovados e sete verificações HTTP do protótipo. A movimentação não foi repetida. Os servidores de desenvolvimento encontrados no workspace foram mantidos.

## Correções desta retomada

- TypeScript compartilhado passou de 5.9.3 para 6.0.3: o SDK Expo 58 requer essa linha; os peers de ts-jest e typescript-eslint a aceitam.
- Admin usa a biblioteca ES2024 e os tipos DOM atuais. `strictRouteTypes` importa os validadores pelo arquivo gerado pelo Next, evitando incluir as declarações globais de produção e desenvolvimento simultaneamente.
- O warning de exportação anônima no ESLint do admin foi corrigido.
- Mobile preserva DOM/ESNext da configuração do SDK. `expo-symbols` 58.0.4 e `@types/xcode` 3.0.0 foram declarados para resolver referências ausentes nas declarações das bibliotecas.
- Lockfile único atualizado, matriz de versões e documentação corrigidas. Nenhum arquivo do protótipo foi editado.

## Comandos e resultados

No PowerShell foi utilizado `npm.cmd`; `npm.ps1` é bloqueado pela política local. Comandos Git receberam `safe.directory` apenas no processo, sem alteração global da configuração.

| Comando / verificação                       | Resultado                                                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm install --no-fund`                     | Concluído; dependências exatas e lockfile raiz atualizados                                                     |
| `npm ls --workspaces --depth=0`             | Código 0; seis workspaces; dois resíduos opcionais marcados extraneous                                         |
| `npm ls typescript --all`                   | Código 0; workspaces em 6.0.3, cópia interna 5.9.3 do Nest CLI                                                 |
| `npm run verify:prototype`                  | 8/8 conteúdos preservados, normalizando apenas finais de linha                                                 |
| `npm run typecheck -- --continue=always`    | Falhou somente em mobile; API, admin, types e validation passaram                                              |
| `npm run typecheck --workspace=@aex/mobile` | Falhou nas declarações das dependências, mesmo após corrigir bibliotecas e peers ausentes                      |
| `npm run lint`                              | Passou nos seis workspaces e na raiz, sem warnings na execução final                                           |
| `npm test`                                  | Passou: 6 testes originais + 15 testes de schema + 2 testes HTTP = 23                                          |
| `npm run build -- --continue=always`        | Passou: cinco tarefas, incluindo Next, Nest e bundles Android/iOS; três resultados reutilizados do cache local |
| `npm run mobile:doctor`                     | 20/20 checks passaram após alinhamento do TypeScript                                                           |
| HTTP API `/health/live`                     | 200 com `{"status":"ok"}`                                                                                      |
| HTTP admin `/`                              | 200 e conteúdo esperado da página inicial                                                                      |
| HTTP Metro `:8081/status`                   | Não respondeu na verificação; não usado como evidência de funcionamento em aparelho                            |
| `npm audit --json`                          | Código 1: 48 entradas afetadas, 27 moderadas e 21 altas, nenhuma crítica                                       |

Os builds Expo produzem bundles, não APK/IPA. Não foi testado aparelho físico ou emulador. O simulador iOS não está disponível em Windows. O build mobile transpila código e não substitui `tsc`; por isso seu sucesso não encerra o bloqueio de tipos.

## Bloqueio de tipos mobile

Também passaram `npm run format:check` e `git diff --check`. O primeiro detecta a formatação dos arquivos novos incluídos no escopo do Prettier; o segundo verifica o diff dos arquivos já rastreados. Um espaço duplo de quebra de linha Markdown no README raiz foi removido para satisfazer o diff check.

Reproduzir após instalar dependências e compilar os pacotes:

```sh
npm ci
npm run build:packages
npm run typecheck --workspace=@aex/mobile
```

Exemplos constatados nas declarações instaladas:

- Expo Router 58.0.24: `NavigatorOptions` e `NavigatorEventMap` usados sem definição em `build/fork/native-stack/createNativeStackNavigator.d.ts` e outros navegadores.
- Router referencia `Falsy`, `RecursiveArray` e `Animated.AnimationConfig`, ausentes na API de tipos padrão do React Native 0.88.0.
- Tipos internos de navegação conflitam com `exactOptionalPropertyTypes`.
- Safe Area Context 5.10.1 referencia tipos e imports internos indisponíveis na API atual do React Native.
- Declarações globais antigas do React Native conflitam com DOM/Node; há também incompatibilidades internas nas declarações geradas de Animated, VirtualizedList e ReactNativeDocument.

A versão mais recente estável consultada do Router era 58.0.24 e de Safe Area Context era 5.10.1, ambas já instaladas. Expo Doctor valida a matriz de versões, não a consistência de todos esses arquivos `.d.ts` com as regras adicionais do projeto.

Permanecem `strict: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true` e `skipLibCheck: false`. Não há suppressions, patches manuais em node_modules ou troca para versões canary. Reduzir verificações para ocultar os erros contrariaria as instruções da fase.

Próximo trabalho necessário: obter uma combinação de releases corrigidas, ou avaliar uma linha estável anterior de Expo/Router/RN em conjunto, comprovando o typecheck completo antes de aceitá-la. A matriz atual não deve ser tratada como inteiramente validada. Não basta o build passar.

## Warnings e limitações

- npm reportou depreciações de ESLint 9, uuid 7 e glob 10. ESLint 10 não atende ao peer atual de eslint-plugin-react.
- A instalação encontrou EPERM na limpeza de dependências WASM opcionais. `npm ls` ainda lista `@emnapi/runtime` e `@img/sharp-wasm32` como extraneous. Nenhum diretório do usuário foi apagado para contornar isso.
- Metro emitiu aviso sobre NO_COLOR e FORCE_COLOR simultâneos. As exportações terminaram com sucesso.
- `strictRouteTypes` é uma opção experimental do Next e aparece como tal no build.
- O sandbox impediu inicialmente acesso à rede, resolução de imports e HTTP local. Instalação, lint, builds e verificações locais pertinentes foram repetidos com a permissão da ferramenta; isso não foi confundido com falha do código.
- Git avisou sobre LF/CRLF no Windows. Os arquivos originais foram preservados; o verificador usa conteúdo Git normalizado para portabilidade.
- A auditoria npm inclui cadeias transitivas originadas em braces, node-forge, sprintf-js e uuid. Há sugestões de downgrade incompatível com a matriz atual. Não foram executados `npm audit fix --force` nem `--legacy-peer-deps`. O relatório exige acompanhamento antes de distribuir a aplicação.

Referências dos advisories identificados: [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [node-forge](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [sprintf-js](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), [uuid](https://github.com/advisories/GHSA-w5hq-g745-h8pq).

Nenhum commit, push, merge, PR ou alteração da main foi realizado. Banco, Prisma, Supabase e módulos de negócio continuam fora desta fase.
