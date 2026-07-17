import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthUiService } from '@features/auth';
import { createValidationSignal, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { emailValidator } from '@shared/validation';
import { AuthService } from '@features/auth';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-signin-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninModalComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  private authService: AuthService = inject(AuthService);
  private authState: AuthUiService = inject(AuthUiService);
  private i18n: TranslationService = inject(TranslationService);
  close = output<void>();

  email = signal('admin@edugen.tj');
  password = signal('3255443345');
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
          this.error.set(this.i18n.translate('auth.signin.errorFailed'));
          console.error(err);
        }
      });
  }
  buttonText = computed(() => {
    if (this.isLoading()) {
      return this.i18n.translate('auth.signin.buttonLoggingIn');
    } else {
      return this.i18n.translate('auth.signin.buttonSignin');
    }
  });

  switchToRegister(): void {
    this.authState.setMode('signup');
  }
}