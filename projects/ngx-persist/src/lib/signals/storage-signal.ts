import { Signal, signal, effect, inject } from '@angular/core';
import { NGX_PERSIST_CONFIG, NgxPersistConfig, resolveAdapter } from '../angular/ngx-persist.config';
import { StorageAdapter, StorageSignalOptions } from '../core/storage-adapter';
import { buildKey } from '../core/key-utils';

export interface StorageSignal<T> {
  (): T;
  readonly key: string;
  readonly loaded: Signal<boolean>;

  set(value: T): void;
  update(updater: (value: T) => T): void;
  clear(): void;
}

/**
 * Main API
 */
export function storageSignal<T>(options: StorageSignalOptions<T>): StorageSignal<T> {
  const config = inject(NGX_PERSIST_CONFIG, { optional: true }) ?? {};
  const adapter: StorageAdapter = resolveAdapter(options.adapter);
  const key = buildKey(config, options.key);

  const serialize = options.serialize ?? defaultSerialize<T>;
  const parse = options.parse ?? defaultParse<T>(options.initial);

  const state = signal<T>(options.initial);
  const loaded = signal<boolean>(!adapter.isAsync);

  hydrateFromAdapter(state, loaded, adapter, key, parse);

  // Persist on change
  effect(() => {
    const value = state();
    // Only persist if loaded (avoid overwriting storage with initial value before hydration)
    if (loaded()) {
      persistToAdapter(adapter, key, value, serialize);
    }
  });

  // Subscribe to external changes (e.g. BroadcastChannel)
  if (adapter.subscribe) {
    const cleanup = adapter.subscribe((changedKey) => {
      if (changedKey === key || changedKey === null) {
        // re-hydrate
        hydrateFromAdapter(state, loaded, adapter, key, parse);
      }
    });
    // Note: We can't easily cleanup this subscription as signals don't have a destroy hook yet.
    // In a component, it's fine. In a service, it lives forever.
    // Ideally we'd use DestroyRef but we are in a function.
    // For now, we assume the signal lives as long as the context.
  }

  const api = createStorageSignalApi(state, loaded, key, adapter, options.initial);

  return api;
}

// ----- helpers (all typed, no any in public surface) -----

function defaultSerialize<T>(value: T): string {
  return JSON.stringify(value);
}

function defaultParse<T>(initial: T) {
  return (raw: string): T => {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  };
}

function hydrateFromAdapter<T>(
  state: Signal<T> & { set(value: T): void },
  loaded: Signal<boolean> & { set(value: boolean): void },
  adapter: StorageAdapter,
  key: string,
  parse: (raw: string) => T,
): void {
  try {
    const result = adapter.getItem(key);
    if (result instanceof Promise) {
      // async hydrate
      result.then((raw) => {
        if (raw != null) {
          state.set(parse(raw));
        }
        loaded.set(true);
      }).catch(() => {
        loaded.set(true);
      });
    } else {
      if (result != null) {
        state.set(parse(result));
      }
      loaded.set(true);
    }
  } catch {
    loaded.set(true);
  }
}

function persistToAdapter<T>(
  adapter: StorageAdapter,
  key: string,
  value: T,
  serialize: (value: T) => string,
): void {
  try {
    const serialized = serialize(value);
    const result = adapter.setItem(key, serialized);

    if (result instanceof Promise) {
      result.catch(() => { /* swallow */ });
    }
  } catch {
    // swallow
  }
}

function createStorageSignalApi<T>(
  state: Signal<T> & { set(value: T): void },
  loaded: Signal<boolean>,
  key: string,
  adapter: StorageAdapter,
  initial: T,
): StorageSignal<T> {
  const callable: (() => T) = () => state();

  const api: StorageSignal<T> = Object.assign(callable, {
    key,
    loaded,
    set(value: T): void {
      state.set(value);
    },
    update(updater: (value: T) => T): void {
      const next = updater(state());
      state.set(next);
    },
    clear(): void {
      state.set(initial);
      try {
        const result = adapter.removeItem(key);
        if (result instanceof Promise) {
          result.catch(() => { /* swallow */ });
        }
      } catch {
        // swallow
      }
    },
  });

  return api;
}
