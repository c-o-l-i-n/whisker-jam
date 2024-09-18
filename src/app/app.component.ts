import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'wj-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1 class="mb-6 text-center font-heading text-5xl">Whisker Jam</h1>

    <router-outlet />
  `,
  host: {
    class: 'flex-grow flex flex-col',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
