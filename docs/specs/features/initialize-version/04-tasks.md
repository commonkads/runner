# Tasks — initialize-version

Ordered implementation tasks.

1. **Initialise repo** — clone the GitHub repo, set remote to `git@github-commonkads`, create
   initial commits with `tsconfig.json`, `tsconfig.test.json`, `eslint.config.mjs`, `.npmrc`,
   `.gitignore`, and `CLAUDE.md`

2. **Add `@commonkads/dev-workflow`** — add as a devDependency, run `npm install`, approve
   the postinstall script; verify `docs/`, `.claude/skills/`, and `.claude/agents/` are
   populated; commit `package.json`, `package-lock.json`, `CLAUDE.md`, `.claude/`

3. **Write `src/domain-runner.ts`** — implement `DomainRunnerOptions`, `toProviderOptions`
   (switch on provider name), `loadPayload` (file or inline JSON), and `runDomain` (wire
   engine, print result, optional explain/audit/timings)

4. **Write `src/cli/index.ts`** — register all five provider packages, define Commander
   program named `runner` with all flags, call `runDomain`, handle `DomainManifestError`

5. **Write `package.json`** — `private: true`, `bin.runner → ./dist/cli/index.js`, all five
   provider packages as dependencies, `@commonkads/dev-workflow` as devDependency

6. **Write `.github/workflows/ci.yml`** — lint + compile job on pull requests to `main`;
   no release step (private package)

7. **Write `README.md`** — usage, flags table, provider list

8. **Create feature branch `feature/initialize-version`** and commit all implementation work

9. **Create feature documentation** (this file and siblings)
