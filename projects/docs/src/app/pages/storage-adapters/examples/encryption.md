---
title: Encrypted Storage
---

# Encrypted Storage

Sometimes you need to store sensitive data on the client. You can create a "Decorator" adapter that encrypts data before passing it to the underlying storage (like LocalStorage) and decrypts it when retrieving.

## Implementation

This adapter wraps another `StorageAdapter`.

```typescript
import { Injectable, inject } from '@angular/core';
import { StorageAdapter } from 'ngx-persist';
import { LocalStorageAdapter } from 'ngx-persist/adapters'; // Assuming this is available or use window.localStorage

// Mock encryption functions (Replace with a real library like crypto-js)
const encrypt = (text: string) => btoa(text).split('').reverse().join('');
const decrypt = (text: string) => atob(text.split('').reverse().join(''));

@Injectable({ providedIn: 'root' })
export class EncryptedAdapter implements StorageAdapter {
  // We mirror the async nature of the underlying adapter
  readonly isAsync = false; 
  
  // We can wrap any adapter here. For this example, we use LocalStorage.
  // In a real app, you might inject the underlying adapter via a token.
  private underlyingAdapter = window.localStorage;

  getItem(key: string): string | null {
    const encryptedValue = this.underlyingAdapter.getItem(key);
    if (!encryptedValue) return null;
    
    try {
      return decrypt(encryptedValue);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    const encryptedValue = encrypt(value);
    this.underlyingAdapter.setItem(key, encryptedValue);
  }

  removeItem(key: string): void {
    this.underlyingAdapter.removeItem(key);
  }

  clear(): void {
    this.underlyingAdapter.clear();
  }
}
```

## Usage

```typescript
import { Component, inject } from '@angular/core';
import { storageSignal } from 'ngx-persist';
import { EncryptedAdapter } from './encrypted.adapter';

@Component({
  selector: 'app-secret-notes',
  standalone: true,
  template: `
    <textarea 
      [value]="secret()" 
      (input)="secret.set($any($event.target).value)"
      placeholder="Type your secrets here...">
    </textarea>
    
    <p>Check your LocalStorage! The value is scrambled.</p>
  `
})
export class SecretNotesComponent {
  private encryptedAdapter = inject(EncryptedAdapter);

  secret = storageSignal({
    key: 'my_secret_note',
    initial: '',
    adapter: this.encryptedAdapter
  });
}
```

## Decorator Pattern with Dependency Injection

To make this truly reusable for *any* adapter (e.g., Encrypted IndexedDB), you can use Angular's DI system.

```typescript
import { InjectionToken, Injectable, Inject } from '@angular/core';
import { StorageAdapter } from 'ngx-persist';

export const UNDERLYING_ADAPTER = new InjectionToken<StorageAdapter>('UNDERLYING_ADAPTER');

@Injectable()
export class GenericEncryptedAdapter implements StorageAdapter {
  constructor(@Inject(UNDERLYING_ADAPTER) private adapter: StorageAdapter) {}

  get isAsync() { return this.adapter.isAsync; }

  getItem(key: string) {
    const result = this.adapter.getItem(key);
    // Handle both sync and async results...
    // (Implementation omitted for brevity, but involves checking if result is Promise)
    return result; 
  }
  
  // ... implement other methods
}
```
