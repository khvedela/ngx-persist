---
title: IndexedDB Adapter
---

# IndexedDB Adapter

The `IndexedDbAdapter` is a built-in asynchronous storage adapter for **IndexedDB**. It is ideal for storing large datasets, files, or complex objects that exceed the quota of LocalStorage.

## Usage

Import `IndexedDbAdapter` from `ngx-persist` and pass it to `storageSignal`.

```typescript
import { Component } from '@angular/core';
import { storageSignal, IndexedDbAdapter } from 'ngx-persist';

@Component({
  selector: 'app-large-data',
  standalone: true,
  template: `
    <div class="data-manager">
      <h2>Large Dataset Manager</h2>
      <p>Storing {{ products().length }} products in IndexedDB</p>
      <button (click)="addProduct()">Add Product</button>
    </div>
  `
})
export class LargeDataComponent {
  // Create an instance of the adapter
  // Optional: Pass dbName and storeName to the constructor
  private adapter = new IndexedDbAdapter('myapp-db', 'products');

  products = storageSignal({
    key: 'product-catalog',
    initial: [] as Product[],
    adapter: this.adapter
  });

  addProduct() {
    this.products.update(current => [...current, { id: Date.now(), name: 'New Product' }]);
  }
}

interface Product {
  id: number;
  name: string;
}
```

## Configuration

The `IndexedDbAdapter` constructor accepts two optional arguments:

1.  `dbName` (default: `'ngx-persist-db'`): The name of the IndexedDB database.
2.  `storeName` (default: `'key-value-store'`): The name of the object store within the database.

```typescript
// Custom configuration
const adapter = new IndexedDbAdapter('my-custom-db', 'user-settings');
```

## Async Hydration

Since IndexedDB is asynchronous, the signal will initially hold the `initial` value. Once the data is retrieved from the database, the signal will update automatically.

> Ensure your UI can handle the initial state gracefully while data is loading.

```typescript
const data = storageSignal({
  key: 'async-data',
  initial: { loaded: false }, // Initial state
  adapter: new IndexedDbAdapter()
});

// ... milliseconds later ...
// Signal updates to: { loaded: true, ...data }
```
