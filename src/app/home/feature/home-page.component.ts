import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'wj-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="btn" routerLink="host">Host Jam Session</a>
    <a class="btn btn-primary" routerLink="join">Join Jam Session</a>
  `,
  host: {
    class:
      'mx-auto flex-grow flex w-full max-w-sm flex-col justify-center gap-3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {}
