import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Field, form, submit } from '@angular/forms/signals';
import { UserService } from '@entities/user';
import { initialProfileForm, profileFormSchema } from '../../model/user-profile-form.model';
import { SessionStore } from '@shared/auth';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-user-profile-page',
  imports: [CommonModule, Field, TranslatePipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);
  private readonly i18n = inject(TranslationService);

  model = signal(initialProfileForm);
  form = form(this.model, profileFormSchema);

  isLoading = signal(true);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.model.set({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber ?? '',
          country: user.country ?? '',
          linkedinLink: user.linkedinLink ?? '',
          telegramLink: user.telegramLink ?? '',
          instagramLink: user.instagramLink ?? '',
          whatsappLink: user.whatsappLink ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.isSaving.set(true);
      this.successMessage.set(null);
      this.errorMessage.set(null);

      const { email, ...editable } = this.model();
      void email;
      // omit blank optional fields entirely — sending '' still triggers each
      // field's format validators (@IsOptional only skips undefined, not '').
      const payload = Object.fromEntries(
        Object.entries(editable).filter(([key, value]) => key === 'firstName' || key === 'lastName' || value !== ''),
      );

      this.userService.updateProfile(payload).subscribe({
        next: (updated) => {
          this.sessionStore.setSession(updated);
          this.isSaving.set(false);
          this.successMessage.set(this.i18n.translate('admin.userProfile.successMessage'));
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message ?? this.i18n.translate('admin.userProfile.errorFailed'));
        },
      });

      return undefined;
    });
  }
}
