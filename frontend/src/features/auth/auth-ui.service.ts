import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthUiService {
  isModalOpen = signal(false);
  mode = signal<'login' | 'register'>('login');

  openModal(initialMode: 'login' | 'register' = 'login'): void {
    this.mode.set(initialMode);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
  }
}
