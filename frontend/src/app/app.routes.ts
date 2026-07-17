import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { UserService } from '@entities/user';
import { AdminLayoutComponent } from '@pages/admin';
import { UserStorageService } from '@core/storage';

const authGuard: CanActivateFn = (route, state) => {
  const userStorageService: UserStorageService = inject(UserStorageService);
  const currentUser = userStorageService.loadUser();
  const router: Router = inject(Router);

  if (currentUser()) {
    if (state.url.startsWith('/admin')) {
      if (currentUser()?.role === 'ADMIN') {
        return true;
      }
      return router.parseUrl('/'); // Redirect non-admins from admin area
    }
    return true;
  }

  return router.parseUrl('/');
};


export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@pages/home').then(m => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'materials',
    loadComponent: () => import('@pages/materials').then(m => m.MaterialsComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('@pages/profile').then(m => m.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('@pages/settings').then(m => m.SettingsComponent),
  },
  {
    path: 'docs',
    loadComponent: () => import('@pages/docs').then(m => m.DocsComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'statistics', pathMatch: 'full' },
      {
        path: 'statistics',
        loadComponent: () => import('../pages/admin/statistics/statistics.page.component').then(m => m.StatisticsPageComponent)
      },
      {
        path: 'users',
        resolve: {

        },
        loadComponent: () => import('../pages/admin/users-management/users-management.page.component').then(m => m.UsersManagementPageComponent)
      },
      {
        path: 'materials',
        loadComponent: () => import('../pages/admin/materials-control/materials-control.page.component').then(m => m.MaterialsControlPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('../pages/admin/analytics/analytics.page.component').then(m => m.AnalyticsPageComponent)
      },
      {
        path: 'ai-management',
        loadComponent: () => import('../pages/admin/ai-management/ai-management.page.component').then(m => m.AiManagementPageComponent)
      },
      {
        path: 'system-settings',
        loadComponent: () => import('../pages/admin/system-settings/system-settings.page.component').then(m => m.SystemSettingsPageComponent)
      },
      {
        path: 'advertising',
        loadComponent: () => import('../pages/admin/advertising/advertising.page.component').then(m => m.AdvertisingPageComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];