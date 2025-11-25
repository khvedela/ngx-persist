---
title: Firebase Sync Adapter
---

# Firebase Sync Adapter

This example demonstrates how to use Google Firebase (Firestore) as a storage backend. This enables real-time synchronization across all user devices.

## Implementation

We will use `@angular/fire` to interact with Firestore. We'll implement the `subscribe` method to listen for real-time changes from the database.

```typescript
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, deleteDoc, onSnapshot, collection } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { StorageAdapter } from 'ngx-persist';

@Injectable({ providedIn: 'root' })
export class FirestoreAdapter implements StorageAdapter {
  readonly isAsync = true;
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getDocRef(key: string) {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User must be logged in to save settings');
    
    // Store settings in a sub-collection of the user document
    return doc(this.firestore, `users/${userId}/settings/${key}`);
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const snap = await getDoc(this.getDocRef(key));
      return snap.exists() ? (snap.data()['value'] as string) : null;
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    await setDoc(this.getDocRef(key), { value });
  }

  async removeItem(key: string): Promise<void> {
    await deleteDoc(this.getDocRef(key));
  }

  /**
   * Listen for real-time changes from Firestore.
   * When another device updates the setting, this callback fires,
   * and the signal automatically updates.
   */
  subscribe(listener: (key: string | null) => void): () => void {
    // Note: In a real app, you might want to manage subscriptions more granularly
    // or listen to the entire 'settings' collection instead of individual documents.
    // This is a simplified example.
    
    // For this example, we aren't subscribing to a single key here because
    // the interface expects a generic listener.
    // A robust implementation might listen to the collection:
    
    const userId = this.auth.currentUser?.uid;
    if (!userId) return () => {};

    const collectionRef = collection(this.firestore, `users/${userId}/settings`);
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
           // We notify that a key has changed. 
           // The library will then re-fetch the value (calling getItem).
           // Optimization: You could potentially cache the value here to avoid the extra fetch,
           // but the standard flow is to notify -> re-fetch.
           listener(change.doc.id);
        }
      });
    });

    return unsubscribe;
  }
}
```

## Usage

```typescript
import { Component, inject, effect } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { storageSignal } from 'ngx-persist';
import { FirestoreAdapter } from './firestore.adapter';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    @if (user$ | async) {
      <h1>Welcome, {{ (user$ | async)?.displayName }}</h1>
      
      <label>
        Dashboard Layout:
        <select [value]="layout()" (change)="layout.set($any($event.target).value)">
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </label>
    } @else {
      <p>Please log in to sync settings.</p>
    }
  `
})
export class DashboardComponent {
  private auth = inject(Auth);
  private firestoreAdapter = inject(FirestoreAdapter);
  
  user$ = user(this.auth);

  // This signal will sync in real-time!
  layout = storageSignal({
    key: 'dashboard_layout',
    initial: 'grid',
    adapter: this.firestoreAdapter
  });
}
```
