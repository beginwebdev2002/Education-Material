import { Component, ChangeDetectionStrategy, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MockAuthService } from '../../../entities/auth/auth.service';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  private authService: MockAuthService = inject(MockAuthService);
  private authState: AuthStateService = inject(AuthStateService);
  close = output<void>();

  email = signal('admin@edugen.com');
  password = signal('password'); // mock
  isLoading = signal(false);
  error = signal<string | null>(null);

  login(): void {
    if (this.isLoading() || !this.email() || !this.password()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);



    this.authService.login({ email: this.email(), password: this.password() })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.close.emit();
        },
        error: (err) => {
          this.error.set($localize`Login failed. Please try again.`);
          console.error(err);
        }
      });
  }
  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonLoggingIn:Logging in...`;
    } else {
      return $localize`:@@buttonLogIn:Log in to your account`;
    }
  });

  switchToRegister(): void {
    this.authState.setMode('register');
  }
}