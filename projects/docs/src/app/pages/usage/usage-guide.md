---
title: Basic Usage
---

# Basic Usage

This guide covers the fundamentals of using `storageSignal` to manage persistent state in your Angular application.

## Creating a Storage Signal

The `storageSignal` function creates a writable signal that automatically syncs its value with storage (LocalStorage by default).

```typescript
import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">Increment</button>
  `
})
export class CounterComponent {
  // 1. Define a unique key
  // 2. Provide an initial value
  count = storageSignal({
    key: 'counter',
    initial: 0
  });

  increment() {
    // 3. Update like a regular signal
    this.count.update(c => c + 1);
  }
}
```

## Reading the Value

Read the value just like any other Angular Signal: by calling it as a function.

```typescript
const currentValue = this.count();
```

In a template:

```html
<p>Current count: {{ count() }}</p>
```

## Updating the Value

You can set a new value directly or update it based on the previous value.

### Set

```typescript
this.count.set(100);
```

### Update

```typescript
this.count.update(current => current + 1);
```

## Clearing Storage

To reset the signal to its initial value and remove the item from storage, use the `clear()` method.

```typescript
this.count.clear();
// count() is now 0 (initial value)
// localStorage.getItem('counter') is null
```
