import { Routes } from '@angular/router';
import { userGuardGuard } from './core/guards/user/user-guard-guard';
import { adminGuardGuard } from './core/guards/admin/admin-guard-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
  {
    path: 'shop',

    loadComponent: () => import('./layouts/shop-layout/shop-layout').then((c) => c.ShopLayout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./page/home/home').then((c) => c.Home),
      },
      {
        path: 'catalogo-product',
        loadComponent: () =>
          import('./page/product-catalog/product-catalog').then((c) => c.ProductCatalog),
      },
      {
        path: 'product-detail/:id',
        loadComponent: () =>
          import('./page/product-detail/product-detail').then((c) => c.ProductDetail),
      },
      {
        path: 'cart',
        loadComponent: () => import('./page/cart/cart').then((c) => c.Cart),
      },
      // {
      //   path: '**',
      //   redirectTo: 'home',
      // },
    ],
  },

  {
    path: 'register',
    loadComponent: () => import('./feature/auth/register/register').then((c) => c.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login').then((c) => c.Login),
  },

  // ADMIN Routes
  {
    path: 'admin',
    canActivate: [adminGuardGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((c) => c.AdminLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature/admin/components/products/products').then((c) => c.Products),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./feature/admin/components/products/products').then((c) => c.Products),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./feature/admin/components/products/products').then((c) => c.Products),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./feature/admin/components/products/products').then((c) => c.Products),
      },
      {
        path: '**',

        redirectTo: '',
      },
    ],
  },

  {
    path: 'user',
    canActivate: [userGuardGuard],
    loadComponent: () =>
      import('./layouts/usuario-layout/usuario-layout').then((c) => c.UsuarioLayout),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/user/profile/profile').then((c) => c.Profile),
      },
      {
        path: 'orders',
        loadComponent: () => import('./feature/user/order/order').then((c) => c.Order),
      },
      {
        path: '**',
        redirectTo: 'profile',
      },
    ],
  },

  // {
  //   path: '**',
  //   redirectTo: 'home',
  // },
  // Ruta 404 (debe ir al final)
  {
    path: '**',
    loadComponent: () => import('./page/not-found/not-found').then((m) => m.NotFound),
  },
];
