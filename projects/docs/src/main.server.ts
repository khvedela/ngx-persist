import '@angular/platform-server/init';
import { render } from '@analogjs/router/server';

import { App } from './app/pages/app';
import { config } from './app/app.config.server';

export default render(App, config);
