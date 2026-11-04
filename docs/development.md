# Desenvolvimento

## Instalação reproduzível

Use Node 22.14.0 e npm 10.9.2. Na raiz: `npm ci`. As versões diretas são exatas e o lockfile fixa a árvore transitiva. Para adicionar uma dependência a um app, use `npm install <pacote>@<versão> --workspace=@aex/<app>` na raiz.

No PowerShell, use `npm.cmd` caso `npm.ps1` seja bloqueado. Os scripts usam ferramentas locais declaradas nos manifests; nenhum CLI global é necessário.

## Aplicações

| Aplicação | Desenvolvimento      | Build / execução compilada                                                            |
| --------- | -------------------- | ------------------------------------------------------------------------------------- |
| Protótipo | `npm start`          | Não exige build                                                                       |
| API       | `npm run dev:api`    | `npm run build -- --filter=@aex/api`, depois `npm run start --workspace=@aex/api`     |
| Admin     | `npm run dev:admin`  | `npm run build -- --filter=@aex/admin`, depois `npm run start --workspace=@aex/admin` |
| Mobile    | `npm run dev:mobile` | `npm run build -- --filter=@aex/mobile`                                               |

Portas: protótipo 3000, admin 3001, API 3002 e Metro normalmente 8081. O protótipo não participa de `npm run dev`.

Os atalhos raiz de desenvolvimento compilam dependências primeiro. Para executar comandos diretamente em um workspace, execute `npm run build:packages` antes. Uma mudança em um pacote durante `turbo watch dev` deve reconstruí-lo e atualizar seus consumidores.

No Windows, o aplicativo iOS pode ter seu bundle exportado, mas o simulador iOS não pode ser executado localmente. O bundle Android também não substitui teste em aparelho ou emulador.

Expo SDK 58 exige uma versão compatível de Expo Go ou development build. Para aparelho físico, computador e aparelho precisam se alcançar pela rede; uma futura URL de API deve usar o IP do computador, não localhost do aparelho.

## Variáveis de ambiente

Arquivos locais opcionais:

- `apps/api/.env`, a partir de `.env.example`: PORT.
- `apps/admin/.env.local`: NEXT_PUBLIC_API_URL, reservado.
- `apps/mobile/.env.local`: EXPO_PUBLIC_API_URL, reservado.

A API lê seu `.env` ao iniciar pelos scripts do workspace. Variáveis do processo têm precedência. Porta inválida impede a inicialização. Nenhum arquivo local é necessário para a fundação.

## Qualidade

```sh
npm run verify:prototype
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
npm run mobile:doctor
```

`npm run format` e `npm run lint:fix` modificam código e são ações explícitas. O protótipo está excluído dessas modificações automáticas.

`npm test` não depende de banco ou Supabase. Os testes HTTP constroem a aplicação Nest real; os testes de schema verificam limites e rejeitam valores ambíguos. Não existem ainda suítes funcionais de login ou treinamentos.

## Preservação

`npm run verify:prototype` compara SHA-256 dos oito arquivos com os hashes medidos antes da movimentação. Execute após mudanças estruturais. O README arquivado também é verificado.

Não execute comandos de limpeza recursiva sobre o workspace. Consulte o procedimento de recuperação em [migration-plan.md](migration-plan.md).
