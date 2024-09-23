import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { JamClientService } from '../data-access/jam-client.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { KeyboardComponent } from '../ui/keyboard.component';
import { DrumSetComponent } from '../ui/drum-set.component';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Cat, Instrument } from '../../shared/util/types';

@Component({
  selector: 'wj-join-page',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    RouterLink,
    KeyboardComponent,
    DrumSetComponent,
    JsonPipe,
    TitleCasePipe,
  ],
  template: `
    @if (jamSessionInProgress()) {
      <p class="glass mb-4 rounded-xl px-5 py-3 text-center text-xl">
        Joined Jam Session:
        <br />
        <span class="ml-2 rounded bg-white px-2 py-1 font-bold text-primary">
          {{ jamSessionId() }}
        </span>
      </p>

      <!-- Leave Button -->
      <button
        class="btn btn-neutral mb-4 w-full"
        (click)="leaveModal.showModal()"
      >
        Leave Jam Session
      </button>

      <dialog #leaveModal class="modal">
        <div class="modal-box">
          <p>Are you sure you want to leave the jam session?</p>
          <div class=""></div>
          <form class="modal-action" method="dialog">
            <button class="btn">No</button>
            <button class="btn btn-primary" (click)="onLeaveButtonClick()">
              Yes
            </button>
          </form>
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

      <div
        class="relative mx-auto mt-5 flex flex-col items-center gap-4 p-4 text-center"
      >
        <img class="h-48 w-auto" [src]="'/images/cats/' + cat() + '.webp'" />

        <img
          class="absolute bottom-0 left-5 h-48 -rotate-12"
          [src]="'/images/instruments/' + instrument() + '.webp'"
        />
      </div>
      <p
        class="w-max self-center rounded bg-base-content px-2 py-1 text-center text-xl font-bold text-white"
      >
        {{ nickname() }}
      </p>
    } @else {
      <!-- Home Button -->
      <a class="btn btn-ghost mb-5 self-start text-white" routerLink="/">
        <fa-icon [icon]="faChevronLeft" />
        Home
      </a>

      <form
        #form="ngForm"
        (ngSubmit)="
          onJoinButtonClick(
            form.value.jamSessionId,
            form.value.nickname,
            form.value.cat,
            form.value.instrument,
            form
          )
        "
        class="glass flex w-full flex-col gap-5 rounded-xl p-6"
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
          Choose your cat
          <select required ngModel name="cat" class="select select-bordered">
            @for (cat of cats; track cat) {
              <option [value]="cat">{{ cat | titlecase }}</option>
            }
          </select>
        </label>

        <label class="flex flex-col gap-1">
          Choose your instrument
          <select
            required
            ngModel
            name="instrument"
            class="select select-bordered"
          >
            @for (instrument of instruments; track instrument) {
              <option [value]="instrument">{{ instrument | titlecase }}</option>
            }
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
    class: 'flex-grow relative w-full max-w-md mx-auto flex flex-col',
  },
  providers: [JamClientService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class JoinPageComponent {
  private readonly jamClientService = inject(JamClientService);

  readonly faChevronLeft = faChevronLeft;

  readonly jamSessionInProgress = this.jamClientService.jamSessionInProgress;
  readonly jamSessionId = this.jamClientService.jamSessionId;
  readonly cat = this.jamClientService.cat;
  readonly instrument = this.jamClientService.instrument;
  readonly nickname = this.jamClientService.nickname;

  // readonly instrument = signal('guitar');

  readonly cats = Object.values(Cat);
  readonly instruments = Object.values(Instrument);

  readonly keyboardWhiteKeyColor = computed(() => {
    switch (this.instrument()) {
      case 'guitar':
        return '#7a1111';
      case 'bass':
        return '#262649';
      default:
        return 'white';
    }
  });

  sendSound(sound: string, semitones = 0): void {
    this.jamClientService.sendSound(sound, semitones);
  }

  onJoinButtonClick(
    jamSessionId: string,
    nickname: string,
    cat: Cat,
    instrument: Instrument,
    form: NgForm,
  ): void {
    this.jamClientService.joinJamSession(
      jamSessionId,
      nickname,
      cat,
      instrument,
    );
    form.reset();
  }

  onLeaveButtonClick(): void {
    this.jamClientService.leaveJamSession();
  }
}
