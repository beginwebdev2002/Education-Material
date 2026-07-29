import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { UserModel, UserService } from '@entities/user';
import { SessionStore } from '@shared/auth';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { IconButtonComponent, PaginationComponent, SearchInputComponent, SkeletonLoaderComponent } from '@shared/ui';
import { ListFilterSidebarComponent } from '@widgets/admin';

@Component({
  selector: 'app-users-management-page',
  imports: [
    CommonModule,
    TitleCasePipe,
    DatePipe,
    SkeletonLoaderComponent,
    RouterLink,
    PaginationComponent,
    SearchInputComponent,
    ListFilterSidebarComponent,
    IconButtonComponent,
    TranslatePipe,
  ],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersManagementComponent {
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly i18n = inject(TranslationService);

  isLoading = signal(true);
  users = signal<UserModel[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 20;
  searchTerm = signal('');

  currentAdminId = () => this.sessionStore.currentUser()?._id;

  constructor() {
    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.load());
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers({ page: this.page(), limit: this.limit, search: this.searchTerm() }).subscribe({
      next: (response) => {
        this.users.set(response.items);
        this.total.set(response.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleRole(user: UserModel): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.updateRole(user._id, newRole).subscribe((updated) => {
      this.users.update((list) => list.map((u) => (u._id === updated._id ? updated : u)));
    });
  }

  toggleBan(user: UserModel): void {
    this.userService.setBanned(user._id, !user.isBanned).subscribe((updated) => {
      this.users.update((list) => list.map((u) => (u._id === updated._id ? updated : u)));
    });
  }

  roleActionLabel(user: UserModel): string {
    return this.i18n.translate(user.role === 'ADMIN' ? 'admin.usersManagement.demote' : 'admin.usersManagement.promote');
  }

  banActionLabel(user: UserModel): string {
    return this.i18n.translate(user.isBanned ? 'admin.usersManagement.unban' : 'admin.usersManagement.ban');
  }
}
