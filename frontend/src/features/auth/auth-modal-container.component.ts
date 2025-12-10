import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from './auth-state.service';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { IllustrationComponent } from '@shared/ui/illustration/illustration.component';

@Component({
  selector: 'app-auth-modal-container',
  standalone: true,
  imports: [CommonModule, LoginModalComponent, SignupModalComponent, IllustrationComponent],
  templateUrl: './auth-modal-container.component.html',
  styleUrls: ['./auth-modal-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalContainerComponent {
  authState: AuthStateService = inject(AuthStateService);

  close(): void {
    this.authState.closeModal();
  }

  headerTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'login') {
      return $localize`:@@AuthWelcomeBackTitle:Welcome Back!`;
    } else {
      return $localize`:@@AuthCreateAccountTitle:Create a New Account`;
    }
  });
  authModeTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'login') {
      return $localize`:@@AuthNoAccountPrompt:Don't have an account?`;
    } else {
      return $localize`:@@AuthHaveAccountPrompt:Already have an account?`;
    }
  });
}