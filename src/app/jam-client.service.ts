import { inject, Injectable } from '@angular/core';
import {
  REALTIME_LISTEN_TYPES,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JamClientService {
  private readonly supabase = inject(SupabaseClient);

  private readonly jamChannel$ = new BehaviorSubject<RealtimeChannel | null>(
    null,
  );

  readonly messages$ = this.jamChannel$.pipe(
    switchMap((jamChannel) =>
      jamChannel
        ? new Observable(
            (subscriber) =>
              jamChannel
                .on(
                  REALTIME_LISTEN_TYPES.BROADCAST,
                  { event: 'test' },
                  (payload) => subscriber.next(payload),
                )
                .subscribe().unsubscribe,
          )
        : of(null),
    ),
    shareReplay(1),
  );

  readonly inJamSession$: Observable<boolean> = this.jamChannel$.pipe(
    map((jamChannel) => !!jamChannel),
    shareReplay(1),
  );

  readonly jamSessionId$ = this.jamChannel$.pipe(
    map((jamChannel) =>
      jamChannel ? jamChannel.topic.substring('realtime:'.length) : null,
    ),
    shareReplay(1),
  );

  joinJamSession(jamId: string): void {
    this.jamChannel$.next(this.supabase.channel(jamId.trim().toUpperCase()));
  }

  leaveJamSession(): void {
    this.jamChannel$.next(null);
  }

  sendSound(sound: string): void {
    this.jamChannel$.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: 'test',
      payload: { sound },
    });
  }
}
