import { StorageAdapter } from '../core/storage-adapter';

interface TTLValue {
    value: string;
    expiry: number;
}

/**
 * Wraps a storage adapter to add Time-To-Live (TTL) support.
 * Items stored will automatically expire after the specified duration.
 *
 * @param adapter The underlying storage adapter to use.
 * @param durationMs The duration in milliseconds before an item expires.
 * @returns A new StorageAdapter with TTL logic.
 */
export function withTTL(adapter: StorageAdapter, durationMs: number): StorageAdapter {
    return {
        isAsync: adapter.isAsync,

        getItem(key: string): string | null | Promise<string | null> {
            const result = adapter.getItem(key);
            if (result instanceof Promise) {
                return result.then((val) => handleGet(val, key));
            }
            return handleGet(result, key);
        },

        setItem(key: string, value: string): void | Promise<void> {
            const expiry = Date.now() + durationMs;
            const data: TTLValue = { value, expiry };
            return adapter.setItem(key, JSON.stringify(data));
        },

        removeItem(key: string): void | Promise<void> {
            return adapter.removeItem(key);
        },

        clear: adapter.clear ? () => adapter.clear!() : undefined,

        subscribe: adapter.subscribe
            ? (listener) => adapter.subscribe!(listener)
            : undefined,
    };

    function handleGet(val: string | null, key: string): string | null {
        if (!val) return null;
        try {
            const data = JSON.parse(val);
            if (
                data &&
                typeof data === 'object' &&
                typeof data.expiry === 'number' &&
                'value' in data
            ) {
                if (data.expiry < Date.now()) {
                    // Fire and forget remove, or should we wait?
                    // getItem is usually synchronous if adapter is synchronous.
                    // removeItem might be async.
                    // We don't want to block returning null.
                    // But if removeItem fails, we keep getting expired data?
                    // That's acceptable.
                    adapter.removeItem(key);
                    return null;
                }
                return data.value;
            }
        } catch {
            // Ignore parsing errors
        }
        // If data format doesn't match (e.g. old data), treat as expired/invalid
        return null;
    }
}
