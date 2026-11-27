# Changes — update-engine

## 0.3.0 — 2026-11-27

- Updated `@commonkads/engine` dependency to `^0.4.0`
- Replaced `FileStoreKnowledgeAdapter` + two-arg `RuntimeEngine` constructor with an inline `ICatalog` shim passed via `RuntimeContext.catalog`; `RuntimeEngine` now takes only the inference provider
- `IInferenceProvider` → `InferenceProvider`, `IFileStore` → `IStorageBackend` throughout
