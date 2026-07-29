import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@shared/pipes';

/**
 * Layout shell for an admin list page's search/filter controls. Owns no domain
 * knowledge - callers project their own search box and filter fields via ng-content.
 */
@Component({
  selector: 'app-list-filter-sidebar',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-filter-sidebar.component.html',
  styleUrls: ['./list-filter-sidebar.component.scss'],
})
export class ListFilterSidebarComponent {
  isOpen = signal(true);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }
}
