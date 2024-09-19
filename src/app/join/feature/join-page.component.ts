import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JamClientService } from '../data-access/jam-client.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wj-join-page',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, RouterLink],
  template: `
    @if (jamSessionInProgress()) {
      <p>
        Joined Jam Session:
        <span class="ml-2 font-bold text-primary">
          {{ jamSessionId() }}
        </span>
      </p>

      <!-- Snare Drum -->
      <img
        src="/images/snare.png"
        alt="Snare Drum"
        class="mx-auto w-full max-w-sm"
        (mousedown)="sendSound('snare')"
      />

      <!-- End Button -->
      <button class="btn btn-neutral mt-10" (click)="onLeaveButtonClick()">
        Leave Jam Session
      </button>
    } @else {
      <!-- Home Button -->
      <a class="btn btn-ghost mb-5 text-primary" routerLink="..">
        <fa-icon [icon]="faChevronLeft" />
        Home
      </a>

      <form
        #form="ngForm"
        (ngSubmit)="
          onJoinButtonClick(form.value.jamSessionId, form.value.nickname, form)
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
            class="input input-bordered flex-grow font-bold uppercase text-primary"
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
            class="input input-bordered flex-grow"
          />
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

  sendSound(sound: string): void {
    this.jamClientService.sendSound(sound);
  }

  onJoinButtonClick(
    jamSessionId: string,
    nickname: string,
    form: NgForm,
  ): void {
    form.reset();
    this.jamClientService.joinJamSession(jamSessionId);
  }

  onLeaveButtonClick(): void {
    this.jamClientService.leaveJamSession();
  }
}
