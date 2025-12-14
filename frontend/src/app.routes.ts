import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { AdminLayoutComponent } from './pages/admin/admin-layout.component';

const authGuard: CanActivateFn = (route, state) => {
  // FIX: Added explicit type to authService to resolve 'unknown' type error.
  const authService: AuthService = inject(AuthService);
  // FIX: Added explicit `Router` type to the injected router to fix 'unknown' type inference.
  const router: Router = inject(Router);

  if (authService.currentUser()) {
    // Check for admin role for admin routes
    if (state.url.startsWith('/admin')) {
      if (authService.currentUser()?.role === 'admin') {
        return true;
      }
      return router.parseUrl('/'); // Redirect non-admins from admin area
    }
    return true;
  }

  // Redirect to the home page if not logged in
  return router.parseUrl('/');
};


export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'materials',
    loadComponent: () => import('./pages/materials/materials.component').then(m => m.MaterialsComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs.component').then(m => m.DocsComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'statistics', pathMatch: 'full' },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/admin/statistics/statistics.page.component').then(m => m.StatisticsPageComponent)
      },
      {
        path: 'users',
        resolve: {

        },
        loadComponent: () => import('./pages/admin/users-management/users-management.page.component').then(m => m.UsersManagementPageComponent)
      },
      {
        path: 'materials',
        loadComponent: () => import('./pages/admin/materials-control/materials-control.page.component').then(m => m.MaterialsControlPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/admin/analytics/analytics.page.component').then(m => m.AnalyticsPageComponent)
      },
      {
        path: 'ai-management',
        loadComponent: () => import('./pages/admin/ai-management/ai-management.page.component').then(m => m.AiManagementPageComponent)
      },
      {
        path: 'system-settings',
        loadComponent: () => import('./pages/admin/system-settings/system-settings.page.component').then(m => m.SystemSettingsPageComponent)
      },
      {
        path: 'advertising',
        loadComponent: () => import('./pages/admin/advertising/advertising.page.component').then(m => m.AdvertisingPageComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];