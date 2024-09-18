import { Routes } from '@angular/router';

const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page.component'),
  },
];

export default homeRoutes;
