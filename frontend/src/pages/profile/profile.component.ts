import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '@entities/users/model/user.interface';
import { UserService } from '@entities/users/user.service';
import { AuthStateService } from '@features/auth/auth-state.service';
import { createValidationSignal, emailValidator, maxLengthValidator, minLengthValidator, requiredValidator } from '@shared/validation';
import { AuthResponse } from '@features/auth/models/signup.dto';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private authState: AuthStateService = inject(AuthStateService);
  private router: Router = inject(Router);

  firstName = signal('');
  lastName = signal('');
  github = signal('');
  linkedIn = signal('');
  telegram = signal('');
  instagram = signal('');
  whatsapp = signal('');


  formErrors = computed(() => {
    const errors = {
      firstName: createValidationSignal(this.firstName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
      lastName: createValidationSignal(this.lastName, [requiredValidator, minLengthValidator(3), maxLengthValidator(50)]),
      github: createValidationSignal(this.github, [maxLengthValidator(100)]),
      linkedIn: createValidationSignal(this.linkedIn, [maxLengthValidator(100)]),
      telegram: createValidationSignal(this.telegram, [maxLengthValidator(100)]),
      instagram: createValidationSignal(this.instagram, [maxLengthValidator(100)]),
      whatsapp: createValidationSignal(this.whatsapp, [maxLengthValidator(100)]),
    }
    return errors;
  })
  isEditing = signal(false);
  currentUser = signal<User | null>(this.authState.currentUser());

  socialMediaLinks = computed(() => [
    { key: 'github', name: 'GitHub', icon: 'fab fa-github', value: this.currentUser()?.github },
    { key: 'linkedIn', name: 'LinkedIn', icon: 'fab fa-linkedin', value: this.currentUser()?.linkedIn },
    { key: 'telegram', name: 'Telegram', icon: 'fab fa-telegram', value: this.currentUser()?.telegram },
    { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', value: this.currentUser()?.instagram },
    { key: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', value: this.currentUser()?.whatsapp },
  ]);

  hasErrors = computed(() => {
    const errors = this.formErrors();
    return Object.values(errors).some(fieldErrors => {
      return fieldErrors().length > 0
    });
  });

  private loadUser() {
    const idUser = localStorage.getItem('userId');
    if (!idUser) {
      this.router.navigate(['/']);
      return;
    }
    this.userService.findUserById(idUser)
      .subscribe((user: AuthResponse) => {
        this.userValueInitializer();
        this.currentUser.set(user);
      });
  }

  private userValueInitializer() {
    this.firstName.set(this.currentUser()?.firstName || '');
    this.lastName.set(this.currentUser()?.lastName || '');
    this.github.set(this.currentUser()?.github || '');
    this.linkedIn.set(this.currentUser()?.linkedIn || '');
    this.telegram.set(this.currentUser()?.telegram || '');
    this.instagram.set(this.currentUser()?.instagram || '');
    this.whatsapp.set(this.currentUser()?.whatsapp || '');
  }
  ngOnInit(): void {
    this.loadUser();
    this.userValueInitializer();
  }

  saveProfile(): void {
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}