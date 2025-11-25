---
title: In-Memory Adapter
---

# In-Memory Adapter

The `MemoryAdapter` is a synchronous adapter that stores data in a JavaScript `Map`. Data stored in this adapter **does not persist** across page reloads.

## Use Cases

-   **Testing**: Use it in unit tests to avoid polluting LocalStorage.
-   **Server-Side Rendering (SSR)**: Used automatically as a fallback when `window` is undefined.
-   **Temporary State**: For state that should be global but cleared on refresh.

## Usage

Import `MemoryAdapter` from `ngx-persist`.

```typescript
import { Component } from '@angular/core';
import { storageSignal, MemoryAdapter } from 'ngx-persist';

@Component({
  selector: 'app-temp-state',
  standalone: true,
  template: `
    <p>Session ID: {{ sessionId() }}</p>
    <p><em>(This will reset on refresh)</em></p>
  `
})
export class TempStateComponent {
  // Create a shared adapter instance if you want to share storage across signals
  private adapter = new MemoryAdapter();

  sessionId = storageSignal({
    key: 'session-id',
    initial: crypto.randomUUID(),
    adapter: this.adapter
  });
}
```

## SSR Fallback

`ngx-persist` automatically uses `MemoryAdapter` when running on the server (SSR). You don't need to configure this manually; it's handled by the `resolveAdapter` function internally.

However, if you want to explicitly force in-memory storage even in the browser, you can pass it explicitly as shown above.
