import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { withInMemoryScrolling, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AgConfig } from '@ag/vc.ag-ui/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AgUiModule } from '@ag/vc.ag-ui';

const NX_CONFIG: AgConfig = {
  allowedLanguages: ['nl', 'fr'],
  defaultLanguage: 'fr',
  // TODO complete
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withInMemoryScrolling({
    scrollPositionRestoration: 'enabled'
  })), provideAnimations(), importProvidersFrom(AgUiModule.forRoot(NX_CONFIG))]
};
