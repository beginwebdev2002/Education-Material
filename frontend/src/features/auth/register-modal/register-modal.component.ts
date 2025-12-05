import { Component, ChangeDetectionStrategy, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MockAuthService } from '../../../entities/auth/auth.service';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterModalComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  private authService: MockAuthService = inject(MockAuthService);
  private authState: AuthStateService = inject(AuthStateService);
  close = output<void>();

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  register(): void {
    if (this.isLoading() || !this.email || !this.password || !this.firstName || !this.lastName) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);

    this.authService.register({ firstName: this.firstName, lastName: this.lastName, email: this.email })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.close.emit();
        },
        error: (err) => {
          this.error.set(err.message || 'Registration failed. Please try again.');
          console.error(err);
        }
      });
  }
  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonCreatingAccount|Текст кнопки, когда идет процесс регистрации:Creating account...`;
    } else {
      return $localize`:@@buttonCreateAccount|Текст кнопки для начала регистрации:Create account`;
    }
  });

  switchToLogin(): void {
    this.authState.setMode('login');
  }
}