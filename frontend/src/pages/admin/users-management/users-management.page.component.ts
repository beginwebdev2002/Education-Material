import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserModel, UserService } from '@entities/user';
import { SessionStore } from '@shared/auth';
import { SkeletonLoaderComponent } from '@shared/ui';

@Component({
  selector: 'app-users-management-page',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, DatePipe, FormsModule, SkeletonLoaderComponent],
  templateUrl: './users-management.page.component.html',
  styleUrls: ['./users-management.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersManagementPageComponent {
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);

  isLoading = signal(true);
  users = signal<UserModel[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 20;
  searchTerm = signal('');

  currentAdminId = () => this.sessionStore.currentUser()?._id;

  constructor() {
    this.load();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
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
}
