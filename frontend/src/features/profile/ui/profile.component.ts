import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@entities/user';
import { UserService } from '@entities/user';
import { SessionStore } from '@shared/auth';

interface SocialLink {
  key: 'whatsappLink' | 'telegramLink' | 'instagramLink' | 'linkedinLink';
  name: string;
  icon: string;
  value: ReturnType<typeof signal<string>>;
  display: string | undefined;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly sessionStore = inject(SessionStore);

  isLoading = signal(true);
  loadError = signal(false);
  profile = signal<UserModel | null>(null);

  isEditing = signal(false);
  isSaving = signal(false);

  isOwnProfile = computed(() => this.sessionStore.currentUser()?._id === this.profile()?._id);

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
    firstName: signal(this.firstName().trim() ? [] : ['This is a required field.']),
    lastName: signal(this.lastName().trim() ? [] : ['This is a required field.']),
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
}
