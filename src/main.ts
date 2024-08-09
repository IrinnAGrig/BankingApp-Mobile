import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

isDark();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  
function isDark(): boolean {
  const currentHour = new Date().getHours();

  return currentHour < 6 || currentHour >= 13;
}


