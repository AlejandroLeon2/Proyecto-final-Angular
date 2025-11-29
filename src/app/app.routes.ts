import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin/admin-guard';
import { userGuard } from './core/guards/user/user-guard';
import { sessionGuard } from './core/guards/session/session-guard';

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
        canActivate:[sessionGuard]
      },
      {
        path: 'ckeckout',
        loadComponent: () => import('./page/ckeckout/ckeckout').then((c) => c.Ckeckout),
        canActivate:[sessionGuard]
      },
      {
        path: 'frequently-questions',
        loadComponent: () =>
         import('./page/frequently-questions/frequently-questions').then(
            (c) => c.FrequentlyQuestions
          ),
      },
      {
        path: '**',
        redirectTo: 'home',
      },

    ],
  },

  {
    path: 'about',
    loadComponent: () => import('./page/about/about').then((c) => c.About),
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
    canActivate: [adminGuard],
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
          import('./feature/admin/components/categories/categories').then((c) => c.Categories),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./feature/admin/components/orders/orders').then((c) => c.Orders),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./feature/admin/components/order-detail/order-detail').then((c) => c.OrderDetail),
      },
      {
        path: '**',

        redirectTo: '',
      },
    ],
  },

  {
    path: 'user',
    canActivate: [userGuard],
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
        loadComponent: () => import('./page/user/profile/profile').then((c) => c.Profile),
      },
      {
        path: 'orders',
        loadComponent: () => import('./page/user/orders/orders').then((c) => c.Orders),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./feature/user/Components/orders/orders-detail/orders-detail').then(
            (c) => c.OrdersDetail
          ),
      },
      {
        path: '**',
        redirectTo: 'profile',
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./page/not-found/not-found').then((m) => m.NotFound),
  },
];
