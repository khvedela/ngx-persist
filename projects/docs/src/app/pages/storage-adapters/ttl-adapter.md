---
title: TTL Adapter
---

# TTL Adapter

The `withTTL` function wraps any existing storage adapter to add **Time-To-Live (TTL)** support. Data stored with this wrapper will automatically expire and be removed after a specified duration.

## Use Cases

-   **API Caching**: Cache API responses for a short period (e.g., 5 minutes) to reduce server load.
-   **User Sessions**: Automatically expire user sessions after inactivity (if updated on access) or fixed time.
-   **Temporary Data**: Store data that is only relevant for a short time.

## Usage

Import `withTTL` and your desired adapter (e.g., `localStorageAdapter`) from `ngx-persist`.

```typescript
import { Component } from '@angular/core';
import { storageSignal, withTTL, localStorageAdapter } from 'ngx-persist';

@Component({
  selector: 'app-api-cache',
  standalone: true,
  template: `
    <p>Cached Data: {{ data() }}</p>
    <button (click)="refresh()">Refresh</button>
  `
})
export class ApiCacheComponent {
  // Create an adapter that expires items after 1 hour (3600000 ms)
  private ttlAdapter = withTTL(localStorageAdapter, 1000 * 60 * 60);

  data = storageSignal({
    key: 'api-data',
    initial: null,
    adapter: this.ttlAdapter
  });

  refresh() {
    // Fetch new data...
    this.data.set('New Data ' + new Date().toISOString());
  }
}
```

## How it Works

When you store a value using `withTTL`, it wraps the value in an object containing the data and an expiry timestamp:

```json
{
  "value": "your-data",
  "expiry": 1732635000000
}
```

When you retrieve the data:
1.  It checks the `expiry` timestamp.
2.  If the current time is greater than `expiry`, the item is **removed** from storage and `null` is returned.
3.  If the item is valid, the original `value` is returned.

> [!NOTE]
> If the underlying storage contains data that was not stored with `withTTL` (or has a different format), it will be treated as invalid/expired and removed upon access.
