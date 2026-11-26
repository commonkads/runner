import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { FileNotFoundError } from '@commonkads/engine';

import { LocalWritableStore } from './local-writable-store.js';

describe('LocalWritableStore', () => {
  let rootDir: string;
  let store: LocalWritableStore;

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), 'runner-writable-store-'));
    store = new LocalWritableStore(rootDir);
  });

  after(async () => {
    await rm(rootDir, { recursive: true });
  });

  test('write creates a file with the given content that read returns', async () => {
    await store.write('note.md', 'hello');

    assert.equal(await store.read('note.md'), 'hello');
  });

  test('write creates intermediate directories that do not exist', async () => {
    await store.write('nested/deep/file.md', 'nested');

    assert.equal(await store.read('nested/deep/file.md'), 'nested');
  });

  test('delete removes an existing file so that read throws FileNotFoundError', async () => {
    await store.write('to-delete.md', 'bye');

    await store.delete('to-delete.md');

    await assert.rejects(() => store.read('to-delete.md'), FileNotFoundError);
  });

  test('delete throws FileNotFoundError when the file does not exist', async () => {
    await assert.rejects(() => store.delete('never-existed.md'), FileNotFoundError);
  });

  test('write throws FileNotFoundError for a path traversal outside the root', async () => {
    await assert.rejects(() => store.write('../escape.md', 'nope'), FileNotFoundError);
  });

  test('delete throws FileNotFoundError for a path traversal outside the root', async () => {
    await assert.rejects(() => store.delete('../escape.md'), FileNotFoundError);
  });
});
