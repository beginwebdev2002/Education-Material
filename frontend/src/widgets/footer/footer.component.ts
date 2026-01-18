import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { UserModel } from '@entities/user';
import { UserService } from '@entities/user/data-access/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink],
})
export class FooterComponent {
  // FIX: Added explicit type to authService to resolve 'unknown' type error.
  userService: UserStorageService = inject(UserStorageService);
  currentUser = this.userService.loadUser;
}