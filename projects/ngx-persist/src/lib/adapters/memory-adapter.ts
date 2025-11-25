import { StorageAdapter } from '../core/storage-adapter';

/**
 * A synchronous in-memory storage adapter.
 * Useful for testing, SSR, or non-persistent state.
 */
export class MemoryAdapter implements StorageAdapter {
    readonly isAsync = false;
    private store = new Map<string, string>();

    getItem(key: string): string | null {
        return this.store.get(key) ?? null;
    }

    setItem(key: string, value: string): void {
        this.store.set(key, value);
    }

    removeItem(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }
}
