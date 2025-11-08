import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'shop',
    loadComponent: () => import('./layouts/shop-layout/shop-layout').then((c) => c.ShopLayout),
    children: [
      {
        path: 'usuario/**',
        redirectTo: 'usuario',
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
  {
    path: 'admin',
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
    ],
  },

  {
    path: 'usuario',
    children: [
      {
        path: 'usuario/**',
        redirectTo: 'usuario',
      },

      {
        path: 'profile',
        loadComponent: () => import('./feature/usuario/profile/profile').then((c) => c.Profile),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
