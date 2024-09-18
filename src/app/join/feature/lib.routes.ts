import { Routes } from '@angular/router';

const joinRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./join-page.component'),
  },
];

export default joinRoutes;
