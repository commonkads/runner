import type { IFileStore } from '@commonkads/engine';

/** Extends `IFileStore` with write and delete operations on knowledge files. */
export interface IWritableStore extends IFileStore {
  write(path: string, content: string): Promise<void>;
  delete(path: string): Promise<void>;
}
