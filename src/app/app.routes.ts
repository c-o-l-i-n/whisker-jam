import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/feature/lib.routes'),
  },
  {
    path: 'host',
    loadChildren: () => import('./host/feature/lib.routes'),
  },
  {
    path: 'join',
    loadChildren: () => import('./join/feature/lib.routes'),
  },
];
