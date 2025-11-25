---
title: Advanced Usage
---

# Advanced Usage

Learn how to handle complex data types, optimize performance, and follow best practices.

## Custom Serialization

By default, `ngx-persist` uses `JSON.stringify` and `JSON.parse`. If you need to store types that JSON doesn't support natively (like `Date`, `Map`, or `Set`), you can provide custom serializers.

### Example: Storing Dates

```typescript
const lastLogin = storageSignal<Date>({
  key: 'last-login',
  initial: new Date(),
  // Convert Date to ISO string for storage
  serialize: (date) => date.toISOString(),
  // Convert ISO string back to Date object
  parse: (isoString) => new Date(isoString)
});
```

### Example: Storing Maps

```typescript
const settings = storageSignal<Map<string, string>>({
  key: 'app-settings',
  initial: new Map(),
  serialize: (map) => JSON.stringify(Array.from(map.entries())),
  parse: (json) => new Map(JSON.parse(json))
});
```

## Async Handling

When using asynchronous adapters (like IndexedDB or API), the signal might not have the stored value immediately upon creation.

### The `loaded` Signal

`storageSignal` exposes a `loaded` property which is a signal indicating if the data has been hydrated from storage.

```typescript
const theme = storageSignal({ key: 'theme', adapter: indexedDbAdapter });

// In your template
@if (theme.loaded()) {
  <p>Current theme: {{ theme() }}</p>
} @else {
  <p>Loading...</p>
}
```

## Linked Signals

Angular 19 introduces `linkedSignal` for state that depends on another signal but can be overridden. `ngx-persist` supports this pattern with `storageLinkedSignal`.

[**Read the full guide on Linked Signals**](/usage/linked-signals)

## Resource API Integration

For offline-first data fetching, you can use `persistResource` to wrap an Angular `ResourceLoader`.

[**Read the full guide on Resource API**](/usage/resource-api)

## Best Practices

### 1. Key Naming
Use consistent, descriptive keys. If you haven't set a global prefix, consider namespacing your keys manually (e.g., `'user:profile'`, `'ui:theme'`).

### 2. State Size
LocalStorage is synchronous and limited to ~5MB.
-   **Avoid** storing large blobs, images, or huge lists.
-   **Use** [IndexedDB](/indexeddb) for larger datasets.

### 3. Server-Side Rendering (SSR)
`ngx-persist` is fully compatible with Angular SSR.
-   **Server**: The signal uses the `initial` value. No storage access happens.
-   **Client**: The signal hydrates from the configured storage adapter.

### 4. Security
**Never store sensitive information** (passwords, auth tokens, PII) in LocalStorage or SessionStorage, as they are accessible by any JavaScript running on the page (including XSS attacks).
