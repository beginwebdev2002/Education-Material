import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionStore } from '@shared/auth';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
})
export class FooterComponent {
  private readonly sessionStore = inject(SessionStore);
  currentUser = this.sessionStore.currentUser;
}
