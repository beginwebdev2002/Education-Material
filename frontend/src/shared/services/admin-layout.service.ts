import { Injectable } from '@angular/core';
import type { Drawer } from 'flowbite';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
  private drawer?: Drawer;

  registerDrawer(drawer: Drawer): void {
    this.drawer = drawer;
  }

  toggleSidebar(): void {
    this.drawer?.toggle();
  }

  closeSidebar(): void {
    this.drawer?.hide();
  }
}
