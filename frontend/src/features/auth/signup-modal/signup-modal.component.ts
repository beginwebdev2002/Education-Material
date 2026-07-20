import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { UserStorageService } from '@core/storage';
import { AuthService, AuthUiService, SignUpRequest } from '@features/auth';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { initialSignupForm, signupFormSchema } from './model/form.model';

@Component({
  selector: 'app-signup-modal',
  imports: [CommonModule, FormField, TranslatePipe],
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

  model = signal(initialSignupForm);
  form = form(this.model, signupFormSchema);

  error = signal<string | null>(null);

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.error.set(null);
      const payload: SignUpRequest = this.model();

      return new Promise<undefined>((resolve) => {
        this.authService.signup(payload).subscribe({
          next: (response) => {
            this.userStorageService.saveUser(response);
            this.close.emit();
            resolve(undefined);
          },
          error: (error) => {
            this.error.set(error);
            resolve(undefined);
          }
        });
      });
    });
  }

  buttonText = computed(() => {
    if (this.form().submitting()) {
      return this.i18n.translate('auth.signup.buttonCreating');
    } else {
      return this.i18n.translate('auth.signup.buttonCreate');
    }
  });

  switchToSignin(): void {
    this.authUi.setMode('signin');
  }
}
