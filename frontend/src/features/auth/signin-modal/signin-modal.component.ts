import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthUiService } from '@features/auth';
import { emailValidator, firstError, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { AuthService } from '@features/auth';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-signin-modal',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
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

  protected readonly firstError = firstError;

  form = new FormGroup({
    email: new FormControl('admin@edugen.tj', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50), emailValidator()],
    }),
    password: new FormControl('3255443345', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)],
    }),
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  signin(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.signin({ email, password })
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
