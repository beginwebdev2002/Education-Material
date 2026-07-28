import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel, UserService } from '@entities/user';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-user-detail-modal',
  imports: [CommonModule, DatePipe, TitleCasePipe, ModalComponent, TranslatePipe],
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  user = signal<UserModel | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.close();
      return;
    }
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set($localize`User not found.`);
        this.isLoading.set(false);
      },
    });
  }

  toggleRole(): void {
    const current = this.user();
    if (!current) return;
    const newRole = current.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.updateRole(current._id, newRole).subscribe((updated) => this.user.set(updated));
  }

  toggleBan(): void {
    const current = this.user();
    if (!current) return;
    this.userService.setBanned(current._id, !current.isBanned).subscribe((updated) => this.user.set(updated));
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
