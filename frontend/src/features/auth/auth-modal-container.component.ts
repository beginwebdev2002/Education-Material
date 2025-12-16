import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninModalComponent, SignupModalComponent, AuthUiService } from '@features/auth';
import { IllustrationComponent } from '@shared/ui';

@Component({
  selector: 'app-auth-modal-container',
  standalone: true,
  imports: [CommonModule, SigninModalComponent, SignupModalComponent, IllustrationComponent],
  templateUrl: './auth-modal-container.component.html',
  styleUrls: ['./auth-modal-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalContainerComponent {
  authState: AuthUiService = inject(AuthUiService);

  close(): void {
    this.authState.closeModal();
  }

  headerTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'signin') {
      return $localize`:@@AuthWelcomeBackTitle:Welcome Back!`;
    } else {
      return $localize`:@@AuthCreateAccountTitle:Create a New Account`;
    }
  });
  authModeTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'signin') {
      return $localize`:@@AuthNoAccountPrompt:Don't have an account?`;
    } else {
      return $localize`:@@AuthHaveAccountPrompt:Already have an account?`;
    }
  });
}