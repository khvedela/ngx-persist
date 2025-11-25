import { StorageAdapter } from './storage-adapter';

export function withBroadcastChannel(adapter: StorageAdapter, channelName: string = 'ngx-persist-sync'): StorageAdapter {
    if (typeof BroadcastChannel === 'undefined') {
        return adapter;
    }

    const channel = new BroadcastChannel(channelName);

    // We need to keep track of listeners to notify them when a message arrives
    const listeners = new Set<(key: string | null) => void>();

    channel.onmessage = (event) => {
        const { key } = event.data;
        listeners.forEach(listener => listener(key));
    };

    // Wrap the adapter
    return {
        ...adapter,
        setItem(key: string, value: string) {
            const result = adapter.setItem(key, value);
            // Notify other tabs
            channel.postMessage({ key });
            return result;
        },
        removeItem(key: string) {
            const result = adapter.removeItem(key);
            channel.postMessage({ key });
            return result;
        },
        clear() {
            const result = adapter.clear?.();
            channel.postMessage({ key: null }); // null means clear all
            return result;
        },
        subscribe(listener: (key: string | null) => void) {
            // Add to our local listeners
            listeners.add(listener);

            // If the underlying adapter also has subscribe, we should subscribe to it too
            // (e.g. if it's a custom adapter that syncs with backend)
            const underlyingUnsub = adapter.subscribe?.(listener);

            return () => {
                listeners.delete(listener);
                underlyingUnsub?.();
            };
        }
    };
}
