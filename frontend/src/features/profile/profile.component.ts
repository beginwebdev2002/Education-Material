import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { initialProfileForm, profileFormSchema } from './model/form.model';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, TitleCasePipe, FormField],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private userStorage: UserStorageService = inject(UserStorageService);
  private router: Router = inject(Router);

  model = signal(initialProfileForm);
  form = form(this.model, profileFormSchema);

  isEditing = signal(false);
  currentUser = this.userStorage.loadUser();

  socialMediaLinks = computed(() => [
    { key: 'github' as const, name: 'GitHub', icon: 'fab fa-github', value: this.currentUser()?.github },
    { key: 'linkedIn' as const, name: 'LinkedIn', icon: 'fab fa-linkedin', value: this.currentUser()?.linkedIn },
    { key: 'telegram' as const, name: 'Telegram', icon: 'fab fa-telegram', value: this.currentUser()?.telegram },
    { key: 'instagram' as const, name: 'Instagram', icon: 'fab fa-instagram', value: this.currentUser()?.instagram },
    { key: 'whatsapp' as const, name: 'WhatsApp', icon: 'fab fa-whatsapp', value: this.currentUser()?.whatsapp },
  ]);

  private loadUser() {
    if (!this.currentUser()) {
      this.router.navigate(['/']);
    }
  }

  private syncFormFromUser(): void {
    const user = this.currentUser();
    this.model.set({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      citizenship: user?.citizenship || '',
      bio: user?.bio || '',
      github: user?.github || '',
      linkedIn: user?.linkedIn || '',
      telegram: user?.telegram || '',
      instagram: user?.instagram || '',
      whatsapp: user?.whatsapp || '',
    });
  }

  ngOnInit(): void {
    this.loadUser();
    this.syncFormFromUser();
  }

  startEditing(): void {
    this.syncFormFromUser();
    this.isEditing.set(true);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const user = this.currentUser();
      if (!user) {
        return undefined;
      }
      this.userStorage.saveUser({ ...user, ...this.model() });
      this.isEditing.set(false);
      return undefined;
    });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}
