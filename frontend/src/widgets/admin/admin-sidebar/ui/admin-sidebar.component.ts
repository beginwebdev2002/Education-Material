import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Drawer } from 'flowbite';
import { AdminLayoutService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes';
import { ADMIN_NAV_LINKS } from '../config/admin-nav-links';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent implements AfterViewInit, OnDestroy {
  layoutService = inject(AdminLayoutService);
  navLinks = ADMIN_NAV_LINKS;

  private readonly sidebarRef = viewChild.required<ElementRef<HTMLElement>>('sidebar');
  private drawer?: Drawer;

  ngAfterViewInit(): void {
    this.drawer = new Drawer(this.sidebarRef().nativeElement, { placement: 'left' });
    this.layoutService.registerDrawer(this.drawer);
  }

  ngOnDestroy(): void {
    this.drawer?.destroy();
  }

  closeSidebar(): void {
    this.layoutService.closeSidebar();
  }
}
