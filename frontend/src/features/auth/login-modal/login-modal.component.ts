import { Component, ChangeDetectionStrategy, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MockAuthService } from '@entities/auth/auth.service';
import { AuthUiService } from '@features/auth/auth-ui.service';
import { createValidationSignal, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { emailValidator } from '@shared/validation/signal-validator';

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
  private authState: AuthUiService = inject(AuthUiService);
  close = output<void>();

  email = signal('admin@edugen.com');
  password = signal('password'); // mock
  isLoading = signal(false);
  error = signal<string | null>(null);

  touchedFields = signal<Set<string>>(new Set());

  formErrors = computed(() => {
    const errors = {
      email: createValidationSignal(this.email, [requiredValidator, minLengthValidator(3), maxLengthValidator(50), emailValidator]),
      password: createValidationSignal(this.password, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
    }
    return errors;
  });

  hasErrors = computed(() => {
    const errors = this.formErrors();
    return Object.values(errors).some(fieldErrors => fieldErrors().length > 0);
  });

  markTouched(field: string) {
    this.touchedFields.update(s => {
      const newSet = new Set(s);
      newSet.add(field);
      return newSet;
    });
  }

  isTouched(field: string) {
    return this.touchedFields().has(field);
  }

  login(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.hasErrors()) {
      this.touchedFields.set(new Set(['email', 'password']));
      return;
    }

    if (!this.email() || !this.password()) {
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