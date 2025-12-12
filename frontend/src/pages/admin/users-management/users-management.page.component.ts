import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthService } from '@features/auth/data-access/auth.service';
import { SkeletonLoaderComponent } from '@shared/ui/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-users-management-page',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, DatePipe, SkeletonLoaderComponent],
  templateUrl: './users-management.page.component.html',
  styleUrls: ['./users-management.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersManagementPageComponent implements OnInit {
  // FIX: Added explicit type to authService to resolve 'unknown' type error.
  private authService: AuthService = inject(AuthService);
  // FIX: Provided an initialValue to toSignal. This ensures the signal is of type `User[]` from the start,
  // preventing it from being `undefined` initially and causing downstream type inference issues.

  isLoading = signal(true);
  allUsers = toSignal(this.authService.getAllUsers(), { initialValue: [] });

  searchTerm = signal('');

  filteredUsers = computed(() => {
    const users = this.allUsers();
    const term = this.searchTerm().toLowerCase();

    // The `if (!users)` check is no longer necessary because `allUsers` is initialized with `[]`.
    if (!term) {
      return users;
    }

    return users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    // Simulate async data fetching to allow skeleton loader to be visible
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }

  // Mock data generation for presentation
  getMockMaterialsCount(userId: string): number {
    // Simple hash to make it deterministic
    return (userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10) * 2 + 1;
  }

  getMockLastLogin(userId: string): Date {
    const d = new Date();
    // Simple hash to make it deterministic
    const offset = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 30;
    d.setDate(d.getDate() - offset);
    return d;
  }
}