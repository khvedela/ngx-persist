---
title: LocalStorage Adapter
---

# LocalStorage Adapter

The **localStorage** adapter is the default storage backend for `ngx-persist`. It provides persistent storage that survives browser sessions and page reloads.

## Overview

LocalStorage is ideal for:
- User preferences (theme, language, settings)
- Shopping cart data
- Form drafts
- UI state that should persist across sessions

## Basic Usage

By default, `storageSignal` uses localStorage, so you don't need to explicitly specify it.

```typescript
import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  template: `
    <div class="preferences">
      <h2>User Preferences</h2>
      
      <label>
        Theme:
        <select [value]="preferences().theme" (change)="updateTheme($event)">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>

      <label>
        <input 
          type="checkbox" 
          [checked]="preferences().notifications" 
          (change)="toggleNotifications()"
        />
        Enable Notifications
      </label>
    </div>
  `
})
export class UserPreferencesComponent {
  preferences = storageSignal({
    key: 'user-preferences',
    initial: {
      theme: 'light' as 'light' | 'dark' | 'auto',
      notifications: true,
      language: 'en'
    }
  });

  updateTheme(event: Event) {
    const theme = (event.target as HTMLSelectElement).value as 'light' | 'dark' | 'auto';
    this.preferences.update(p => ({ ...p, theme }));
  }

  toggleNotifications() {
    this.preferences.update(p => ({ ...p, notifications: !p.notifications }));
  }
}
```

## Explicit Configuration

You can explicitly specify the localStorage adapter:

```typescript
const settings = storageSignal({
  key: 'app-settings',
  initial: { darkMode: false },
  adapter: 'local' // Explicitly use localStorage
});
```

## Storage Limits

LocalStorage has a size limit of approximately **5-10 MB** (varies by browser). Keep this in mind when storing data:

```typescript
// ✅ Good: Small, structured data
const userSettings = storageSignal({
  key: 'settings',
  initial: { theme: 'light', fontSize: 14 }
});

// ❌ Bad: Large datasets
const allProducts = storageSignal({
  key: 'products',  
  initial: [] as Product[] // Could exceed localStorage limits
});
```

## Best Practices

### 1. Use Descriptive Keys

```typescript
// ✅ Good
const cartItems = storageSignal({ key: 'shopping-cart-items', initial: [] });

// ❌ Bad
const items = storageSignal({ key: 'items', initial: [] });
```

### 2. Provide Sensible Defaults

```typescript
const userPrefs = storageSignal({
  key: 'user-prefs',
  initial: {
    theme: 'light',
    language: navigator.language || 'en',
    compactMode: false
  }
});
```

### 3. Keep State Flat

```typescript
// ✅ Good: Flat structure
interface AppState {
  userId: string;
  lastVisit: string;
  preferences: Record<string, boolean>;
}

// ⚠️ Avoid: Deeply nested structures
interface ComplexState {
  user: {
    profile: {
      settings: {
        display: {
          theme: { ... }
        }
      }
    }
  }
}
```

## Clearing Data

You can clear stored data using the `clear()` method:

```typescript
const prefs = storageSignal({
  key: 'preferences',
  initial: { theme: 'light' }
});

// Reset to initial value and remove from localStorage
prefs.clear();
```

## Browser Compatibility

LocalStorage is supported in all modern browsers:
- ✅ Chrome, Edge, Firefox, Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Private/Incognito mode may have restrictions
- ❌ Not available in Web Workers

## Next Steps

- Learn about [SessionStorage](/session-storage) for temporary data
- Implement [Custom Adapters](/custom-adapters) for advanced use cases
