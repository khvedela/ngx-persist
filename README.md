<p align="center">
  <img src="https://raw.githubusercontent.com/khvedela/ngx-persist/main/projects/docs/public/logo.png" alt="ngx-persist logo" width="120">
</p>

# NgxPersist

[**📚 Read the Documentation**](https://khvedela.github.io/ngx-persist/)

**NgxPersist** is a type-safe, signal-based persistent state primitive for Angular 19+.

It syncs your state with `localStorage`, `sessionStorage`, `IndexedDB`, or any custom backend, providing a seamless developer experience.

## Features

- 🚀 **Signal-based**: Built for Angular Signals.
- 🔄 **Cross-Tab Sync**: Automatically syncs state across tabs using `BroadcastChannel`.
- 📦 **Pluggable Adapters**: `localStorage`, `sessionStorage`, `memory`, and custom adapters.
- 🔗 **Linked Signals**: Persist state that depends on other signals.
- 🌐 **Resource API**: Offline-first data fetching with `persistResource`.
- 🏪 **NGRX Integration**: Seamless `SignalStore` persistence.

## Installation

```bash
npm install ngx-persist
```

## Usage

### 1. Global Configuration

Add `provideNgxPersist` to your `app.config.ts`.

```typescript
import { provideNgxPersist } from 'ngx-persist';

export const appConfig = {
  providers: [
    provideNgxPersist({ 
      namespace: 'my-app' // Prefixes all keys to avoid collisions
    })
  ]
};
```

### 2. Basic Persistence (`storageSignal`)

Create a signal that automatically saves to `localStorage`.

```typescript
import { storageSignal } from 'ngx-persist';

@Component({ ... })
export class SettingsComponent {
  // Stored as 'my-app:theme'
  theme = storageSignal({
    key: 'theme',
    initial: 'light'
  });

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
```

### 3. Async & Custom Adapters

Use `IndexedDB` or other async storage. The `loaded` signal tells you when data is ready.

```typescript
const largeData = storageSignal({
  key: 'large-dataset',
  initial: [],
  adapter: indexedDbAdapter // or any custom StorageAdapter
});

// Check if hydrated
if (largeData.loaded()) {
  console.log(largeData());
}
```

### 4. Linked Signals (`storageLinkedSignal`)

Persist state that resets when a dependency changes (e.g., form drafts per user).

```typescript
const userId = input.required<string>();

const draft = storageLinkedSignal({
  key: (id) => `draft_${id}`, // Unique key per user
  source: userId,
  computation: () => '' // Reset value when user changes
});
```

### 5. Resource API (`persistResource`)

Add offline-first caching to Angular's `resource` API.

```typescript
const userResource = resource({
  loader: persistResource(fetchUser, {
    key: (params) => `user_${params.id}`,
    adapter: localStorageAdapter
  })
});
```

### 6. NGRX SignalStore (`withPersist`)

Persist your SignalStore state with a single line.

```typescript
export const UserStore = signalStore(
  withState({ name: 'Guest' }),
  withPersist({ key: 'user-store' })
);
```

## License

MIT
