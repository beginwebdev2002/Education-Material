import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@pages/admin';
import { authGuard, adminGuard } from '@shared/auth';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@pages/home').then(m => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'materials',
    loadComponent: () => import('@pages/materials').then(m => m.MaterialsComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('@features/profile').then(m => m.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('@pages/settings').then(m => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
<<<<<<< HEAD
    canActivate: [adminGuard],
=======
    canActivate: [authGuard],
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
<<<<<<< HEAD
        path: 'overview',
        loadComponent: () => import('@pages/admin/overview/overview.page.component').then(m => m.OverviewPageComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('@pages/admin/users-management/users-management.page.component').then(m => m.UsersManagementPageComponent),
      },
      {
        path: 'materials',
        loadComponent: () => import('@pages/admin/materials-control/materials-control.page.component').then(m => m.MaterialsControlPageComponent),
      },
      {
        path: 'comments',
        loadComponent: () => import('@pages/admin/comments-moderation/comments-moderation.page.component').then(m => m.CommentsModerationPageComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('@pages/admin/analytics/analytics.page.component').then(m => m.AnalyticsPageComponent),
      },
      {
        path: 'activity',
        loadComponent: () => import('@pages/admin/activity-log/activity-log.page.component').then(m => m.ActivityLogPageComponent),
=======
        path: 'statistics',
        loadComponent: () => import('@pages/admin/statistics/statistics.page.component').then(m => m.StatisticsPageComponent)
      },
      {
        path: 'users',
        resolve: {

        },
        loadComponent: () => import('@pages/admin/users-management/ui/users-management.page.component').then(m => m.UsersManagementPageComponent)
      },
      {
        path: 'materials',
        loadComponent: () => import('@pages/admin/materials-control/ui/materials-control.page.component').then(m => m.MaterialsControlPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('@pages/admin/analytics/analytics.page.component').then(m => m.AnalyticsPageComponent)
      },
      {
        path: 'ai-management',
        loadComponent: () => import('@pages/admin/ai-management/ai-management.page.component').then(m => m.AiManagementPageComponent)
      },
      {
        path: 'system-settings',
        loadComponent: () => import('@pages/admin/system-settings/ui/system-settings.page.component').then(m => m.SystemSettingsPageComponent)
      },
      {
        path: 'advertising',
        loadComponent: () => import('@features/admin-advertising').then(m => m.AdvertisingPageComponent)
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
