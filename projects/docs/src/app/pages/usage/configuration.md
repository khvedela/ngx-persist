---
title: Configuration
---

# Configuration

You can configure `ngx-persist` globally for your application using the `provideNgxPersist` function.

## Global Configuration

Add `provideNgxPersist` to your application's provider list (usually in `app.config.ts`).

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxPersist } from 'ngx-persist';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxPersist({
      prefix: 'myapp' // Optional prefix for all keys
    })
  ],
};
```

### Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `prefix` | `string` | `undefined` | **Deprecated** (Use `namespace`). A string to prefix all storage keys. |
| `namespace` | `string` | `undefined` | A global namespace for your application keys (e.g., `'my-app'`). This prevents key collisions when running multiple apps on the same domain (like localhost). |

## Cross-Tab Synchronization

By default, `ngx-persist` automatically enables **Cross-Tab Synchronization** for `LocalStorage` and `SessionStorage`.

If a user changes a setting in one tab, it will instantly update in all other open tabs using the `BroadcastChannel` API. No extra configuration is required!

## Key Prefixing

If you set a `prefix` of `'myapp'`, a signal with key `'settings'` will be stored in LocalStorage as `'myapp:settings'`.

```typescript
// app.config.ts
provideNgxPersist({ prefix: 'shop' })

// component.ts
const cart = storageSignal({ key: 'cart', ... });

// Storage: 'shop:cart'
```
