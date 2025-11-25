---
title: NgxPersist Documentation
---

# NgxPersist

Type-safe, signal-based persistent state primitive for Angular (17–21).

## Install

```bash
npm install ngx-persist
```

## Setup

```ts
// app.config.ts
import { provideNgxPersist } from 'ngx-persist';

export const appConfig: ApplicationConfig = {
  providers: [provideNgxPersist({ prefix: 'myapp' })],
};
```

## Usage

```ts
import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';

interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <p>Current theme: {{ settings().theme }}</p>
    <button (click)="toggleTheme()">Toggle Theme</button>
  `
})
export class AppComponent {
  // Persists to localStorage with key "myapp:settings"
  settings = storageSignal<UserSettings>({
    key: 'settings',
    initial: { theme: 'light', notifications: true }
  });

  toggleTheme() {
    this.settings.update(s => ({
      ...s,
      theme: s.theme === 'light' ? 'dark' : 'light'
    }));
  }
}
```

## Live Demo

<app-demo-counter></app-demo-counter>

## API

### `storageSignal<T>(options)`
Creates a signal that syncs with storage.

### `StorageSignal<T>` methods
*   `()`: Read value.
*   `set(value)`: Update value and storage.
*   `update(fn)`: Update value based on current.
*   `clear()`: Reset to initial and remove from storage.
*   `key`: The actual namespaced key used.

### `provideNgxPersist(config)`
Configures the library globally.
*   `config.prefix`: Optional string to prefix all keys (e.g., `app:key`).

### `StorageSignalOptions<T>`
*   `key`: Unique key for storage.
*   `initial`: Default value.
*   `adapter`: 'local' (default), 'session', or custom adapter.
*   `serialize`: Custom serializer (default: `JSON.stringify`).
*   `parse`: Custom parser (default: `JSON.parse`).
