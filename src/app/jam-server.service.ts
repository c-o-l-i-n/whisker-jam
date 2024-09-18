import { inject, Injectable } from '@angular/core';
import {
  REALTIME_LISTEN_TYPES,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Sound } from './utils/sound';

@Injectable({
  providedIn: 'root',
})
export class JamServerService {
  private readonly supabase = inject(SupabaseClient);

  private readonly snareSound = new Sound('/audio/snare.wav');

  private readonly soundMap: Record<string, Sound> = {
    snare: this.snareSound,
  };

  private readonly jamChannel$ = new BehaviorSubject<RealtimeChannel | null>(
    null,
  );

  readonly jamSessionId$ = this.jamChannel$.pipe(
    map((jamChannel) =>
      jamChannel ? jamChannel.topic.substring('realtime:'.length) : null,
    ),
    shareReplay(1),
  );

  readonly sounds$ = this.jamChannel$.pipe(
    switchMap((jamChannel) =>
      jamChannel
        ? new Observable<string>(
            (subscriber) =>
              jamChannel
                .on(
                  REALTIME_LISTEN_TYPES.BROADCAST,
                  { event: 'test' },
                  (payload) =>
                    subscriber.next(payload['payload']['sound'] as string),
                )
                .subscribe().unsubscribe,
          )
        : of(),
    ),
    shareReplay(1),
  );

  readonly hostingJamSession$: Observable<boolean> = this.jamChannel$.pipe(
    map((jamChannel) => !!jamChannel),
    shareReplay(1),
  );

  constructor() {
    // load sounds
    Object.values(this.soundMap).forEach((sound) => sound.load());

    // play sounds when when they are received
    this.sounds$.pipe(filter((sound) => !!sound)).subscribe((sound) => {
      this.soundMap[sound]?.play();
    });
  }

  createJamSession(jamId: string): void {
    this.jamChannel$.next(this.supabase.channel(jamId.trim().toUpperCase()));
  }

  endJamSession(): void {
    this.jamChannel$.next(null);
  }
}
