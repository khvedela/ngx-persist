import { NgxPersistConfig } from '../angular/ngx-persist.config';

export function buildKey(config: NgxPersistConfig, rawKey: string): string {
  if (!config.prefix) return rawKey;
  return `${config.prefix}:${rawKey}`;
}
