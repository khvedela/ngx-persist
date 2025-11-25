---
title: NGRX SignalStore Integration
---

# NGRX SignalStore Integration

`ngx-persist` provides a seamless integration with [NGRX SignalStore](https://ngrx.io/guide/signals).

## Installation

Ensure you have `@ngrx/signals` installed.

## Usage

Use the `withPersist` feature to automatically hydrate and persist your store's state.

```typescript
import { signalStore, withState } from '@ngrx/signals';
import { withPersist } from 'ngx-persist/integrations';

export const UserStore = signalStore(
  withState({ name: 'Guest', theme: 'light' }),
  // Persist the entire state to 'user-store' key
  withPersist({
    key: 'user-store'
  })
);
```

### Configuration

`withPersist` accepts a configuration object:

```typescript
withPersist({
  key: 'my-store',
  // Optional: Use a specific adapter (defaults to global config)
  adapter: sessionStorageAdapter 
})
```

## How it Works

1.  **Hydration**: On initialization, `withPersist` checks the storage for the given key. If found, it parses the JSON and patches the store state.
2.  **Persistence**: It sets up an `effect` that watches the store state. Whenever the state changes, it serializes it and saves it to storage.

> [!NOTE]
> This feature currently persists the **entire** state slice managed by the store. Partial persistence configuration is coming soon.
