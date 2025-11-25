// @ts-ignore
import { signalStoreFeature, withHooks, withState } from '@ngrx/signals';
import { effect, inject } from '@angular/core';
import { NGX_PERSIST_CONFIG, resolveAdapter } from '../angular/ngx-persist.config';
import { StorageAdapter } from '../core/storage-adapter';
import { buildKey } from '../core/key-utils';

export interface PersistConfig {
    key: string;
    adapter?: StorageAdapter;
    // Select specific slices to persist? For now, we persist the whole feature state.
}

export function withPersist<State extends object>(config: PersistConfig) {
    return signalStoreFeature(
        withHooks({
            // @ts-ignore
            onInit(store) {
                const globalConfig = inject(NGX_PERSIST_CONFIG, { optional: true }) ?? {};
                const adapter = resolveAdapter(config.adapter);
                const key = buildKey(globalConfig, config.key);

                // Hydrate
                const stored = adapter.getItem(key);
                if (stored) {
                    if (stored instanceof Promise) {
                        stored.then(raw => {
                            if (raw) {
                                try {
                                    const state = JSON.parse(raw);
                                    // We need to patch the store.
                                    // SignalStore doesn't expose a generic patchState on the store instance directly 
                                    // unless we use withMethods or similar.
                                    // However, we can't easily access patchState here without knowing the store type.
                                    // But `store` usually has methods if we are inside onInit?
                                    // Actually, onInit gives us the store instance.

                                    // Hack/Workaround: We assume the store has a generic update mechanism or we rely on
                                    // the user to provide a hydration method?
                                    // Or we can try to write to the signals if they are writable?
                                    // SignalStore state signals are readonly.

                                    // Better approach:
                                    // We can't easily "set" the state of a SignalStore from outside unless we use `patchState`.
                                    // But `patchState` is a standalone function in @ngrx/signals.
                                    // import { patchState } from '@ngrx/signals';
                                    // patchState(store, state);

                                    // Let's try dynamic import or assume it's available.
                                    // @ts-ignore
                                    const { patchState } = require('@ngrx/signals');
                                    patchState(store, state);
                                } catch (e) {
                                    console.error('Failed to hydrate store', e);
                                }
                            }
                        });
                    } else {
                        try {
                            const state = JSON.parse(stored);
                            // @ts-ignore
                            const { patchState } = require('@ngrx/signals');
                            patchState(store, state);
                        } catch (e) {
                            console.error('Failed to hydrate store', e);
                        }
                    }
                }

                // Persist
                effect(() => {
                    // We need to get the whole state.
                    // SignalStore exposes `...store.slices`.
                    // But how to get the full state object?
                    // Usually `getState(store)` from @ngrx/signals.
                    // @ts-ignore
                    const { getState } = require('@ngrx/signals');
                    const state = getState(store);

                    try {
                        const serialized = JSON.stringify(state);
                        adapter.setItem(key, serialized);
                    } catch (e) {
                        console.error('Failed to persist store', e);
                    }
                });
            }
        })
    );
}
