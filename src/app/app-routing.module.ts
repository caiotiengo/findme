import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'add-proc',
    loadChildren: () => import('./add-proc/add-proc.module').then( m => m.AddProcPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'item/:id',
    loadChildren: () => import('./item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'edit-page/:id',
    loadChildren: () => import('./edit-page/edit-page.module').then( m => m.EditPagePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./slides/slides.module').then( m => m.SlidesPageModule)
  },  {
    path: 'carrinho',
    loadChildren: () => import('./carrinho/carrinho.module').then( m => m.CarrinhoPageModule)
  },
  {
    path: 'item-view',
    loadChildren: () => import('./item-view/item-view.module').then( m => m.ItemViewPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
