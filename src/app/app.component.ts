import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'wj-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1 class="z-20 mb-8 text-center font-heading text-5xl text-primary">
      <span class="rounded-xl bg-white px-8 py-3"> Whisker Jam</span>
    </h1>

    <router-outlet />
  `,
  host: {
    class: 'flex-grow flex flex-col',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
