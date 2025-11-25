---
title: API Sync Adapter
---

# API Sync Adapter

This example demonstrates how to create a `StorageAdapter` that synchronizes state with a backend API using Angular's `HttpClient`. This allows your application state to persist across devices and sessions.

## Implementation

We'll create an `ApiAdapter` service that implements `StorageAdapter`. Since API calls are asynchronous, we set `isAsync = true`.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageAdapter } from 'ngx-persist';

@Injectable({ providedIn: 'root' })
export class ApiAdapter implements StorageAdapter {
  readonly isAsync = true;
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com/user-settings';

  async getItem(key: string): Promise<string | null> {
    try {
      // Fetch the value from the API
      const response = await firstValueFrom(
        this.http.get<{ value: string }>(`${this.apiUrl}/${key}`)
      );
      return response.value;
    } catch (error) {
      // If the key doesn't exist or the API fails, return null
      // so the signal falls back to the initial value.
      console.warn(`Failed to fetch key ${key}`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put(`${this.apiUrl}/${key}`, { value })
      );
    } catch (error) {
      console.error(`Failed to save key ${key}`, error);
      // You might want to implement a retry strategy or offline queue here
    }
  }

  async removeItem(key: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${key}`)
    );
  }
}
```

## Usage with storageSignal

Inject the `ApiAdapter` and pass it to the `storageSignal` configuration.

```typescript
import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { storageSignal } from 'ngx-persist';
import { ApiAdapter } from './api.adapter';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <h2>User Profile</h2>
    
    @if (theme.isLoading()) {
        <p>Loading preferences...</p>
    } @else {
        <p>Current Theme: {{ theme() }}</p>
        
        <button (click)="toggleTheme()">Toggle Theme</button>
    }
  `
})
export class UserProfileComponent {
  private apiAdapter = inject(ApiAdapter);

  // The signal will automatically fetch the initial value from the API
  // and update the API whenever the signal value changes.
  theme = storageSignal({
    key: 'theme',
    initial: 'light',
    adapter: this.apiAdapter
  });

  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
}
```

## Advanced: Real-time Updates

If your API supports WebSockets or Server-Sent Events, you can implement the `subscribe` method to update the signal when the data changes on the server (e.g., from another device).

```typescript
  // In ApiAdapter
  
  subscribe(listener: (key: string | null) => void): () => void {
    const socket = new WebSocket('wss://api.example.com/updates');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Assuming the server sends { key: 'theme', value: 'dark' }
      if (data.key) {
        listener(data.key);
      }
    };

    return () => socket.close();
  }
```
