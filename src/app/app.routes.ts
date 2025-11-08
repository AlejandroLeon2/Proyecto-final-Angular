import { Routes } from '@angular/router';

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
        path: '**',
        redirectTo: 'home',
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
        redirectTo: 'admin-dashboard',
        pathMatch: 'full',
      },
      {
        path: 'admin-dashboard',
        loadComponent: () =>
          import('./feature/admin/admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
      },

      {
        path: 'admin-crud',
        loadComponent: () =>
          import('./feature/admin/admin-crud/admin-crud').then((c) => c.AdminCrud),
      },
      {
        path: 'admin-productos',
        loadComponent: () =>
          import('./feature/admin/admin-productos/admin-productos').then((c) => c.AdminProductos),
      },
      {
        path: 'admin-ordenes',
        loadComponent: () =>
          import('./feature/usuario/order/order').then((c) => c.Order),
      },
      {
        path: '**',
        redirectTo: 'admin-dashboard',
      },
    ],
  },

  {
    path: 'usuario',
    loadComponent: () =>
      import('./layouts/usuario-layout/usuario-layout').then((c) => c.UsuarioLayout),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/usuario/profile/profile').then((c) => c.Profile),
      },
            {
        path: 'orders',
        loadComponent: () => import('./feature/usuario/order/order').then((c) => c.Order),
      }
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
