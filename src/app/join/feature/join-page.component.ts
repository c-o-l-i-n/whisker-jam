import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { JamClientService } from '../data-access/jam-client.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { KeyboardComponent } from '../ui/keyboard.component';
import { DrumSetComponent } from '../ui/drum-set.component';

@Component({
  selector: 'wj-join-page',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    RouterLink,
    KeyboardComponent,
    DrumSetComponent,
  ],
  template: `
    @if (jamSessionInProgress()) {
      <p>
        Joined Jam Session:
        <span class="ml-2 font-bold text-primary">
          {{ jamSessionId() }}
        </span>
      </p>

      <!-- Leave Button -->
      <button
        class="btn btn-neutral my-5 w-full"
        (click)="leaveModal.showModal()"
      >
        Leave Jam Session
      </button>

      <dialog #leaveModal class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Are you sure?</h3>
          <p class="py-4">Are you sure you want to leave the jam session?</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn mr-5">No</button>
              <button class="btn btn-primary" (click)="onLeaveButtonClick()">
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>

      @if (instrument() === 'drums') {
        <!-- Drum Set -->
        <wj-drum-set (drumHit)="sendSound($event)" />
      } @else {
        <!-- Piano Keyboard -->
        <wj-keyboard
          class="h-56 w-full"
          (keyPress)="sendSound(instrument(), $event)"
        />
      }
    } @else {
      <!-- Home Button -->
      <a class="btn btn-ghost mb-5 text-primary" routerLink="..">
        <fa-icon [icon]="faChevronLeft" />
        Home
      </a>

      <form
        #form="ngForm"
        (ngSubmit)="
          onJoinButtonClick(
            form.value.jamSessionId,
            form.value.nickname,
            form.value.instrument,
            form
          )
        "
        class="flex w-full flex-col gap-5"
      >
        <!-- Jam Session ID -->
        <label class="flex flex-col gap-1">
          Jam Session ID
          <input
            type="text"
            ngModel
            required
            name="jamSessionId"
            class="input input-bordered font-bold uppercase text-primary"
          />
        </label>

        <!-- Nickname -->
        <label class="flex flex-col gap-1">
          Your Nickname
          <input
            type="text"
            ngModel
            required
            name="nickname"
            class="input input-bordered"
          />
        </label>

        <label class="flex flex-col gap-1">
          Choose your instrument
          <select
            required
            ngModel
            name="instrument"
            class="select select-bordered"
          >
            <option value="guitar">Guitar</option>
            <option value="bass">Bass</option>
            <option value="synth">Synth</option>
            <option value="drums">Drums</option>
          </select>
        </label>

        <!-- Join Button -->
        <input
          type="submit"
          class="btn btn-primary"
          [disabled]="form.invalid"
          value="Join Jam Session!"
        />
      </form>
    }
  `,
  host: {
    class: 'w-full max-w-md mx-auto',
  },
  providers: [JamClientService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class JoinPageComponent {
  private readonly jamClientService = inject(JamClientService);

  readonly faChevronLeft = faChevronLeft;

  readonly jamSessionInProgress = this.jamClientService.jamSessionInProgress;
  readonly jamSessionId = this.jamClientService.jamSessionId;

  instrument = signal('guitar');

  sendSound(sound: string, semitones = 0): void {
    this.jamClientService.sendSound(sound, semitones);
  }

  onJoinButtonClick(
    jamSessionId: string,
    nickname: string,
    instrument: string,
    form: NgForm,
  ): void {
    console.log(instrument);

    this.instrument.set(instrument);
    this.jamClientService.joinJamSession(jamSessionId);
    form.reset();
  }

  onLeaveButtonClick(): void {
    this.jamClientService.leaveJamSession();
  }
}
