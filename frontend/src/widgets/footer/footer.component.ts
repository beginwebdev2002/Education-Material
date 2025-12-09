import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockAuthService } from '@entities/auth/auth.service';

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
  authService: MockAuthService = inject(MockAuthService);
  currentUser = this.authService.currentUser;
}