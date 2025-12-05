import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
  isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(isOpen => !isOpen);
  }

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
