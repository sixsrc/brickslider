# Contributing to brickslider

Obrigado por contribuir! Este guia descreve como configurar o projeto localmente, rodar testes/build, padronizar commits, criar changesets e abrir PRs de forma que o CI consiga gerar PRs de release automaticamente.

**Local (pré-requisitos)**
- Node.js 18+ (recomendado)
- pnpm (instale globalmente: `npm install -g pnpm`)
- Git configurado com seu nome/email

**Instalação (uma vez)**
```bash
# clone
git clone https://github.com/sixsrc/brickslider.git
cd brickslider

# instalar dependências (gera pnpm-lock.yaml)
pnpm install

# preparar ganchos (Husky)
pnpm prepare
```

**Estrutura básica**
- `packages/slider` — o pacote principal do slider.
- `pnpm-workspace.yaml` — workspaces configurados
- `.changeset/` — arquivos de changeset para versionamento
- `.github/workflows/` — CI (release PR + publish)

**Rodando o projeto**
- Rodar demo / dev server do pacote (no workspace):
```bash
pnpm --filter @sixsrc/brickslider start
# ou, de forma recursiva para todos workspaces:
pnpm -w -r start
```
- Build de todos pacotes:
```bash
pnpm -w -r build
```

**Testes, lint e formatação**
- Rodar testes em todos workspaces:
```bash
pnpm -w -r test
```
- Rodar lint:
```bash
pnpm -w -r run lint
```
- Corrigir lint automaticamente (quando possível):
```bash
pnpm -w -r run lint -- --fix
```
- Formatar código com Prettier:
```bash
pnpm -w -r run format
```

**Como contribuir (fluxo recomendado)**
1. Crie um ramo (branch) a partir de `main` seguindo um padrão: `feat/xxx`, `fix/xxx`, `chore/xxx`.
2. Faça mudanças pequenas e focadas.
3. Escreva/atualize testes quando aplicável.
4. Rode `pnpm -w -r test` e `pnpm -w -r lint` localmente antes de commitar.

**Commits padronizados (Conventional Commits)**
- Use `pnpm commit` para abrir o `commitizen` que auxilia a criar um commit no formato Conventional Commits.
- Ou escreva manualmente mensagens como: `feat(slider): add autoplay option` ou `fix(core): prevent crash on resize`.
- O hook Husky `commit-msg` executa `commitlint` e bloqueará commits que não seguem o padrão.

**Criar Changeset (para version bumps)**
Se a sua alteração deve resultar em um novo release (mudança pública), crie uma changeset:
```bash
pnpm changeset
```
- Siga as perguntas para indicar quais pacotes e qual tipo de bump (patch/minor/major).
- Isso criará um arquivo em `.changeset/`.
- Commit e push sua branch com a changeset.

**Abrir PR**
- Ao pushar para `main` (ou acionar manualmente o workflow), o CI `release-pr.yml` irá:
  - rodar `test` e `build` em todos workspaces;
  - executar `pnpm version:changeset` para aplicar os bumps;
  - gerar um resumo dos changesets e criar um branch `release/bump-<timestamp>` com os bumps;
  - abrir um PR rotulado `release` cujo corpo contém o template + o resumo de changesets.
- Revise o PR de release, verifique changelog e alterações em `package.json`/`CHANGELOG.md`.

**Publicação**
- A publicação automática está configurada via workflow `publish.yml` que é disparado quando uma tag `v*` é pushada para o repositório.
- Para publicar manualmente (local):
```bash
pnpm version:changeset    # opcional: aplica bumps localmente
pnpm -w -r publish --access public
```
- Para permitir publicação automática pelo CI, adicione o secret `NPM_TOKEN` no GitHub (Settings > Secrets) com um token do npm com permissões de publish.

**Dicas de revisão de PR**
- Verifique se testes passaram e build completou com sucesso.
- Confira `CHANGELOG.md` gerado e a corretude das versões.
- Se o PR for um release, confirme que o body contém o resumo gerado por Changesets.

**Boas práticas de código**
- Mantenha mudanças pequenas e focadas.
- Atualize/adicione testes para bugs e features.
- Evite quebrar APIs sem marcar `major` via changeset.

**Como ajudar com issues**
- Indique nos comentários quais partes do código você pretende tocar.
- Abra PRs pequenos e marque a issue correspondente com `Fixes #<issue>` quando apropriado.

**Contato / Suporte**
- Abra uma issue no repositório para problemas ou dúvidas maiores.

---

Obrigado por contribuir — seu trabalho é muito apreciado!

## Código de Conduta

Este projeto adota o Código de Conduta do Contributor Covenant para promover um ambiente saudável e acolhedor para todos os contribuintes.

- Leia o arquivo `CODE_OF_CONDUCT.md` para detalhes sobre comportamento esperado e como reportar incidentes.

Resumo rápido:
- Seja respeitoso e construtivo.
- Comentários de ódio, assédio, intimidação e linguagem discriminatória não serão tolerados.
- Se você sofrer ou testemunhar um comportamento inapropriado, reporte seguindo as instruções em `CODE_OF_CONDUCT.md`.

## Templates de Issues e Pull Requests

Colocamos templates para issues e pull requests em `.github/ISSUE_TEMPLATE/` e `.github/PULL_REQUEST_TEMPLATE/`.

- Use o template de `bug_report` para relatar um bug, incluindo passos para reproduzir, ambiente e comportamento esperado/observado.
- Use o template de `feature_request` para propor novas funcionalidades.
- Use o template de PR padrão quando abrir mudanças regulares — inclua a referência a issues que resolve e passos para testar.

Esses templates ajudam a manter consistência e acelerar a triagem.
