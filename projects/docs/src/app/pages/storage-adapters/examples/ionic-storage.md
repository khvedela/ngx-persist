---
title: Ionic & Capacitor Adapter
---

# Ionic & Capacitor Adapter

When building mobile applications with Ionic and Capacitor, you often need to persist data using native storage mechanisms. This example shows how to wrap `@capacitor/preferences` (formerly `Storage`) into a `StorageAdapter`.

## Prerequisites

Install the Capacitor Preferences plugin:

```bash
npm install @capacitor/preferences
npx cap sync
```

## Implementation

The `Preferences` API is asynchronous, so we set `isAsync = true`.

```typescript
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StorageAdapter } from 'ngx-persist';

@Injectable({ providedIn: 'root' })
export class CapacitorAdapter implements StorageAdapter {
  readonly isAsync = true;

  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
```

## Usage

Using it in a component is identical to any other adapter.

```typescript
import { Component, inject } from '@angular/core';
import { storageSignal } from 'ngx-persist';
import { CapacitorAdapter } from './capacitor.adapter';

@Component({
  selector: 'app-mobile-settings',
  standalone: true,
  template: `
    <ion-content>
      <ion-item>
        <ion-label>Notifications</ion-label>
        <ion-toggle 
          [checked]="notifications()" 
          (ionChange)="notifications.set($event.detail.checked)">
        </ion-toggle>
      </ion-item>
    </ion-content>
  `
})
export class MobileSettingsComponent {
  private adapter = inject(CapacitorAdapter);

  notifications = storageSignal({
    key: 'notifications_enabled',
    initial: true,
    adapter: this.adapter
  });
}
```

## Using @ionic/storage (SQLite)

If you need a full SQL-lite backed storage, you can use `@ionic/storage`. The implementation is very similar.

```typescript
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageAdapter } from 'ngx-persist';

@Injectable({ providedIn: 'root' })
export class IonicStorageAdapter implements StorageAdapter {
  readonly isAsync = true;
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async getItem(key: string): Promise<string | null> {
    await this.ensureInit();
    return this._storage?.get(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.ensureInit();
    await this._storage?.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await this.ensureInit();
    await this._storage?.remove(key);
  }
  
  private async ensureInit() {
      if (!this._storage) {
          await this.init();
      }
  }
}
```
