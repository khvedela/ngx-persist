import { InjectionToken, Provider } from '@angular/core';
import { StorageAdapter, BuiltInAdapterName } from '../core/storage-adapter';
import { MemoryAdapter } from '../adapters/memory-adapter';

export interface NgxPersistConfig {
  prefix?: string;
  // later: logger, error strategy, etc.
}

export const NGX_PERSIST_CONFIG = new InjectionToken<NgxPersistConfig>(
  'NGX_PERSIST_CONFIG',
);

export function provideNgxPersist(config: NgxPersistConfig = {}): Provider[] {
  return [
    {
      provide: NGX_PERSIST_CONFIG,
      useValue: config,
    },
  ];
}

export function resolveAdapter(adapter?: BuiltInAdapterName | StorageAdapter): StorageAdapter {
  if (adapter && typeof adapter === 'object') return adapter;

  if (typeof window === 'undefined') {
    // SSR / no window: in-memory fallback adapter
    return new MemoryAdapter();
  }

  if (adapter === 'session') {
    return createWebStorageAdapter(() => window.sessionStorage);
  }

  // default: local
  return createWebStorageAdapter(() => window.localStorage);
}

function createWebStorageAdapter(getStore: () => Storage): StorageAdapter {
  return {
    isAsync: false,
    getItem(key) {
      try {
        return getStore().getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        getStore().setItem(key, value);
      } catch {
        // swallow
      }
    },
    removeItem(key) {
      try {
        getStore().removeItem(key);
      } catch {
        // swallow
      }
    },
  };
}
