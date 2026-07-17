import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { emailValidator, firstError, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, TitleCasePipe, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private userStorage: UserStorageService = inject(UserStorageService);
  private router: Router = inject(Router);

  protected readonly firstError = firstError;

  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [requiredValidator(), minLengthValidator(3), maxLengthValidator(50)] }),
    email: new FormControl('', { nonNullable: true, validators: [requiredValidator(), emailValidator()] }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    citizenship: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
    github: new FormControl('', { nonNullable: true, validators: [maxLengthValidator(100)] }),
    linkedIn: new FormControl('', { nonNullable: true, validators: [maxLengthValidator(100)] }),
    telegram: new FormControl('', { nonNullable: true, validators: [maxLengthValidator(100)] }),
    instagram: new FormControl('', { nonNullable: true, validators: [maxLengthValidator(100)] }),
    whatsapp: new FormControl('', { nonNullable: true, validators: [maxLengthValidator(100)] }),
  });

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
    this.form.reset({
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

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.currentUser();
    if (!user) {
      return;
    }
    this.userStorage.saveUser({ ...user, ...this.form.getRawValue() });
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}
