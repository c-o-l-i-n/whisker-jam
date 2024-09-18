import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JamServerService } from './jam-server.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { JamClientService } from './jam-client.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'wj-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  template: `
    <h1 class="font-heading mb-6 text-center text-5xl">Whisker Jam</h1>

    @if (hostingJamSession()) {
      <p>
        Hosting Jam Session ID:
        <span class="ml-2 font-bold text-primary">
          {{ hostedJamSessionId() }}
        </span>
      </p>

      <h2 class="font-heading mt-5 text-xl">Latest Sound</h2>
      <pre>{{ latestSound() }}</pre>
    } @else if (inJamSession()) {
      <p>
        Joined Jam Session ID:
        <span class="ml-2 font-bold text-primary">
          {{ joinedJamSessionId() }}
        </span>
      </p>

      <img
        src="/images/snare.png"
        alt="Snare Drum"
        class="mx-auto w-full max-w-sm"
        (mousedown)="sendSound('snare')"
      />
    } @else {
      <div class="mx-auto flex w-full max-w-sm flex-col justify-center gap-3">
        <button class="btn" (click)="onHostJamSessionButtonClick()">
          Host Jam Session
        </button>
        <button class="btn btn-primary" (click)="onJoinJamSessionButtonClick()">
          Join Jam Session
        </button>
      </div>
    }

    <router-outlet />
  `,
  host: {
    class: 'block w-full p-8',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly jamServerService = inject(JamServerService);
  private readonly jamClientService = inject(JamClientService);

  readonly hostingJamSession = toSignal(
    this.jamServerService.hostingJamSession$,
  );
  readonly hostedJamSessionId = toSignal(this.jamServerService.jamSessionId$);
  readonly latestSound = toSignal(this.jamServerService.sounds$);

  readonly inJamSession = toSignal(this.jamClientService.inJamSession$);
  readonly joinedJamSessionId = toSignal(this.jamClientService.jamSessionId$);

  onHostJamSessionButtonClick(): void {
    const jamId = prompt('Create a new Jam Session ID');

    if (!jamId) return;

    this.jamServerService.createJamSession(jamId);
  }

  onJoinJamSessionButtonClick(): void {
    const jamId = prompt('Enter the Jam Session ID');

    if (!jamId) return;

    this.jamClientService.joinJamSession(jamId);
  }

  sendSound(sound: string): void {
    this.jamClientService.sendSound(sound);
  }
}
