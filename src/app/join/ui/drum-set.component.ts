import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'wj-drum-set',
  standalone: true,
  imports: [],
  template: `
    <!-- Cowbell -->
    <img
      #cowbell
      class="-mb-16 ml-[25%] w-1/6 hover:animate-hit"
      src="/images/instruments/cowbell.webp"
      (mousedown)="hit(cowbell, 'cowbell')"
    />

    <div class="flex w-full items-end">
      <!-- Snare -->
      <img
        #snare
        class="mb- z-10 w-1/3 hover:animate-hit"
        src="/images/instruments/snare.webp"
        (mousedown)="hit(snare, 'snare')"
      />

      <!-- Kick -->
      <img
        #kick
        class="-ml-[5%] -mr-[18%] w-1/2 hover:animate-hit"
        src="/images/instruments/kick.webp"
        (mousedown)="hit(kick, 'kick')"
      />

      <!-- Crash Cymbal -->
      <img
        #crashCymbal
        class="w-2/5 hover:animate-hit"
        src="/images/instruments/crash-cymbal.webp"
        (mousedown)="hit(crashCymbal, 'crash-cymbal')"
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

  hit(element: HTMLElement, sound: string): void {
    element.animate(
      {
        transform: ['scale(1)', 'scale(1.15)', 'scale(1)'],
        offset: [0, 0.35],
        easing: ['ease-in', 'ease-out'],
      },
      150,
    );

    this.drumHit.emit(sound);
  }
}
