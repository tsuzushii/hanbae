import { Routes } from '@angular/router';
import { TarifViewComponent } from './tarif-view/tarif-view.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => TarifViewComponent
  },
  {
    path: '**',
    loadComponent: () => import('@ag/vc.ag-core/error').then(c => c.AgPageNotFoundComponent)
  }
];
