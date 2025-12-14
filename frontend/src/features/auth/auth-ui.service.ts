import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthUiService {
  isModalOpen = signal(false);
  mode = signal<'signin' | 'signup'>('signin');

  openModal(initialMode: 'signin' | 'signup' = 'signin'): void {
    this.mode.set(initialMode);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  setMode(mode: 'signin' | 'signup'): void {
    this.mode.set(mode);
  }
}
