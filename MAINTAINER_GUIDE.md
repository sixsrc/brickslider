# BrickSlider Maintainer Guide

## 1. Current repository assessment

This monorepo already has a good foundation:

- `pnpm` workspace configured in `pnpm-workspace.yaml`
- main package in `packages/slider`
- plugins split into dedicated packages:
  - `packages/accessibility`
  - `packages/stories`
  - `packages/tailwind`
- conventional commits tooling:
  - `commitizen`
  - `commitlint`
- `changesets` installed for versioning and release management
- GitHub templates for issues and pull requests
- GitHub Actions workflows for release automation

That said, it is **not fully production-ready as a release pipeline yet**.

---

## 2. What is missing in folder organization

### High-priority improvements

1. **Keep maintainer docs grouped at the repository root**
   - Right now important maintainer knowledge is spread across `README.md`, `CONTRIBUTING.md`, workflows, and package files.
   - Recommended docs:
     - `MAINTAINER_GUIDE.md`
     - `RELEASE_FLOW.md`
     - `PLUGIN_GUIDE.md` if you reopen plugin authoring later
     - `ARCHITECTURE.md`

2. **Add `README.md` to every publishable package**
   - `packages/accessibility` currently has no package README
   - `packages/stories` currently has no package README
   - `packages/slider` also deserves a package-specific README
   - This matters for npm package pages and contributor onboarding.

3. **Add package build scripts for all publishable packages**
   - Today only `packages/slider` has a `build` script.
   - `accessibility`, `stories`, and `tailwind` do not.
   - If they will be published professionally, each package should either:
     - build to `dist/`, or
     - very intentionally ship source with a documented strategy.

4. **Standardize exports around built output**
   - `stories` and `accessibility` export `src/index.ts` directly.
   - That is convenient during development, but not ideal for npm consumers.
   - Recommended target:
     - `dist/index.js`
     - `dist/index.cjs`
     - `dist/index.d.ts`

5. **Remove files that should not live in the repo**
   Current red flags:
   - root `package-lock.json` in a `pnpm` workspace
   - `packages/slider/package-lock.json`
   - `packages/slider/vitest.config.ts.timestamp-1691970058147-7164c2b75e334.mjs`

   Recommended:
   - keep only `pnpm-lock.yaml`
   - remove generated timestamp files
   - ensure `.gitignore` blocks these permanently

6. **Add a shared base config layer**
   Recommended files:
   - `tsconfig.base.json`
   - optional shared eslint/prettier config file

   This reduces duplication once all packages get build/test/lint scripts.

7. **Normalize file naming across the repo**
   Example inconsistency still present:
   - `packages/stories/src/BSStoriesPlugin.ts`
   - but class name is `BrickSliderStories`

   Recommended direction:
   - align filenames with final public class names
   - avoid legacy `BS*` leftovers where possible

---

## 3. What is already automatic today

### Commit formatting
Yes, **partially automated**.

Already present:
- `pnpm commit` -> opens Commitizen
- `commitlint.config.cjs` -> validates commit messages
- `.husky/commit-msg` -> runs commitlint on each commit

So commit message format is already enforced if Husky is installed.

### Versioning
Yes, **partially automated**.

Already present:
- `changesets` installed
- root scripts:
  - `pnpm changeset`
  - `pnpm version:changeset`
  - `pnpm publish:changeset`

This is the correct family of tools for multi-package versioning.

### Contributor management
Yes, **partially automated**.

Already present:
- `all-contributors-cli`
- scripts:
  - `pnpm contributors:add`
  - `pnpm contributors:generate`

### Release PR scaffolding
Yes, **there is automation**, but it still needs refinement.

Already present:
- `.github/workflows/release-pr.yml`

It:
- runs on push to `main`
- installs dependencies
- runs tests/build
- runs `pnpm version:changeset`
- creates a release branch
- opens a release PR

---

## 4. What is NOT automatic or not correctly wired yet

This is the important part.

### 4.1 npm publish is not correctly configured yet
Current workflows:
- `.github/workflows/release.yml`
- `.github/workflows/publish.yml`

Both use `changesets/action@v1`, but the current `publish` command is:

```yml
with:
  publish: pnpm
```

That is **not enough**.

`pnpm` alone does not mean “publish all packages”.
For Changesets, the publish command should be something like:

```yml
with:
  publish: pnpm publish:changeset
```

or directly:

```yml
with:
  publish: pnpm changeset publish
```

### 4.2 `release.yml` does not have `NPM_TOKEN`
Current `release.yml` only passes:

```yml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

That means it can open PRs / create GitHub release metadata, but **cannot publish to npm**.

To publish to npm, it needs:

```yml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4.3 plugin packages are not yet fully prepared for npm publishing
Today:
- `packages/accessibility`
- `packages/stories`
- `packages/tailwind`

lack:
- build scripts
- clear dist output
- package-specific READMEs in 2 of the 3 packages

That means even if GitHub Actions tried to publish them, the package quality is still not ideal for consumers.

### 4.4 tests/lint are not uniformly implemented across packages
Root scripts recurse into workspaces, but several packages do not define their own:
- `build`
- `test`
- `lint`

So the monorepo looks automated from the top level, but enforcement is still uneven.

---

## 5. Documentation consistency rules

When documenting slider options, keep the examples aligned with the real API behavior:

- always show `pnpm` before `npm` in install sections
- when showing `screens`, explicitly mention the supported breakpoint keys: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- when showing `responsive`, document the full set of supported responsive keys:
  - `slidesPerView`
  - `slidesPerPage`
  - `slideSizes`
  - `useSlideSizes`
- include at least one responsive example that uses breakpoint-specific `slideSizes`
- explicitly mention that `useSlideSizes: false` disables both local and global `slideSizes` for that breakpoint
- avoid docs examples that make `responsive` look limited to only `slidesPerView` and `slidesPerPage`

---

## 6. Recommended folder organization

Recommended target structure:

```txt
.github/
  workflows/
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE/

.changeset/

.husky/

MAINTAINER_GUIDE.md
RELEASE_FLOW.md
ARCHITECTURE.md
CONTRIBUTING_FLOW.md

packages/
  slider/
    README.md
    package.json
    src/
    dist/
    public/
    development/
    __tests__/

  accessibility/
    README.md
    package.json
    src/
    dist/
    __tests__/

  stories/
    README.md
    package.json
    src/
    dist/
    __tests__/

  tailwind/
    README.md
    package.json
    src/
    dist/

tsconfig.base.json
pnpm-workspace.yaml
pnpm-lock.yaml
package.json
README.md
CHANGELOG.md
CONTRIBUTING.md
CONTRIBUTORS.md
```

---

## 6. Professional contribution flow

This is the flow I recommend for external contributors.

### Contributor flow

1. **Fork the repository**
2. **Create a branch from `main`**
   Recommended patterns:
   - `fix/arrow-disabled-state`
   - `feat/stories-progress-sync`
   - `docs/release-guide`
3. **Install dependencies**
   ```bash
   pnpm install
   pnpm prepare
   ```
4. **Create the fix/feature**
5. **Run checks locally**
   ```bash
   pnpm build
   pnpm test
   pnpm lint
   ```
6. **Commit professionally**
   ```bash
   pnpm commit
   ```
7. **Create a changeset if the change affects a published package**
   ```bash
   pnpm changeset
   ```
8. **Push branch and open PR to `main`**

### Should contributors use their own branch?
Yes.

Recommended rule:
- every contribution goes in a dedicated branch
- never commit directly to `main`

### Should you keep a permanent contribution branch?
No, not as the main flow.

Best practice is:
- `main` = stable development line
- optional `next` = future staging line if you want a pre-release channel
- feature/fix branches are temporary

---

## 7. Professional maintainer review flow

When someone opens a PR, your review flow should be:

1. Check whether the PR is focused and small enough
2. Verify it targets the correct branch (`main`)
3. Review code quality
4. Run locally if needed:
   ```bash
   pnpm install
   pnpm build
   pnpm test
   pnpm lint
   ```
5. Check whether a changeset was included when needed
6. Check whether docs/tests were updated when appropriate
7. Approve or request changes
8. Merge with a consistent strategy

### Recommended merge strategy
Use **Squash and merge** for most contributions.

Why:
- keeps `main` clean
- preserves Conventional Commit naming in the squash title
- makes changelog generation easier to read

Suggested squash title format:
- `fix(slider): disable next arrow at end`
- `feat(stories): add keyboard escape close`

---

## 8. How to commit professionally

### Preferred method
Use:

```bash
pnpm commit
```

This opens Commitizen and helps produce messages like:
- `fix(slider): align dots with control row`
- `feat(stories): add play pause hover control`
- `docs(repo): add maintainer guide`

### Recommended commit categories
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `refactor`: code cleanup without behavior change
- `test`: tests only
- `chore`: tooling, config, release chores

---

## 9. How to version packages professionally

Use Changesets.

### For a normal contributor
If the change impacts published output:

```bash
pnpm changeset
```

Then answer:
- which package changed?
- patch / minor / major?
- short summary?

### Meaning of bump types
- **patch** = bugfix, no breaking API
- **minor** = new feature, backwards compatible
- **major** = breaking change

### Applying versions locally
Maintainer can run:

```bash
pnpm version:changeset
```

That updates:
- package versions
- changelog entries
- internal dependency versions if configured

---

## 10. How to generate changelog automatically

Two mechanisms exist in the repo:

### 10.1 Changesets changelog
This should be the main one.

When you run:

```bash
pnpm version:changeset
```

Changesets updates changelog content based on `.changeset/*` files.

### 10.2 `standard-changelog`
Also installed as:

```bash
pnpm changelog
```

But for this repo, **Changesets should be the source of truth**, otherwise you will create duplicate release processes.

### Recommendation
Keep **one** release source of truth.

Best choice here:
- keep `changesets`
- treat `standard-changelog` as optional or remove it later if unused

---

## 11. How to add contributors automatically

Already available:

```bash
pnpm contributors:add <github-user> <contribution-type>
pnpm contributors:generate
```

Example:

```bash
pnpm contributors:add joaosilva code
pnpm contributors:generate
```

Then commit the updated `README.md` / `CONTRIBUTORS.md` if changed.

---

## 12. Is all of this already automatic in the code today?

### Yes, partially
Already automated:
- commit formatting support
- commitlint enforcement
- changesets tooling installed
- contributor tooling installed
- release PR workflow exists

### No, not fully
Not yet fully automatic / reliable:
- npm publish from GitHub Actions
- package build/publish consistency across all packages
- uniform lint/test/build across all workspaces
- professional package outputs for all plugins
- clean maintainer documentation

So the honest answer is:

> **No, this is not fully automatic yet. The foundation exists, but the release pipeline still needs to be finished and cleaned up.**

---

## 13. Recommended GitHub Actions release model

### Recommended model
Do **not** publish to npm on every commit.

That is too aggressive for a library and plugins.

Professional recommendation:

1. contributors open PRs
2. maintainers merge to `main`
3. if a changeset exists, CI opens or updates a release PR
4. maintainer reviews release PR
5. merge release PR
6. CI publishes changed packages to npm

This is the standard Changesets flow.

### Why not publish every commit?
Because:
- every commit is not a release
- mistakes become public instantly
- version noise becomes unmanageable
- npm history gets polluted

### Better rule
Publish on:
- merge of release PR
- or manual workflow dispatch
- or tags created from approved releases

---

## 14. How to publish the library and plugins to npm from GitHub Actions

### Required GitHub secrets
In GitHub repo settings, add:

- `NPM_TOKEN`

This token must have npm publish rights.

### Recommended workflow behavior
A correct release workflow should:

1. checkout repo
2. setup Node + pnpm
3. install dependencies
4. run tests
5. run builds
6. run Changesets action
7. publish changed packages with npm token

### Recommended `release.yml` direction
The core publish step should look like this conceptually:

```yml
- name: Create Release / Publish
  uses: changesets/action@v1
  with:
    publish: pnpm publish:changeset
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

And your root script already exists:

```json
"publish:changeset": "changeset publish"
```

That is the right command to wire into the action.

### Important prerequisite
Before this goes live, each publishable package should be ready with:
- correct build script
- proper `files`
- proper exports
- proper README
- correct version handling

---

## 15. Recommended branch policy

### Suggested branches
- `main` -> main development branch
- optional `next` -> preview / prerelease branch

### Contributor branches
- `feat/...`
- `fix/...`
- `docs/...`
- `refactor/...`
- `chore/...`

### Protection recommended for `main`
Enable in GitHub:
- require PR before merge
- require status checks to pass
- require linear history or squash merge
- restrict direct push to `main`

---

## 16. Maintainer release checklist

Before merging a release PR:

- [ ] all packages build
- [ ] tests pass
- [ ] changed packages have a changeset
- [ ] versions look correct
- [ ] changelog entries make sense
- [ ] package READMEs are up to date
- [ ] npm token is configured
- [ ] workflows point to `changeset publish`

---

## 17. Practical answer: what I would change next

If I were maintaining this as an open-source library, my next steps would be:

1. remove stray lockfiles and generated timestamp files
2. add maintainer/release documentation at the repository root
3. add package READMEs for `accessibility`, `stories`, `slider`
4. add build pipelines for all publishable packages
5. move plugins to proper `dist/` publishing
6. fix GitHub Actions release/publish commands
7. add branch protection on `main`
8. standardize naming leftovers like `BSStoriesPlugin.ts`

---

## 18. Bottom line

The repo is already **well on its way**:
- the monorepo choice is good
- package split is good
- changesets choice is good
- commit tooling choice is good

What is still missing is the **last professional layer**:
- polished release automation
- package publish readiness for every plugin
- maintainer docs
- minor repository cleanup

That is normal at this stage.

The important thing is that the foundation is already strong enough for us to finish this properly.
