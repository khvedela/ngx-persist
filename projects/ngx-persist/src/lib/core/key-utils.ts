import { NgxPersistConfig } from '../angular/ngx-persist.config';

export function buildKey(config: NgxPersistConfig, rawKey: string): string {
  const prefix = config.namespace ?? config.prefix;
  if (!prefix) return rawKey;
  return `${prefix}:${rawKey}`;
}
