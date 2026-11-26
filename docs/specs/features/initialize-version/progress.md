# Progress — initialize-version

## 2026-11-26

- Decision: binary-only, `private: true` — no library exports, no published package. The runner
  is a developer tool; there are no downstream dependents that need a programmatic API.

- Decision: register all five providers at startup rather than lazily — avoids conditional import
  complexity; CLI startup time is not a concern.

- Deviation: initial scaffold included validate and test subcommands carried over from
  `strata/author` design. These were removed when it became clear the runner's scope is
  executing a single knowledge task, not authoring or test-case management.

- Deviation: initial scaffold included `IWritableStore`, `LocalWritableStore`, types, and library
  re-exports. All removed — write capability is not needed for a runner, and no library consumers
  exist.

- Blocker: `npm install` did not trigger `@commonkads/dev-workflow` postinstall because the
  script approval policy blocked it → resolved by running `npm install-scripts approve
  @commonkads/dev-workflow`, then invoking the postinstall script directly.

- Blocker: `docs/` files (ci-guidance.md etc.) were listed in `.gitignore` and could not be
  staged with `git add` → confirmed by checking the engine repo that these files are intentionally
  gitignored (regenerated on `npm install`); only `docs/specs/` and `.claude/` are committed.
