import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { DocComponent } from '@pages/doc/doc.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { UserManagementComponent } from '@pages/user-management/user-management.component';

export const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'home', component: HomeComponent },
   { path: 'dashboard', component: DashboardComponent },
   { path: 'doc', component: DocComponent },
   { path: 'profile', component: ProfileComponent },
   { path: 'admin', component: AdminComponent },
   { path: 'user-management', component: UserManagementComponent },
   { path: '**', redirectTo: '/home' }
];
