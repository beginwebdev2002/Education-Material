import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthUiService } from '@features/auth';
import { createValidationSignal, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { emailValidator } from '@shared/validation';
import { AuthService } from '@features/auth';

@Component({
  selector: 'app-signin-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninModalComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  private authService: AuthService = inject(AuthService);
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

  signin(): void {
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

    this.authService.signin({ email: this.email(), password: this.password() })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.close.emit();
        },
        error: (err) => {
          this.error.set($localize`Signin failed. Please try again.`);
          console.error(err);
        }
      });
  }
  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonLoggingIn:Logging in...`;
    } else {
      return $localize`:@@buttonSignin:Log in to your account`;
    }
  });

  switchToRegister(): void {
    this.authState.setMode('signup');
  }
}