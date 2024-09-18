import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideSupabase } from './custom-providers';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    // change detection
    provideExperimentalZonelessChangeDetection(),

    // router
    provideRouter(routes),

    // supabase
    provideSupabase({
      projectUrl: 'https://neeuzrahpbkzujacszfp.supabase.co/',
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZXV6cmFocGJrenVqYWNzemZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2MjE5ODEsImV4cCI6MjA0MjE5Nzk4MX0.ElLbudiZpI4-mZ98Z89qy2d5mz3jgU08JoS6ddOvkKk',
    }),

    // pwa
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
