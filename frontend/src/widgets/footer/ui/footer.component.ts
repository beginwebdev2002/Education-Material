import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
<<<<<<< HEAD:frontend/src/widgets/footer/footer.component.ts
import { SessionStore } from '@shared/auth';
=======
import { UserStorageService } from '@core/storage';
import { TranslatePipe } from '@shared/pipes';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/widgets/footer/ui/footer.component.ts

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
})
export class FooterComponent {
<<<<<<< HEAD:frontend/src/widgets/footer/footer.component.ts
  private readonly sessionStore = inject(SessionStore);
  currentUser = this.sessionStore.currentUser;
}
=======
  // FIX: Added explicit type to authService to resolve 'unknown' type error.
  userService: UserStorageService = inject(UserStorageService);
  currentUser = this.userService.loadUser();
}
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/widgets/footer/ui/footer.component.ts
