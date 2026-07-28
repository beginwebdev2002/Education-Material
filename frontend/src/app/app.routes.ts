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
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('@pages/admin/ui/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/admin/ui/users-management/users-management.component').then(m => m.UsersManagementComponent),
          },
          {
            path: ':id',
            outlet: 'modal',
            loadComponent: () => import('@pages/admin/ui/user-detail-modal/user-detail-modal.component').then(m => m.UserDetailModalComponent),
          },
        ],
      },
      {
        path: 'materials',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/admin/ui/materials-control/materials-control.component').then(m => m.MaterialsControlComponent),
          },
          {
            path: ':id',
            outlet: 'modal',
            loadComponent: () => import('@pages/admin/ui/material-detail-modal/material-detail-modal.component').then(m => m.MaterialDetailModalComponent),
          },
        ],
      },
      {
        path: 'autocomplete',
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/admin/ui/autocomplete-lists-index/autocomplete-lists-index.component').then(m => m.AutocompleteListsIndexComponent),
          },
          {
            path: 'new',
            outlet: 'modal',
            loadComponent: () => import('@pages/admin/ui/autocomplete-list-form-modal/autocomplete-list-form-modal.component').then(m => m.AutocompleteListFormModalComponent),
          },
          {
            path: ':listId',
            outlet: 'modal',
            loadComponent: () => import('@pages/admin/ui/autocomplete-list-form-modal/autocomplete-list-form-modal.component').then(m => m.AutocompleteListFormModalComponent),
          },
          {
            path: ':listId/items',
            children: [
              {
                path: '',
                loadComponent: () => import('@pages/admin/ui/autocomplete-items-table/autocomplete-items-table.component').then(m => m.AutocompleteItemsTableComponent),
              },
              {
                path: 'new',
                outlet: 'modal',
                loadComponent: () => import('@pages/admin/ui/autocomplete-item-form-modal/autocomplete-item-form-modal.component').then(m => m.AutocompleteItemFormModalComponent),
              },
              {
                path: ':itemId',
                outlet: 'modal',
                loadComponent: () => import('@pages/admin/ui/autocomplete-item-form-modal/autocomplete-item-form-modal.component').then(m => m.AutocompleteItemFormModalComponent),
              },
            ],
          },
        ],
      },
      {
        path: 'comments',
        loadComponent: () => import('@pages/admin/ui/comments-moderation/comments-moderation.component').then(m => m.CommentsModerationComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('@pages/admin/ui/analytics/analytics.component').then(m => m.AnalyticsComponent),
      },
      {
        path: 'activity',
        loadComponent: () => import('@pages/admin/ui/activity-log/activity-log.component').then(m => m.ActivityLogComponent),
      },
      {
        path: 'monitoring',
        loadComponent: () => import('@pages/admin/ui/monitoring/monitoring.component').then(m => m.MonitoringComponent),
      },
      {
        path: 'user',
        loadComponent: () => import('@pages/admin/ui/user-profile/user-profile.component').then(m => m.UserProfileComponent),
      },
      {
        path: 'system-settings',
        loadComponent: () => import('@pages/admin/ui/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
