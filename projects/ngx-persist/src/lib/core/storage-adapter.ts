export interface StorageAdapter {
  readonly isAsync: boolean;

  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;

  /**
   * Optional subscription mechanism for cross-tab / cross-context sync.
   * listener(null) can mean "clear all" depending on adapter semantics.
   */
  subscribe?(listener: (key: string | null) => void): () => void;
}

export type BuiltInAdapterName = 'local' | 'session';

export interface StorageSignalOptions<T> {
  key: string;
  initial: T;

  adapter?: BuiltInAdapterName | StorageAdapter;

  /**
   * Custom serializer. Defaults to JSON.stringify.
   */
  serialize?: (value: T) => string;

  /**
   * Custom parser. Defaults to JSON.parse and a best-effort cast.
   * If it throws, you should fall back to `initial`.
   */
  parse?: (raw: string) => T;
}
