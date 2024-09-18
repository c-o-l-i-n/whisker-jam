import { inject, Injectable } from '@angular/core';
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  BehaviorSubject,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Sound } from '../../shared/util/sound';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class JamServerService {
  private readonly supabase = inject(SupabaseClient);

  private readonly soundMap = new Map<string, Sound>([
    ['snare', new Sound('/audio/snare.wav')],
  ]);

  private readonly jamChannel$ = new BehaviorSubject<RealtimeChannel | null>(
    null,
  );

  readonly jamSessionId$ = this.jamChannel$.pipe(
    map((jamChannel) =>
      jamChannel ? jamChannel.topic.substring('realtime:'.length) : null,
    ),
    shareReplay(1),
  );

  readonly jamSessionId = toSignal(this.jamSessionId$, { requireSync: true });

  private readonly sounds$ = this.jamChannel$.pipe(
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
        : EMPTY,
    ),
    shareReplay(1),
  );

  private readonly members$ = this.jamChannel$.pipe(
    switchMap((jamChannel) => {
      const members: string[] = [];

      return jamChannel
        ? new Observable(
            (subscriber) =>
              jamChannel
                .on(
                  REALTIME_LISTEN_TYPES.PRESENCE,
                  { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
                  () => {
                    console.log('sync', jamChannel.presenceState());
                  },
                )
                .on(
                  REALTIME_LISTEN_TYPES.PRESENCE,
                  { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
                  ({ key, newPresences }) => {
                    console.log('joined', key, newPresences);
                    subscriber.next([...members, key]);
                  },
                )
                .on(
                  REALTIME_LISTEN_TYPES.PRESENCE,
                  { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
                  ({ key, leftPresences }) => {
                    console.log('left', key, leftPresences);
                    subscriber.next([...members, key]);
                  },
                )
                .subscribe().unsubscribe,
          )
        : of(null);
    }),
  );

  readonly latestSound = toSignal(this.sounds$);

  readonly jamSession$: Observable<boolean> = this.jamChannel$.pipe(
    map((jamChannel) => !!jamChannel),
    shareReplay(1),
  );

  readonly jamSessionInProgress = toSignal(this.jamSession$, {
    requireSync: true,
  });

  constructor() {
    this.members$.pipe(takeUntilDestroyed()).subscribe();

    // load all sounds
    for (const sound of this.soundMap.values()) {
      sound.load();
    }

    // play sounds when when they are received
    this.sounds$
      .pipe(
        takeUntilDestroyed(),
        filter((sound) => !!sound),
      )
      .subscribe((sound) => {
        this.soundMap.get(sound)?.play();
      });
  }

  createJamSession(jamId: string): void {
    this.jamChannel$.next(this.supabase.channel(jamId.trim().toUpperCase()));
  }

  endJamSession(): void {
    this.jamChannel$.next(null);
  }
}
