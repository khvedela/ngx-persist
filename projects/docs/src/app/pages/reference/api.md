---
title: API Reference
---

# API Reference

## `storageSignal<T>(options)`

Creates a writable signal that persists its value.

**Options:**

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | **Required** | The unique key for storage. |
| `initial` | `T` | **Required** | The initial value if storage is empty. |
| `adapter` | `'local' \| 'session' \| StorageAdapter` | `'local'` | The storage backend to use. |
| `serialize` | `(value: T) => string` | `JSON.stringify` | Function to serialize state to string. |
| `parse` | `(raw: string) => T` | `JSON.parse` | Function to parse string back to state. |

**Return Value (`StorageSignal<T>`):**

The returned signal has the standard Signal API plus:

*   `set(value: T)`: Updates the value and writes to storage.
*   `update(fn: (value: T) => T)`: Updates based on current value and writes to storage.
*   `clear()`: Resets to the initial value and removes the item from storage.
*   `key`: The fully qualified key used (including prefix).

## `provideNgxPersist(config)`

Configures the library globally.

**Config:**

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `prefix` | `string` | `''` | Optional string to prefix all keys (e.g., `app:`). |

## `StorageAdapter` Interface

Interface for implementing custom storage adapters.

```typescript
export interface StorageAdapter {
  readonly isAsync: boolean;

  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;
}
```
