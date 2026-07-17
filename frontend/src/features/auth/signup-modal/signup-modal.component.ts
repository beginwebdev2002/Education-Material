import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserStorageService } from '@core/storage';
import { AuthService, AuthUiService, SignUpRequest } from '@features/auth';
import { emailValidator, firstError, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-signup-modal',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  providers: [AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupModalComponent {
  // outputs
  close = output<void>();

  // dependencies
  private authService: AuthService = inject(AuthService);
  private userStorageService: UserStorageService = inject(UserStorageService);
  private authUi: AuthUiService = inject(AuthUiService);
  private i18n: TranslationService = inject(TranslationService);

  protected readonly firstError = firstError;

  form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50), emailValidator()],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)],
    }),
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  signupSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const payload: SignUpRequest = this.form.getRawValue();

    this.authService.signup(payload)
      .subscribe({
        next: (response) => {
          this.userStorageService.saveUser(response);
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set(error);
        }
      })
  }

  buttonText = computed(() => {
    if (this.isLoading()) {
      return this.i18n.translate('auth.signup.buttonCreating');
    } else {
      return this.i18n.translate('auth.signup.buttonCreate');
    }
  });

  switchToSignin(): void {
    this.authUi.setMode('signin');
  }
}
