import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import { JamServerService } from '../data-access/jam-server.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'wj-host-page',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, RouterLink, QRCodeModule],
  template: `
    @if (jamSessionInProgress()) {
      <qrcode
        [qrdata]="qrCodeData()"
        [width]="82"
        colorDark="4a00ff"
        class="absolute left-4 top-4 overflow-hidden rounded-lg"
      />

      <div class="flex w-full items-start justify-between">
        <p class="glass w-max rounded-xl px-5 py-2 text-xl text-white">
          Jam Session:
          <span class="ml-2 rounded bg-white px-2 py-1 font-bold text-primary">
            {{ jamSessionId() }}
          </span>
        </p>

        <!-- End Button -->
        <button class="btn btn-neutral" (click)="onEndButtonClick()">
          End Jam Session
        </button>
      </div>

      <div class="light1 left-1/4">
        <div class="ray"></div>
      </div>

      <div class="light2 right-1/4">
        <div class="ray"></div>
      </div>

      <div class="absolute bottom-5 left-0 flex w-full justify-center gap-5">
        @for (player of players(); track player.id; let odd = $odd) {
          <div
            #player
            [attr.data-playerid]="player.id"
            class="relative flex flex-col items-center gap-4 p-4 text-center"
          >
            <img
              height="256"
              width="256"
              [src]="'/images/cats/' + player.cat + '.webp'"
            />

            <img
              height="256"
              width="256"
              class="absolute bottom-12 left-5 -rotate-12"
              [src]="'/images/instruments/' + player.instrument + '.webp'"
            />

            <p
              class="rounded bg-base-content px-2 py-1 text-center text-xl font-bold text-white"
            >
              {{ player.nickname }}
            </p>
          </div>
        } @empty {
          <h2 class="text-2xl italic text-white">
            Waiting for players to join...
          </h2>
        }
      </div>
    } @else {
      <div class="mx-auto max-w-md">
        <!-- Home Button -->
        <a class="btn btn-ghost mb-5 text-white" routerLink="/">
          <fa-icon [icon]="faChevronLeft" />
          Home
        </a>

        <form
          #form="ngForm"
          (ngSubmit)="onStartButtonClick(form.value.jamSessionId, form)"
          class="glass flex w-full max-w-md flex-col gap-5 rounded-xl p-6"
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
      </div>
    }
  `,
  host: {
    class: 'w-full w-full',
  },
  styles: `
    :root {
      --angle: 90deg;
    }

    .ray {
      clip-path: polygon(0% 45%, 100% 0%, 100% 100%, 0% 55%);
      transition: 4s;
      transform: translateY(-50%) translateX(-50%) rotate(var(--angle))
        translateY(50%) translateX(50%) translateY(-50%);
      position: absolute;
      top: -30px;
      left: 50%;
      width: 90vh;
      height: 10vw;
      background: linear-gradient(
        0.25turn,
        rgba(255, 255, 0, 0.7),
        rgba(255, 255, 100, 0)
      );
      z-index: 10;
    }

    .light1 {
      animation-duration: 10s;
      animation-name: wave;
      animation-iteration-count: infinite;
    }

    .light2 {
      animation-duration: 7s;
      animation-name: wave;
      animation-iteration-count: infinite;
    }

    @keyframes wave {
      0% {
        --angle: 90deg;
      }

      50% {
        --angle: 110deg;
      }
      100% {
        --angle: 60deg;
      }
    }
  `,
  providers: [JamServerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HostPageComponent {
  private readonly jamServerService = inject(JamServerService);
  private readonly playerElements =
    viewChildren<ElementRef<HTMLElement>>('player');

  readonly faChevronLeft = faChevronLeft;

  readonly jamSessionInProgress = this.jamServerService.jamSessionInProgress;
  readonly jamSessionId = this.jamServerService.jamSessionId;

  readonly players = computed(() => this.jamServerService.players());

  readonly qrCodeData = computed(() => {
    const { protocol, host } = window.location;
    const jamSessionId = encodeURIComponent(this.jamSessionId() ?? '');

    return `${protocol}//${host}/join?id=${jamSessionId}`;
  });

  constructor() {
    effect(() => console.log(this.qrCodeData()));

    this.jamServerService.sounds$
      .pipe(takeUntilDestroyed())
      .subscribe((sound) => {
        const players = this.playerElements();
        console.log(sound, players);

        const player = players.find(
          (p) => p.nativeElement.dataset['playerid'] === sound.playerId,
        );

        console.log(sound, players, player);

        player?.nativeElement.animate(
          {
            transform: ['scale(1)', 'scale(1.15)', 'scale(1)'],
            offset: [0, 0.35],
            easing: ['ease-in', 'ease-out'],
          },
          150,
        );
      });
  }

  onStartButtonClick(jamSessionId: string, form: NgForm): void {
    form.reset();
    this.jamServerService.createJamSession(jamSessionId);
  }

  onEndButtonClick(): void {
    this.jamServerService.endJamSession();
  }
}
