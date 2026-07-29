import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@entities/user';
import { UserService } from '@entities/user';
import { SessionStore } from '@shared/auth';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';

const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface SocialLink {
  key: 'whatsappLink' | 'telegramLink' | 'instagramLink' | 'linkedinLink';
  name: string;
  icon: string;
  value: ReturnType<typeof signal<string>>;
  display: string | undefined;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TitleCasePipe, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);
  private readonly i18n = inject(TranslationService);

  isLoading = signal(true);
  loadError = signal(false);
  profile = signal<UserModel | null>(null);

  isEditing = signal(false);
  isSaving = signal(false);

  isOwnProfile = computed(() => this.sessionStore.currentUser()?._id === this.profile()?._id);

  private readonly avatarInput = viewChild<ElementRef<HTMLInputElement>>('avatarInput');
  isUploadingAvatar = signal(false);
  avatarError = signal<string | null>(null);

  firstName = signal('');
  lastName = signal('');
  phoneNumber = signal('');
  country = signal('');

  private readonly whatsappLink = signal('');
  private readonly telegramLink = signal('');
  private readonly instagramLink = signal('');
  private readonly linkedinLink = signal('');

  socialMediaLinks = computed<SocialLink[]>(() => [
    { key: 'whatsappLink', name: 'WhatsApp', icon: 'fab fa-whatsapp', value: this.whatsappLink, display: this.profile()?.whatsappLink },
    { key: 'telegramLink', name: 'Telegram', icon: 'fab fa-telegram', value: this.telegramLink, display: this.profile()?.telegramLink },
    { key: 'instagramLink', name: 'Instagram', icon: 'fab fa-instagram', value: this.instagramLink, display: this.profile()?.instagramLink },
    { key: 'linkedinLink', name: 'LinkedIn', icon: 'fab fa-linkedin', value: this.linkedinLink, display: this.profile()?.linkedinLink },
  ]);

  formErrors = computed(() => ({
    firstName: signal(this.firstName().trim() ? [] : [this.i18n.translate('shared.validation.required')]),
    lastName: signal(this.lastName().trim() ? [] : [this.i18n.translate('shared.validation.required')]),
  }));

  hasErrors = computed(() => {
    const errors = this.formErrors();
    return errors.firstName().length > 0 || errors.lastName().length > 0;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.load(id);
      }
    });
  }

  private load(id: string): void {
    this.isLoading.set(true);
    this.loadError.set(false);
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  startEditing(): void {
    const user = this.profile();
    if (!user) {
      return;
    }
    this.firstName.set(user.firstName);
    this.lastName.set(user.lastName);
    this.phoneNumber.set(user.phoneNumber ?? '');
    this.country.set(user.country ?? '');
    this.whatsappLink.set(user.whatsappLink ?? '');
    this.telegramLink.set(user.telegramLink ?? '');
    this.instagramLink.set(user.instagramLink ?? '');
    this.linkedinLink.set(user.linkedinLink ?? '');
    this.isEditing.set(true);
  }

  saveProfile(): void {
    if (this.hasErrors()) {
      return;
    }
    this.isSaving.set(true);
    this.userService
      .updateProfile({
        firstName: this.firstName(),
        lastName: this.lastName(),
        phoneNumber: this.phoneNumber(),
        country: this.country(),
        whatsappLink: this.whatsappLink(),
        telegramLink: this.telegramLink(),
        instagramLink: this.instagramLink(),
        linkedinLink: this.linkedinLink(),
      })
      .subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.isSaving.set(false);
          this.isEditing.set(false);
        },
        error: () => this.isSaving.set(false),
      });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  triggerAvatarPicker(): void {
    this.avatarInput()?.nativeElement.click();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    this.avatarError.set(null);
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      this.avatarError.set(this.i18n.translate('profile.avatarErrorType'));
      return;
    }
    if (file.size > AVATAR_MAX_SIZE_BYTES) {
      this.avatarError.set(this.i18n.translate('profile.avatarErrorSize'));
      return;
    }

    this.isUploadingAvatar.set(true);
    this.userService.uploadAvatar(file).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.isUploadingAvatar.set(false);
      },
      error: () => {
        this.avatarError.set(this.i18n.translate('profile.avatarErrorFailed'));
        this.isUploadingAvatar.set(false);
      },
    });
  }
}
