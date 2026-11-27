# Changelog

## Table of Contents

- [0.3.0 — 2026-11-27](#030--2026-11-27)
- [0.2.0 — 2026-11-26](#020--2026-11-26)

---

## [0.3.0] — 2026-11-27

- Updated `@commonkads/engine` to `^0.4.0`
- Replaced `FileStoreKnowledgeAdapter` with an inline `ICatalog` shim; `RuntimeEngine` now takes only the inference provider
- `IInferenceProvider` → `InferenceProvider`, `IFileStore` → `IStorageBackend` throughout

[Full change log →](docs/specs/features/update-engine/07-changes.md)

---

## [0.2.0] — 2026-11-26

- Added `--thinking`, `--log-level`, `--explain`, `--audit`, and `--timings` CLI flags
- Updated `@commonkads/engine` to `^0.2.0`

[Full change log →](docs/specs/features/initialize-version/07-changes.md)
