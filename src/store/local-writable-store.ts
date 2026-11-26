import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';

import { FileNotFoundError, LocalFileStore } from '@commonkads/engine';

import type { IWritableStore } from '../interfaces/i-writable-store.js';

/** `IWritableStore` backed by the local filesystem. Extends `LocalFileStore`. */
export class LocalWritableStore extends LocalFileStore implements IWritableStore {
  private readonly root: string;

  constructor(rootDir: string) {
    super(rootDir);
    this.root = rootDir;
  }

  async write(path: string, content: string): Promise<void> {
    const resolvedPath = this.resolveOrThrow(path);
    await mkdir(dirname(resolvedPath), { recursive: true });
    await writeFile(resolvedPath, content, 'utf-8');
  }

  async delete(path: string): Promise<void> {
    const resolvedPath = this.resolveOrThrow(path);
    try {
      await unlink(resolvedPath);
    } catch (error) {
      if (isEnoent(error)) throw new FileNotFoundError(path);
      throw error;
    }
  }

  private resolveOrThrow(path: string): string {
    const resolvedRoot = resolve(this.root);
    const resolvedPath = resolve(join(this.root, path));
    if (!resolvedPath.startsWith(resolvedRoot + sep)) throw new FileNotFoundError(path);
    return resolvedPath;
  }
}

function isEnoent(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as NodeJS.ErrnoException).code === 'ENOENT'
  );
}
