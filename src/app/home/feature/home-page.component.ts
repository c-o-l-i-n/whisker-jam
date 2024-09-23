import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wj-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="glass flex flex-col gap-3 rounded-xl p-6">
      <a class="btn" routerLink="host">Host Jam Session</a>
      <a class="btn btn-primary" routerLink="join">Join Jam Session</a>
    </div>
  `,
  host: {
    class: 'mx-auto flex-grow flex w-full max-w-sm flex-col justify-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {}
