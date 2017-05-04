import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import { CustomerService } from '../services/customer.service'

platformBrowserDynamic().bootstrapModule(AppModule, [ CustomerService ]);
