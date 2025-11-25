import { ResourceLoaderParams, ResourceLoader } from '@angular/core';
import { StorageAdapter } from './storage-adapter';

export interface PersistResourceOptions<T, R> {
    adapter: StorageAdapter;
    key: string | ((params: ResourceLoaderParams<R>) => string);
    serialize?: (value: T) => string;
    parse?: (raw: string) => T;
}

/**
 * Wraps a resource loader with persistence logic.
 * 
 * Strategy: Stale-While-Revalidate
 * 1. Return cached value immediately if available (via promise)
 * 2. Fetch new value
 * 3. Save new value
 * 
 * Note: Angular Resource API expects a Promise.
 * If we want to return cached value *then* update, we might need a different approach
 * because a Promise resolves once.
 * 
 * However, Resource API handles "reloading".
 * 
 * Current limitation: We can only return ONE value per load.
 * So we have to choose:
 * A) Return cached value (fast, but maybe stale). Then user must manually reload?
 * B) Return fresh value (slow, offline fails).
 * 
 * Better Strategy for Resource:
 * - If online: Fetch -> Save -> Return
 * - If offline (fetch fails): Load from Storage -> Return
 */
export function persistResource<T, R>(
    loader: ResourceLoader<T, R>,
    options: PersistResourceOptions<T, R>
): ResourceLoader<T, R> {
    const serialize = options.serialize ?? JSON.stringify;
    const parse = options.parse ?? ((raw: string) => JSON.parse(raw));

    return async (params: ResourceLoaderParams<R>): Promise<T> => {
        const key = typeof options.key === 'function' ? options.key(params) : options.key;
        const { adapter } = options;

        try {
            // Try to fetch fresh data
            const data = await loader(params);

            // Save to storage
            try {
                const serialized = serialize(data);
                const result = adapter.setItem(key, serialized);
                if (result instanceof Promise) await result;
            } catch (e) {
                console.warn('Failed to persist resource', e);
            }

            return data;
        } catch (error) {
            // Fetch failed (offline?), try storage
            try {
                const stored = adapter.getItem(key);
                const raw = stored instanceof Promise ? await stored : stored;

                if (raw != null) {
                    return parse(raw);
                }
            } catch (storageError) {
                // Storage also failed
            }

            // If storage empty or failed, re-throw original error
            throw error;
        }
    };
}
