import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthUiService } from '@features/auth';
import { AuthService } from '@features/auth';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { initialSigninForm, signinFormSchema } from './model/form.model';

@Component({
  selector: 'app-signin-modal',
  imports: [CommonModule, FormField, TranslatePipe],
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninModalComponent {
  private authService: AuthService = inject(AuthService);
  private authState: AuthUiService = inject(AuthUiService);
  private i18n: TranslationService = inject(TranslationService);
  close = output<void>();

  model = signal(initialSigninForm);
  form = form(this.model, signinFormSchema);

  error = signal<string | null>(null);

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.error.set(null);
      try {
        await firstValueFrom(this.authService.signin(this.model()));
        this.close.emit();
      } catch (err) {
        this.error.set(this.i18n.translate('auth.signin.errorFailed'));
        console.error(err);
      }
      return undefined;
    });
  }

  buttonText = computed(() => {
    if (this.form().submitting()) {
      return this.i18n.translate('auth.signin.buttonLoggingIn');
    } else {
      return this.i18n.translate('auth.signin.buttonSignin');
    }
  });

  switchToRegister(): void {
    this.authState.setMode('signup');
  }
}
