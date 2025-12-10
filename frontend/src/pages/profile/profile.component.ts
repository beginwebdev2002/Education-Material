import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '@entities/users/model/user.interface';
import { UserService } from '@shared/services/user.service';


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
  private router: Router = inject(Router);


  formErrors = computed(() => {
  })
  isEditing = signal(false);
  currentUser = signal<User | null>(this.userService.currentUser());

  socialMediaLinks = computed(() => [
    { key: 'github', name: 'GitHub', icon: 'fab fa-github', value: this.currentUser()?.github },
    { key: 'linkedIn', name: 'LinkedIn', icon: 'fab fa-linkedin', value: this.currentUser()?.linkedIn },
    { key: 'telegram', name: 'Telegram', icon: 'fab fa-telegram', value: this.currentUser()?.telegram },
    { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', value: this.currentUser()?.instagram },
    { key: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', value: this.currentUser()?.whatsapp },
  ]);

  private loadUser() {
    const idUser = localStorage.getItem('userId');
    if (!idUser) {
      this.router.navigate(['/']);
      return;
    }
    this.userService.findUserById(idUser).subscribe(user => {
      this.currentUser.set(user);
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  saveProfile(): void {
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}