import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  REALTIME_LISTEN_TYPES,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { NotePayload } from '../../shared/util/payload.mode';

@Injectable()
export class JamClientService {
  private readonly supabase = inject(SupabaseClient);

  private readonly jamChannel$ = new BehaviorSubject<RealtimeChannel | null>(
    null,
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

  joinJamSession(jamId: string): void {
    this.jamChannel$.next(this.supabase.channel(jamId.trim().toUpperCase()));
  }

  leaveJamSession(): void {
    this.jamChannel$.next(null);
  }

  sendSound(sound: string, semitones = 0): void {
    this.jamChannel$.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: 'test',
      payload: { sound, semitones } as NotePayload,
    });
  }
}
