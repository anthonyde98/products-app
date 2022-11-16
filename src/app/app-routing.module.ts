import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsoluteRoutes } from './enums/routes';

const routes: Routes = [
  {
    path: AbsoluteRoutes.products,
    redirectTo: AbsoluteRoutes.products,
    pathMatch: 'full'
  },
  {
    path: AbsoluteRoutes.products,
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: `${AbsoluteRoutes.information}:id`,
    loadChildren: () => import('./pages/information/information.module').then(m => m.InformationModule)
  },
  {
    path: AbsoluteRoutes.set,
    loadChildren: () => import('./pages/set/set.module').then(m => m.SetModule)
  },
  {
    path: '**',
    redirectTo: AbsoluteRoutes.products,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
