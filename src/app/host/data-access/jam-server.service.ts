import { inject, Injectable } from '@angular/core';
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  RealtimeChannel,
  RealtimePresenceState,
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
  subscribeOn,
  switchMap,
} from 'rxjs';
import { Sound } from '../../shared/util/sound';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NotePayload, Player } from '../../shared/util/types';

@Injectable()
export class JamServerService {
  private readonly supabase = inject(SupabaseClient);

  private readonly soundMap = new Map<string, Sound>([
    ['guitar', new Sound('/audio/guitar.wav')],
    ['bass', new Sound('/audio/bass.wav')],
    ['synth', new Sound('/audio/synth.wav')],
    ['snare', new Sound('/audio/snare.wav')],
    ['kick', new Sound('/audio/kick.wav')],
    ['crash-cymbal', new Sound('/audio/crash-cymbal.wav')],
    ['cowbell', new Sound('/audio/cowbell.wav')],
    ['vocals', new Sound('/audio/meow.wav')],
    ['ernest', new Sound('/audio/ernest.wav')],
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

  readonly sounds$ = this.jamChannel$.pipe(
    switchMap((jamChannel) =>
      jamChannel
        ? new Observable<NotePayload>(
            (subscriber) =>
              jamChannel.on(
                REALTIME_LISTEN_TYPES.BROADCAST,
                { event: 'sound' },
                (payload) => subscriber.next(payload['payload'] as NotePayload),
              )?.unsubscribe,
          )
        : EMPTY,
    ),
    shareReplay(1),
  );

  private readonly players$ = this.jamChannel$.pipe(
    switchMap((jamChannel) => {
      return jamChannel
        ? new Observable<RealtimePresenceState<Player>>(
            (subscriber) =>
              jamChannel.on(
                REALTIME_LISTEN_TYPES.PRESENCE,
                { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
                () => subscriber.next({ ...jamChannel.presenceState() }),
              )?.unsubscribe,
          ).pipe(
            map((presenceState) =>
              Object.entries(presenceState).map(
                ([id, presence]): Player => ({
                  ...presence[0],
                  id,
                }),
              ),
            ),
          )
        : of(null);
    }),
    shareReplay(1),
  );

  readonly players = toSignal(this.players$);

  readonly latestSound = toSignal(this.sounds$);

  readonly jamSession$: Observable<boolean> = this.jamChannel$.pipe(
    map((jamChannel) => !!jamChannel),
    shareReplay(1),
  );

  readonly jamSessionInProgress = toSignal(this.jamSession$, {
    requireSync: true,
  });

  constructor() {
    this.jamChannel$
      .pipe(filter((channel) => !!channel))
      .subscribe((channel) => channel.subscribe());

    // load all sounds
    for (const sound of this.soundMap.values()) {
      sound.load();
    }

    // play sounds when they are received
    this.sounds$
      .pipe(
        takeUntilDestroyed(),
        filter((soundPayload) => !!soundPayload),
      )
      .subscribe((soundPayload) => {
        this.soundMap.get(soundPayload.sound)?.play(soundPayload.semitones);
      });
  }

  createJamSession(jamId: string): void {
    this.jamChannel$.next(this.supabase.channel(jamId.trim().toUpperCase()));
  }

  endJamSession(): void {
    this.jamChannel$.next(null);
  }
}
