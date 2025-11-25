import { Signal, signal, effect, inject } from '@angular/core';
import { NGX_PERSIST_CONFIG, NgxPersistConfig, resolveAdapter } from '../angular/ngx-persist.config';
import { StorageAdapter, StorageSignalOptions } from '../core/storage-adapter';
import { buildKey } from '../core/key-utils';

export interface StorageSignal<T> {
  (): T;
  readonly key: string;

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

  hydrateFromAdapter(state, adapter, key, parse);

  // Persist on change
  effect(() => {
    const value = state();
    persistToAdapter(adapter, key, value, serialize);
  });

  const api = createStorageSignalApi(state, key, adapter, options.initial);

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
      }).catch(() => { /* ignore, keep initial */ });
    } else if (result != null) {
      state.set(parse(result));
    }
  } catch {
    // swallow, stay with initial
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
  key: string,
  adapter: StorageAdapter,
  initial: T,
): StorageSignal<T> {
  const callable: (() => T) = () => state();

  const api: StorageSignal<T> = Object.assign(callable, {
    key,
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
