import { AfterViewInit, Component, ChangeDetectionStrategy, ElementRef, OnDestroy, inject, computed, effect, forwardRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'flowbite';
import { SigninModalComponent } from './signin-modal/signin-modal.component';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { AuthUiService } from '../model/auth-ui.service';
import { IllustrationComponent } from '@shared/ui';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-auth-modal-container',
  imports: [CommonModule, forwardRef(() => SigninModalComponent), forwardRef(() => SignupModalComponent), IllustrationComponent, TranslatePipe],
  templateUrl: './auth-modal-container.component.html',
  styleUrls: ['./auth-modal-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalContainerComponent implements AfterViewInit, OnDestroy {
  authState: AuthUiService = inject(AuthUiService);
  private i18n: TranslationService = inject(TranslationService);

  private readonly modalRootRef = viewChild.required<ElementRef<HTMLDivElement>>('modalRoot');
  private modal?: Modal;

  constructor() {
    effect(() => {
      const isOpen = this.authState.isModalOpen();
      if (isOpen) {
        this.modal?.show();
      } else {
        this.modal?.hide();
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalRootRef().nativeElement, {
      onHide: () => this.authState.closeModal(),
    });
  }

  ngOnDestroy(): void {
    this.modal?.destroy();
  }

  close(): void {
    this.modal?.hide();
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
