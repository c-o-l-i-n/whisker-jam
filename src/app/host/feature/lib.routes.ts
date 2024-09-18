import { Routes } from '@angular/router';

const hostRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./host-page.component'),
  },
];

export default hostRoutes;
