import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JamServerService } from '../data-access/jam-server.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wj-host-page',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, RouterLink],
  template: `
    @if (jamSessionInProgress()) {
      <p>
        Hosting Jam Session:
        <span class="ml-2 font-bold text-primary">
          {{ jamSessionId() }}
        </span>
      </p>

      <!-- End Button -->
      <button class="btn btn-neutral mt-10" (click)="onEndButtonClick()">
        End Jame Session
      </button>
    } @else {
      <!-- Home Button -->
      <a class="btn btn-ghost mb-5 text-primary" routerLink="..">
        <fa-icon [icon]="faChevronLeft" />
        Home
      </a>

      <form
        #form="ngForm"
        class="flex w-full max-w-md gap-3"
        (ngSubmit)="onStartButtonClick(form.value.jamSessionId, form)"
        class="flex w-full flex-col gap-5"
      >
        <!-- Jam Session ID -->
        <label class="flex flex-col gap-1">
          Create a new Jam Session ID
          <input
            type="text"
            ngModel
            required
            name="jamSessionId"
            class="input input-bordered flex-grow font-bold uppercase text-primary"
          />
        </label>

        <!-- Start Button -->
        <input
          type="submit"
          class="btn btn-primary"
          [disabled]="form.invalid"
          value="Start Jam Session!"
        />
      </form>
    }
  `,
  host: {
    class: 'w-full max-w-md mx-auto',
  },
  providers: [JamServerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HostPageComponent {
  private readonly jamServerService = inject(JamServerService);

  readonly faChevronLeft = faChevronLeft;

  readonly jamSessionInProgress = this.jamServerService.jamSessionInProgress;
  readonly jamSessionId = this.jamServerService.jamSessionId;

  onStartButtonClick(jamSessionId: string, form: NgForm): void {
    form.reset();
    this.jamServerService.createJamSession(jamSessionId);
  }

  onEndButtonClick(): void {
    this.jamServerService.endJamSession();
  }
}
