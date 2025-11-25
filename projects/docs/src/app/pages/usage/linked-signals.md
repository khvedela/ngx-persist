---
title: Linked Signals
---

# Linked Signals

Angular 19 introduced `linkedSignal`, a powerful primitive for state that depends on another signal (the "source") but can be overridden by the user. When the source changes, the signal resets to a computed value.

`ngx-persist` extends this pattern with `storageLinkedSignal`, which adds persistence to the mix.

## The Problem

Imagine a "User Settings" form.
1.  When you select User A, the form should load User A's settings.
2.  You edit the settings (local state).
3.  If you refresh the page, your edits should persist (persistence).
4.  If you switch to User B, the form should reset to User B's settings (linked state).

Standard `storageSignal` persists forever. Standard `linkedSignal` doesn't persist. `storageLinkedSignal` does both.

## Usage

```typescript
import { Component, input } from '@angular/core';
import { storageLinkedSignal } from 'ngx-persist';

@Component({ ... })
export class UserSettingsComponent {
  // Source signal (e.g. from router or parent)
  userId = input.required<string>();

  // The linked signal
  settings = storageLinkedSignal({
    // 1. The key must be unique per user if you want separate storage
    key: (id) => `user_settings_${id}`,
    
    // 2. The source signal to watch
    source: this.userId,
    
    // 3. The computation to run when source changes (or for initial value)
    computation: (id) => createDefaultSettings(id)
  });
}
```

## How It Works

1.  **Initialization**:
    -   It checks storage for the generated key.
    -   If found, it uses the stored value.
    -   If not found, it runs the `computation` function.

2.  **Source Change**:
    -   When `userId` changes, the signal **resets**.
    -   It re-generates the key (e.g. `user_settings_123` -> `user_settings_456`).
    -   It checks storage for the *new* key.
    -   If found, it loads it. If not, it computes the default.

3.  **User Edit**:
    -   When you call `settings.set(...)`, it updates the signal AND saves to storage under the *current* key.

## Advanced: Static Keys

Sometimes you want the key to be static, but the *value* to reset when a dependency changes.

```typescript
// Example: A "Draft" that resets when you change the category
category = signal('tech');

draft = storageLinkedSignal({
  key: 'current_draft', // Static key!
  source: this.category,
  computation: (cat) => `Start writing about ${cat}...`
});
```

In this case:
1.  You write "Angular is cool" (Saved to `current_draft`).
2.  Change category to 'life'.
3.  Signal resets to "Start writing about life..." (Saved to `current_draft`, overwriting previous draft).

This is useful for "temporary" persistence that should be cleared on context switch.
