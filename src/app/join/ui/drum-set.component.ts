import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'wj-drum-set',
  standalone: true,
  imports: [],
  template: `
    <!-- Cowbell -->
    <img
      class="hover:animate-hit -mb-16 ml-[25%] w-1/6"
      src="/images/cowbell.webp"
      (mousedown)="drumHit.emit('cowbell')"
    />

    <div class="flex w-full items-end">
      <!-- Snare -->
      <img
        class="hover:animate-hit mb- z-10 w-1/3"
        src="/images/snare.webp"
        (mousedown)="drumHit.emit('snare')"
      />

      <!-- Kick -->
      <img
        class="hover:animate-hit -ml-[5%] -mr-[18%] w-1/2"
        src="/images/kick.webp"
        (mousedown)="drumHit.emit('kick')"
      />

      <!-- Crash Cymbal -->
      <img
        class="hover:animate-hit w-2/5"
        src="/images/crash-cymbal.webp"
        (mousedown)="drumHit.emit('crash-cymbal')"
      />
    </div>
  `,
  host: {
    class: 'w-full select-none items-center gap-3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumSetComponent {
  drumHit = output<string>();
}
