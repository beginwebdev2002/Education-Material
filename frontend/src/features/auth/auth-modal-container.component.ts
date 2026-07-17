import { Component, ChangeDetectionStrategy, inject, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninModalComponent, SignupModalComponent, AuthUiService } from '@features/auth';
import { IllustrationComponent } from '@shared/ui';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-auth-modal-container',
  imports: [CommonModule, forwardRef(() => SigninModalComponent), forwardRef(() => SignupModalComponent), IllustrationComponent, TranslatePipe],
  templateUrl: './auth-modal-container.component.html',
  styleUrls: ['./auth-modal-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalContainerComponent {
  authState: AuthUiService = inject(AuthUiService);
  private i18n: TranslationService = inject(TranslationService);

  close(): void {
    this.authState.closeModal();
  }

  headerTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'signin') {
      return this.i18n.translate('auth.modal.welcomeBack');
    } else {
      return this.i18n.translate('auth.modal.createAccountTitle');
    }
  });
  authModeTitle = computed(() => {
    const currentMode = this.authState.mode();
    if (currentMode === 'signin') {
      return this.i18n.translate('auth.modal.noAccountPrompt');
    } else {
      return this.i18n.translate('auth.modal.haveAccountPrompt');
    }
  });
}