---
title: SessionStorage Adapter
---

# SessionStorage Adapter

The **sessionStorage** adapter provides temporary storage that lasts only for the current browser session. Data is cleared when the tab or browser is closed.

## Overview

SessionStorage is ideal for:
- Temporary form data
- Current session state
- Shopping session data
- Wizard/multi-step form progress
- Data that shouldn't persist between visits

## Basic Usage

To use sessionStorage, specify the `adapter` option:

```typescript
import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `
    <div class="checkout-wizard">
      <h2>Checkout - Step {{ checkoutState().currentStep }}</h2>
      
      <div *ngIf="checkoutState().currentStep === 1">
        <h3>Shipping Information</h3>
        <!-- Step 1 form -->
      </div>
      
      <div *ngIf="checkoutState().currentStep === 2">
        <h3>Payment</h3>
        <!-- Step 2 form -->
      </div>
    </div>
  `
})
export class CheckoutComponent {
  checkoutState = storageSignal({
    key: 'checkout-progress',
    initial: {
      currentStep: 1,
      shippingInfo: null,
      paymentInfo: null
    },
    adapter: 'session' // Use sessionStorage
  });

  nextStep() {
    this.checkoutState.update(state => ({
      ...state,
      currentStep: state.currentStep + 1
    }));
  }
}
```

## Use Cases

### 1. Multi-Step Forms

Perfect for saving progress in multi-step forms:

```typescript
const formProgress = storageSignal({
  key: 'form-wizard',
  initial: {
    step: 1,
    data: {
      personalInfo: {},
      addressInfo: {},
      paymentInfo: {}
    }
  },
  adapter: 'session'
});
```

### 2. Temporary Filters

Store temporary search/filter state:

```typescript
const searchFilters = storageSignal({
  key: 'product-filters',
  initial: {
    category: null,
    priceRange: [0, 1000],
    sortBy: 'relevance'
  },
  adapter: 'session'
});
```

### 3. Active Tab State

Track which tab is active in a session:

```typescript
const activeTab = storageSignal({
  key: 'active-tab',
  initial: 'overview',
  adapter: 'session'
});
```

## SessionStorage vs LocalStorage

| Feature | SessionStorage | LocalStorage |
| :--- | :--- | :--- |
| **Persistence** | Until tab/browser closes | Indefinite |
| **Scope** | Per tab/window | Shared across tabs |
| **Use Case** | Temporary session data | Long-term preferences |
| **Size Limit** | ~5-10 MB | ~5-10 MB |
| **Privacy** | Auto-cleared on exit | Manual clearing needed |

## Example: Session-Specific Cart

Here's an example of a shopping cart that's specific to the current session:

```typescript
import { Component, signal } from '@angular/core';
import { storageSignal } from 'ngx-persist';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div class="cart">
      <h2>Shopping Cart (Session)</h2>
      <p>Items will be cleared when you close this tab</p>
      
      <ul>
        <li *ngFor="let item of cart()">
          {{ item.name }} - {{ item.quantity }}x ${{ item.price }}
          <button (click)="removeItem(item.id)">Remove</button>
        </li>
      </ul>
      
      <p>Total: ${{ total() }}</p>
    </div>
  `
})
export class ShoppingCartComponent {
  cart = storageSignal<CartItem[]>({
    key: 'session-cart',
    initial: [],
    adapter: 'session'
  });

  total = signal(0);

  addItem(item: CartItem) {
    this.cart.update(items => [...items, item]);
    this.updateTotal();
  }

  removeItem(id: string) {
    this.cart.update(items => items.filter(i => i.id !== id));
    this.updateTotal();
  }

  updateTotal() {
    const sum = this.cart().reduce((acc, item) => 
      acc + (item.price * item.quantity), 0
    );
    this.total.set(sum);
  }
}
```

## Clearing Session Data

Session data is automatically cleared when the browser tab closes, but you can also manually clear it:

```typescript
const sessionData = storageSignal({
  key: 'temp-data',
  initial: {},
  adapter: 'session'
});

// Manually clear
sessionData.clear();
```

## Browser Compatibility

SessionStorage is supported in all modern browsers:
- ✅ Chrome, Edge, Firefox, Safari
- ✅ Mobile browsers
- ✅ Works in Private/Incognito mode (but cleared on exit)
- ❌ Not available in Web Workers

## Best Practices

1. **Use for temporary data only** - Don't rely on sessionStorage for critical data
2. **Provide fallbacks** - Always have a default initial value
3. **Clear on logout** - Explicitly clear sensitive session data when users log out

```typescript
// Clear all session data on logout
function logout() {
  sessionData.clear();
  userSession.clear();
  // ... other cleanup
}
```

## Next Steps

- Compare with [LocalStorage](/local-storage) for persistent data
- Learn about [Custom Adapters](/custom-adapters) for advanced storage
