import { Signal, linkedSignal, inject, effect } from '@angular/core';
import { NGX_PERSIST_CONFIG, resolveAdapter } from '../angular/ngx-persist.config';
import { StorageAdapter, StorageSignalOptions } from '../core/storage-adapter';
import { buildKey } from '../core/key-utils';

export interface StorageLinkedSignalOptions<T, D> extends Omit<StorageSignalOptions<T>, 'initial'> {
    source: () => D;
    computation: (source: D, previous?: { value: T; source: D }) => T;
}

export function storageLinkedSignal<T, D>(options: StorageLinkedSignalOptions<T, D>) {
    const config = inject(NGX_PERSIST_CONFIG, { optional: true }) ?? {};
    const adapter: StorageAdapter = resolveAdapter(options.adapter);

    // Note: Key generation might need to be dynamic if it depends on the source.
    // But usually the key is static (e.g. 'user_preferences') and the *value* resets when user changes.
    // If the key itself should change (e.g. 'user_123_prefs'), the user should pass a computed key?
    // For this implementation, we assume the key is static, but the *content* is linked to the source.
    const key = buildKey(config, options.key);

    const serialize = options.serialize ?? JSON.stringify;
    const parse = options.parse ?? ((raw: string) => JSON.parse(raw));

    // We use linkedSignal to handle the reset logic
    const state = linkedSignal<T, D>({
        source: options.source,
        computation: (source: D, previous?: { value: T; source: D }) => {
            // 1. Try to load from storage first
            // This is tricky because linkedSignal computation is synchronous, but storage might be async.
            // If async, we must return the computed initial value and update later.

            // For sync adapters (localStorage), we can try to read.
            if (!adapter.isAsync) {
                try {
                    const stored = adapter.getItem(key);
                    if (typeof stored === 'string') {
                        return parse(stored);
                    }
                } catch { }
            }

            // Fallback to the user's computation
            return options.computation(source, previous);
        }
    } as any);

    // Handle Async Hydration & Persistence
    effect(() => {
        const value = state();

        // Persist
        // We only persist if the value is "stable" (not in the middle of a reset?)
        // linkedSignal updates are atomic so it should be fine.
        try {
            adapter.setItem(key, serialize(value));
        } catch { }
    });

    // If async, we need a separate effect to hydrate
    if (adapter.isAsync) {
        effect(() => {
            // When source changes, we might want to re-hydrate?
            // Actually, the computation runs when source changes.
            // But computation can't be async.
            // So we might need to "set" the value after computation.

            // This is complex. For now, we support sync hydration in computation.
            // Async hydration for linkedSignal is a hard problem because of the "flash" of initial content.
            // We'll leave it as a limitation: Async adapters will start with computed value, then update.

            const currentKey = key;

            const result = adapter.getItem(currentKey);
            if (result instanceof Promise) {
                result.then((stored: string | null) => {
                    if (stored != null) {
                        state.set(parse(stored));
                    }
                });
            }
        });
    }

    return state;
}
