import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';

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
  authService: AuthService = inject(AuthService);
  currentUser = this.authService.currentUser;
}