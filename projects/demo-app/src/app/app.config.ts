import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgxPersist } from 'ngx-persist';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideNgxPersist({ prefix: 'demo' })
  ]
};
