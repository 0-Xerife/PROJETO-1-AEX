# AEX — Simulador Antifraude · Grupo G9

Plataforma acadêmica de conscientização e treinamento em segurança da informação, com foco em pessoas idosas e em diferentes níveis de experiência digital. O objetivo é reconhecer sinais de golpes, praticar decisões seguras e receber explicações acolhedoras.

**Integrantes:** Abner Effgen de Almeida, Bruno Vinicius Rodrigues Barroso e Tulio Fogaça Panza.

**Supervisor:** Prof. Paulo Cugnasca.

## Estado da implementação

**Fase 3 em validação:** a fundação compila, mas o typecheck mobile ainda falha nas declarações das dependências. A fase não está encerrada. Consulte os resultados e o bloqueio em [validation.md](docs/validation.md).

A Fase 3 cria a fundação de um monorepo. A API oferece apenas `GET /health/live`; admin e mobile têm telas iniciais. Não há banco, autenticação, gestão administrativa ou treinamentos conectados à API.

O [protótipo original](examples/prototype/README.md) continua funcional, com três cenários educativos, feedback e resultados armazenados no navegador. Seus oito arquivos foram preservados integralmente. `npm start` continua iniciando esse protótipo.

A proposta original previa uma aplicação web. A evolução aprovada passa a incluir Expo/React Native para participantes e Next.js para administradores. O público-alvo, os cuidados educativos e os registros acadêmicos permanecem.

## Stack e estrutura

- Mobile: React Native, Expo e Expo Router.
- Admin: Next.js e React.
- API: NestJS, REST e TypeScript.
- Organização: npm workspaces, Turborepo, TypeScript strict, ESLint e Prettier.
- Planejados para a Fase 4: PostgreSQL, Prisma e Supabase Auth. Storage será considerado quando necessário.
- Hospedagem planejada: Vercel para admin, Render ou equivalente para API e Supabase para banco/Auth. Nenhum deploy foi configurado.

```text
apps/                  # api, admin, mobile
packages/              # types, validation, config
examples/prototype/    # versão original independente
docs/                  # documentação técnica e acadêmica
scripts/               # verificações do repositório
```

## Pré-requisitos e instalação

Ambiente de referência: Node.js **22.14.0**, npm **10.9.2**. Os manifests aceitam Node 22 a partir de 22.14 e npm 10 a partir de 10.9.2. Use a mesma combinação da equipe para reproduzir os resultados; versões exatas das dependências estão no lockfile.

Na raiz do projeto:

```sh
npm ci
npm run build:packages
```

Não há instalação global de ferramentas nem instalação separada dentro dos apps. Há apenas um `package-lock.json`.

No PowerShell, se a política local impedir `npm.ps1`, utilize `npm.cmd` no lugar de `npm`. Não é necessário alterar a política de execução.

## Desenvolvimento

| Comando              | Serviço                                        |
| -------------------- | ---------------------------------------------- |
| `npm start`          | Protótipo em http://localhost:3000             |
| `npm run dev:api`    | API em http://localhost:3002/health/live       |
| `npm run dev:admin`  | Admin em http://localhost:3001                 |
| `npm run dev:mobile` | Expo/Metro; abrir pelo QR code ou emulador     |
| `npm run dev`        | API, admin e Expo com reconstrução dos pacotes |

A API retorna `{"status":"ok"}`. Essa rota verifica que o processo responde, não a disponibilidade de serviços externos.

No mobile, a exportação de bundles não produz APK/IPA. O simulador iOS requer macOS; Android requer aparelho ou emulador configurado. Consulte [desenvolvimento](docs/development.md).

## Ambiente, banco e migrations

A Fase 3 funciona sem criar arquivos locais de ambiente. Cada app possui um `.env.example`:

- API: `PORT`, opcional, padrão 3002.
- Admin: `NEXT_PUBLIC_API_URL`, reservado para integração futura.
- Mobile: `EXPO_PUBLIC_API_URL`, reservado para integração futura.

Não há variáveis de banco, chaves Supabase, schema Prisma ou comandos de migrations nesta fase. A estratégia futura está em [database.md](docs/database.md). Não coloque segredos em variáveis públicas.

## Verificações

```sh
npm run verify:prototype
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
npm run mobile:doctor
```

`npm test` inclui os seis testes originais, os testes de validação e os testes HTTP da fundação Nest. O build mobile exporta os bundles Android e iOS.

## Documentação e registros acadêmicos

- [Arquitetura](docs/architecture.md)
- [Desenvolvimento e execução](docs/development.md)
- [Banco — planejamento da próxima fase](docs/database.md)
- [Migração e recuperação](docs/migration-plan.md)
- [Versões do pré-voo](docs/versions.md)
- [Validação da fundação](docs/validation.md)
- [Proposta, público-alvo e requisitos acadêmicos](docs/projeto-academico.md)
- [Registro de atividades e horas](docs/registro-de-horas.md)

O registro existente contém **2 horas por integrante, total de 6 horas**, na semana de 12 a 18/10/2026. A previsão de 60 horas por integrante é distinta das horas realizadas. Nenhuma hora foi atribuída à migração automaticamente.
