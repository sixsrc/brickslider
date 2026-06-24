# Contributing to BrickSlider

Thank you for considering contributing to BrickSlider. This guide explains how to run the project, report bugs, suggest improvements, and open pull requests in a way that keeps maintenance practical.

By submitting a pull request, you agree that your contribution may be incorporated into BrickSlider as part of an open source project published under the MIT license.

## Table of Contents

- [Development](#development)
- [Monorepo Structure](#monorepo-structure)
- [Bugs](#bugs)
- [Features](#features)
- [Documentation](#documentation)
- [Code Style](#code-style)
- [Commits and Changesets](#commits-and-changesets)
- [Pull Requests](#pull-requests)
- [Publishing](#publishing)
- [Code of Conduct](#code-of-conduct)

## Development

### Requirements

- Node.js 18+
- `pnpm`
- Git configured with your name and email

Initial setup:

```bash
git clone https://github.com/sixsrc/brickslider.git
cd brickslider
pnpm install
pnpm prepare
```

Run the main demo:

```bash
pnpm start
```

Run the documentation locally:

```bash
pnpm docs:watch
```

Build all packages:

```bash
pnpm build
```

Tests, linting, and formatting:

```bash
pnpm test
pnpm lint
pnpm lint:fix
pnpm format
```

## Monorepo Structure

Published packages:

- `packages/slider` — BrickSlider core.
- `packages/accessibility` — accessibility plugin.
- `packages/stories` — Instagram-style stories plugin.
- `packages/tailwind` — Tailwind preset/utilities and structural CSS.

Other important areas:

- `website/content/docs` — Markdown documentation content.
- `website/content/examples` — documentation example pages.
- `website/examples` — live examples used by the website.
- `website/downloads/examples` — standalone downloadable examples.
- `.github/ISSUE_TEMPLATE` — issue templates.
- `.github/PULL_REQUEST_TEMPLATE` — pull request templates.
- `.changeset` — package versioning.

## Bugs

Every bug report needs a clear reproduction. Without a minimal reproduction, it is hard to separate an actual bug from implementation details, cache issues, CDN issues, or local CSS.

When reporting a bug, include:

- affected package and version;
- usage method: npm, CDN, or local build;
- browser, operating system, and viewport size;
- minimal slider HTML;
- initialization code;
- reproduction steps;
- current behavior and expected behavior;
- screenshots, video, or console logs when useful.

Use the `Bug report` template in `.github/ISSUE_TEMPLATE/bug_report.md`.

If you are opening a PR to fix a bug, use a short and clear branch name:

```bash
git checkout -b fix/short-description
```

## Features

Feature suggestions are welcome, but they should explain the real problem they solve.

When suggesting a feature, include:

- use case;
- affected package;
- expected API, option, or markup;
- alternative you tried;
- impact on DX, accessibility, bundle size, or breaking changes;
- visual examples, if relevant.

Use the `Feature request` template in `.github/ISSUE_TEMPLATE/feature_request.md`.

If you are opening a PR to implement a feature:

```bash
git checkout -b feat/short-description
```

Keep the scope small. Large PRs are harder to review and easier to break.

## Documentation

The documentation is generated from the website Markdown files.

To edit docs:

```bash
pnpm docs:watch
```

Main files:

- `website/content/docs` — documentation pages.
- `website/content/examples` — example pages.
- `website/examples` — interactive examples.
- `website/downloads/examples` — downloadable examples.

Best practices:

- keep snippets aligned with the current API;
- prefer real, focused examples;
- if you change CDN, version, or imports, update docs and examples together;
- if you add a new example, verify both the live example and the download.

## Code Style

- Follow the style already used in the package you are changing.
- Prefer small and focused changes.
- Avoid abstractions before there is a real need.
- Do not mix a large refactor with a small bug fix.
- Use explicit names for state and properties.
- Avoid workaround CSS in examples: if the example sells Tailwind, use utility classes or official package CSS.
- Run lint/build before opening a PR.

## Commits and Changesets

Use Conventional Commits:

```bash
pnpm commit
```

Or write them manually:

```bash
feat(slider): add new option
fix(stories): sync progress after keyboard navigation
docs: update cdn examples
chore: add issue templates
```

If the change should produce a public release, create a changeset:

```bash
pnpm changeset
```

Use `patch`, `minor`, or `major` depending on the impact.

## Pull Requests

Before opening a PR:

- [ ] The change has a clear scope.
- [ ] I ran `pnpm lint`.
- [ ] I ran `pnpm build` when changing a published package.
- [ ] I updated docs/examples when changing API, markup, or CDN usage.
- [ ] I added a changeset when the change needs to be published.
- [ ] I tested the affected examples.

In the PR body, include:

- what changed;
- why it changed;
- how it was tested;
- screenshots or videos for visual changes;
- related issues, if any.

## Publishing

Useful scripts:

```bash
pnpm version:changeset
pnpm build
pnpm publish:changeset
```

The core package and plugins use separate builds for ESM, browser/CDN, and types. If you change public output, verify:

- `lib/**/*.js`
- `lib/**/*.d.ts`
- published CSS, when present
- CDN examples
- docs and downloads

## Code of Conduct

This project follows the Contributor Covenant.

Read `CODE_OF_CONDUCT.md` for expected behavior and reporting steps.

Summary:

- be respectful and objective;
- criticize code, not people;
- do not use discriminatory, intimidating, or offensive language;
- keep technical discussions useful for solving the problem.

## Support

Use the templates in `.github/ISSUE_TEMPLATE`:

- `Bug report` for reproducible bugs;
- `Feature request` for suggestions;
- `Question` for usage questions.
