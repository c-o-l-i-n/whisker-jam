import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
  RealtimeChannelSendResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { Cat, Instrument, NotePayload } from '../../shared/util/types';

@Injectable()
export class JamClientService {
  private readonly supabase = inject(SupabaseClient);

  private readonly jamChannel$ = new BehaviorSubject<RealtimeChannel | null>(
    null,
  );

  private readonly cat$ = new BehaviorSubject(Cat.Hazel);
  private readonly instrument$ = new BehaviorSubject(Instrument.Bass);
  private readonly nickname$ = new BehaviorSubject<string>(
    `nickname-${Date.now()}`,
  );

  readonly cat = toSignal(this.cat$, { requireSync: true });
  readonly instrument = toSignal(this.instrument$, { requireSync: true });
  readonly nickname = toSignal(this.nickname$, { requireSync: true });

  private readonly playerId$ = new BehaviorSubject<string>(
    `player-${Date.now()}-${Math.random()}`,
  );

  readonly jamSessionInProgress$: Observable<boolean> = this.jamChannel$.pipe(
    map((jamChannel) => !!jamChannel),
    shareReplay(1),
  );

  readonly jamSessionInProgress = toSignal(this.jamSessionInProgress$, {
    requireSync: true,
  });

  readonly jamSessionId$ = this.jamChannel$.pipe(
    map((jamChannel) =>
      jamChannel ? jamChannel.topic.substring('realtime:'.length) : null,
    ),
    shareReplay(1),
  );

  readonly jamSessionId = toSignal(this.jamSessionId$, { requireSync: true });

  joinJamSession(
    jamId: string,
    nickname: string,
    cat: Cat,
    instrument: Instrument,
  ): void {
    this.cat$.next(cat);
    this.instrument$.next(instrument);
    this.nickname$.next(nickname);
    this.playerId$.next(`player-${Date.now()}-${Math.random()}`);

    this.jamChannel$.next(
      this.supabase.channel(jamId.trim().toUpperCase(), {
        config: {
          presence: {
            key: this.playerId$.value,
          },
        },
      }),
    );

    this.jamChannel$.subscribe((channel) =>
      channel?.subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          channel.track({
            cat,
            instrument,
            nickname: this.nickname$.value,
          });
        }
      }),
    );
  }

  leaveJamSession(): void {
    this.jamChannel$.value?.untrack();
    this.jamChannel$.next(null);
  }

  sendSound(sound: string, semitones = 0): void {
    this.jamChannel$.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: 'sound',
      payload: {
        playerId: this.playerId$.value,
        sound:
          this.cat$.value === Cat.Ernest && sound === 'vocals'
            ? 'ernest'
            : sound,
        semitones,
      } as NotePayload,
    });
  }
}
