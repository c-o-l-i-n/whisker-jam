import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'wj-drum-set',
  standalone: true,
  imports: [],
  template: `
    <!-- Snare -->
    <img
      class="h-64"
      src="/images/snare.webp"
      (mousedown)="drumHit.emit('snare')"
    />

    <!-- Kick -->
    <img
      class="h-64"
      src="/images/kick.webp"
      (mousedown)="drumHit.emit('kick')"
    />

    <!-- Crash Cymbal -->
    <img
      class="h-64"
      src="/images/crash-cymbal.webp"
      (mousedown)="drumHit.emit('crash-cymbal')"
    />

    <!-- Cowbell -->
    <img
      class="h-32"
      src="/images/cowbell.webp"
      (mousedown)="drumHit.emit('cowbell')"
    />
  `,
  host: {
    class: 'flex items-center gap-3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumSetComponent {
  drumHit = output<string>();
}
