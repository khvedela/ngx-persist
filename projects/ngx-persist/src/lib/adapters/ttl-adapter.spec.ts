import { withTTL } from './ttl-adapter';
import { MemoryAdapter } from './memory-adapter';

describe('withTTL', () => {
    let memory: MemoryAdapter;
    let adapter: ReturnType<typeof withTTL>;

    beforeEach(() => {
        memory = new MemoryAdapter();
        adapter = withTTL(memory, 1000); // 1 second TTL
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should store value with expiry', () => {
        adapter.setItem('key', 'value');
        const stored = memory.getItem('key');
        expect(stored).toBeTruthy();
        const data = JSON.parse(stored!);
        expect(data.value).toBe('value');
        expect(data.expiry).toEqual(expect.any(Number));
    });

    it('should return value if not expired', () => {
        adapter.setItem('key', 'value');
        expect(adapter.getItem('key')).toBe('value');
    });

    it('should return null and remove item if expired', () => {
        adapter.setItem('key', 'value');

        // Advance time by 1001ms
        jest.advanceTimersByTime(1001);

        expect(adapter.getItem('key')).toBeNull();
        expect(memory.getItem('key')).toBeNull();
    });

    it('should remove item', () => {
        adapter.setItem('key', 'value');
        adapter.removeItem('key');
        expect(memory.getItem('key')).toBeNull();
    });

    it('should clear all items', () => {
        adapter.setItem('key1', 'value1');
        adapter.setItem('key2', 'value2');
        adapter.clear!();
        expect(memory.getItem('key1')).toBeNull();
        expect(memory.getItem('key2')).toBeNull();
    });

    it('should handle async adapter', async () => {
        const asyncMemory = {
            isAsync: true,
            getItem: jest.fn().mockResolvedValue(null),
            setItem: jest.fn().mockResolvedValue(undefined),
            removeItem: jest.fn().mockResolvedValue(undefined),
            clear: jest.fn().mockResolvedValue(undefined),
        };
        const asyncAdapter = withTTL(asyncMemory, 1000);

        await asyncAdapter.setItem('key', 'value');
        expect(asyncMemory.setItem).toHaveBeenCalled();

        // Mock return value for getItem
        const expiry = Date.now() + 2000;
        asyncMemory.getItem.mockResolvedValue(
            JSON.stringify({ value: 'value', expiry })
        );
        await expect(asyncAdapter.getItem('key')).resolves.toBe('value');
    });
});
