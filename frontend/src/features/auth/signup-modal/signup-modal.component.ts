import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService, AuthUiService, SignUpRequest } from '@features/auth';
import { createValidationSignal, emailValidator, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupModalComponent {
  close = output<void>();

  private readonly authService = inject(AuthService);
  private readonly authUi = inject(AuthUiService);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  touchedFields = signal<Set<string>>(new Set());

  formErrors = computed(() => ({
    firstName: createValidationSignal(this.firstName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
    lastName: createValidationSignal(this.lastName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
    email: createValidationSignal(this.email, [requiredValidator, minLengthValidator(3), maxLengthValidator(50), emailValidator]),
    password: createValidationSignal(this.password, [requiredValidator, minLengthValidator(8), maxLengthValidator(50)]),
  }));

  hasErrors = computed(() => {
    const errors = this.formErrors();
    return Object.values(errors).some((fieldErrors) => fieldErrors().length > 0);
  });

  buttonText = computed(() => {
    if (this.isLoading()) {
      return $localize`:@@buttonCreatingAccount|Текст кнопки, когда идет процесс регистрации:Creating account...`;
    }
    return $localize`:@@buttonCreateAccount|Текст кнопки для начала регистрации:Create account`;
  });

  markTouched(field: string) {
    this.touchedFields.update((s) => new Set(s).add(field));
  }

  isTouched(field: string) {
    return this.touchedFields().has(field);
  }

  signupSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.hasErrors()) {
      this.touchedFields.set(new Set(['firstName', 'lastName', 'email', 'password']));
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const payload: SignUpRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
    };

    this.authService
      .signup(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.close.emit(),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.message ?? $localize`Registration failed. Please try again.`);
        },
      });
  }

  switchToSignin(): void {
    this.authUi.setMode('signin');
  }
}
