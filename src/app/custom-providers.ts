import { Provider } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function provideSupabase(config: {
  projectUrl: string;
  apiKey: string;
}): Provider {
  return {
    provide: SupabaseClient,
    useValue: createClient(config.projectUrl, config.apiKey),
  };
}
