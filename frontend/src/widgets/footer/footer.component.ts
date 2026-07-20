import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
})
export class FooterComponent {
  // FIX: Added explicit type to authService to resolve 'unknown' type error.
  userService: UserStorageService = inject(UserStorageService);
  currentUser = this.userService.loadUser();
}