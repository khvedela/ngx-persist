---
title: Custom Adapters
---

# Custom Adapters

`ngx-persist` is designed to be extensible. If the built-in [LocalStorage](/storage-adapters/local-storage), [SessionStorage](/storage-adapters/session-storage), [IndexedDB](/storage-adapters/indxed-db), or [In-Memory](/storage-adapters/memory) adapters don't meet your needs, you can create your own.

Common use cases for custom adapters include:
-   Syncing with a backend API.
-   Using `AsyncStorage` in an Ionic/Capacitor app.
-   Integrating with Firebase or Supabase.
-   Encrypting data before storage.

## StorageAdapter Interface

To create a custom adapter, implement the `StorageAdapter` interface:

```typescript
export interface StorageAdapter {
  /**
   * Whether the adapter operations are asynchronous.
   * If true, the signal will update asynchronously after hydration.
   */
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
```

## Detailed Examples

We have created detailed guides for common custom adapter use cases:

-   [**API Sync Adapter**](/storage-adapters/examples/api-sync): Sync state with a backend API using `HttpClient`.
-   [**Ionic & Capacitor**](/storage-adapters/examples/ionic-storage): Use native mobile storage with `@capacitor/preferences`.
-   [**Firebase Sync**](/storage-adapters/examples/firebase-sync): Real-time synchronization across devices using Firestore.
-   [**Encrypted Storage**](/storage-adapters/examples/encryption): Encrypt data before saving it to LocalStorage.

Check out these guides to see how to implement `StorageAdapter` for your specific needs.

## Best Practices

1.  **Error Handling**: Wrap your storage calls in `try/catch` blocks. If `getItem` fails, return `null` so the signal falls back to its initial value.
2.  **Type Safety**: Avoid `any`. Use proper types for your data structures.
3.  **Async vs Sync**: If your storage mechanism is synchronous (like `localStorage`), set `isAsync = false`. If it involves Promises (like `fetch` or `indexedDB`), set `isAsync = true`.
