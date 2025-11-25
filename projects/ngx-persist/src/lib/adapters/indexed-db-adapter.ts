import { StorageAdapter } from '../core/storage-adapter';

/**
 * An asynchronous adapter for IndexedDB.
 * Best for large datasets or when LocalStorage quota is insufficient.
 */
export class IndexedDbAdapter implements StorageAdapter {
    readonly isAsync = true;
    private dbPromise: Promise<IDBDatabase>;

    constructor(
        private dbName: string = 'ngx-persist-db',
        private storeName: string = 'key-value-store'
    ) {
        this.dbPromise = this.initDB();
    }

    private initDB(): Promise<IDBDatabase> {
        if (typeof indexedDB === 'undefined') {
            return Promise.reject(new Error('IndexedDB is not available in this environment'));
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    async getItem(key: string): Promise<string | null> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    }

    async setItem(key: string, value: string): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async removeItem(key: string): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear(): Promise<void> {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
