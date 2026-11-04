# Migração da Fase 3

## Escopo

Aprovação limitada à fundação: preservar protótipo, criar monorepo e apps mínimos, configurar qualidade e documentar. Banco, autenticação e módulos de negócio ficam para a Fase 4.

Branch de entrada: `feat/fase-3-foundation`. Commit de referência: `d985cc5`. Estado inicial limpo, seis testes aprovados. Não criar backup temporário, commit, PR, push ou alterar main.

## Execução

1. Conferir branch, alterações, Node/npm e metadados de dependências.
2. Medir hashes dos oito arquivos.
3. Mover server.js, public/, test/, package.json e README.md para examples/prototype, sem alterar conteúdos.
4. Comparar os oito hashes, executar seis testes e smoke HTTP do protótipo.
5. Criar npm workspaces, configurações compartilhadas, Turbo e pacotes mínimos.
6. Criar apenas Health na API e telas iniciais no admin/mobile.
7. Instalar dependências na raiz, gerar lockfile único e verificar grafo.
8. Executar typecheck, lint, testes e builds, corrigindo causas das falhas.
9. Preservar documentação acadêmica e horas; registrar resultados e limitações.
10. Conferir diff, hashes e branch; deixar alterações sem commit para revisão.

## Recuperação

O histórico Git e a branch dedicada são o mecanismo de recuperação. Não há cópia temporária dos arquivos originais.

Para recuperar apenas a organização anterior, após revisar alterações novas:

- Interromper somente os processos iniciados para os testes.
- Conferir `git diff` e `git status`.
- Conferir `npm run verify:prototype`.
- Realocar os arquivos preservados para os caminhos originais, com os destinos absolutos verificados.
- Preservar separadamente alterações novas que ainda precisem ser revisadas antes de substituir manifestos.
- Conferir os hashes, executar os seis testes e iniciar o servidor.
- Usar `git show d985cc5:<caminho>` para consultar o conteúdo histórico quando necessário.

Não usar reset --hard, git clean, rebase ou restauração indiscriminada. Não substituir alterações do usuário posteriores ao checkpoint.

Se apenas o workspace falhar, `node examples/prototype/server.js` continua disponível independentemente de npm/Turbo.

## Ajustes operacionais

- Sem backup local, conforme instrução posterior do usuário.
- README original movido integralmente; README raiz é novo.
- Módulos obrigatórios do Expo Router declarados explicitamente.
- Só os contratos mínimos foram criados; nenhuma pasta de módulos de negócio vazia.
- Nenhuma ferramenta de banco ou suíte mobile de negócio instalada antecipadamente.
