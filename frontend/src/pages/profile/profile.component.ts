import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserService } from '@entities/user';
import { UserModel } from '@entities/user';
import { SessionStore } from '@shared/auth';
import { createValidationSignal, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);

  id = input.required<string>();

  profile = signal<UserModel | null>(null);
  isLoading = signal(true);
  loadError = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);

  isOwnProfile = computed(() => this.sessionStore.currentUser()?._id === this.id());

  firstName = signal('');
  lastName = signal('');
  phoneNumber = signal('');
  country = signal('');
  telegramLink = signal('');
  instagramLink = signal('');
  linkedinLink = signal('');
  whatsappLink = signal('');

  formErrors = computed(() => ({
    firstName: createValidationSignal(this.firstName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
    lastName: createValidationSignal(this.lastName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
  }));

  hasErrors = computed(() => Object.values(this.formErrors()).some(fieldErrors => fieldErrors().length > 0));

  socialMediaLinks = computed(() => [
    { key: 'telegramLink', name: 'Telegram', icon: 'fab fa-telegram', value: this.telegramLink, display: this.profile()?.telegramLink },
    { key: 'instagramLink', name: 'Instagram', icon: 'fab fa-instagram', value: this.instagramLink, display: this.profile()?.instagramLink },
    { key: 'linkedinLink', name: 'LinkedIn', icon: 'fab fa-linkedin', value: this.linkedinLink, display: this.profile()?.linkedinLink },
    { key: 'whatsappLink', name: 'WhatsApp', icon: 'fab fa-whatsapp', value: this.whatsappLink, display: this.profile()?.whatsappLink },
  ]);

  constructor() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.loadError.set(false);
    this.userService.getById(this.id()).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.resetFormFromProfile(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private resetFormFromProfile(user: UserModel): void {
    this.firstName.set(user.firstName);
    this.lastName.set(user.lastName);
    this.phoneNumber.set(user.phoneNumber ?? '');
    this.country.set(user.country ?? '');
    this.telegramLink.set(user.telegramLink ?? '');
    this.instagramLink.set(user.instagramLink ?? '');
    this.linkedinLink.set(user.linkedinLink ?? '');
    this.whatsappLink.set(user.whatsappLink ?? '');
  }

  startEditing(): void {
    const current = this.profile();
    if (current) {
      this.resetFormFromProfile(current);
    }
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    const current = this.profile();
    if (current) {
      this.resetFormFromProfile(current);
    }
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.hasErrors() || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.userService.updateProfile({
      firstName: this.firstName(),
      lastName: this.lastName(),
      phoneNumber: this.phoneNumber() || undefined,
      country: this.country() || undefined,
      telegramLink: this.telegramLink() || undefined,
      instagramLink: this.instagramLink() || undefined,
      linkedinLink: this.linkedinLink() || undefined,
      whatsappLink: this.whatsappLink() || undefined,
    }).pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.isEditing.set(false);
        },
      });
  }
}
