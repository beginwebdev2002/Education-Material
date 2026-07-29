import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Material, MaterialService, MaterialStatus } from '@entities/material';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { IconButtonComponent, PaginationComponent, SearchInputComponent } from '@shared/ui';
import { ListFilterSidebarComponent } from '@widgets/admin';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-materials-control-page',
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    TranslationLabelPipe,
    PaginationComponent,
    SearchInputComponent,
    ListFilterSidebarComponent,
    IconButtonComponent,
  ],
  templateUrl: './materials-control.component.html',
  styleUrls: ['./materials-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsControlComponent {
  private readonly materialService = inject(MaterialService);
  private readonly router = inject(Router);
  private readonly i18n = inject(TranslationService);

  isLoading = signal(true);
  materials = signal<Material[]>([]);
  total = signal(0);
  page = signal(1);
  limit = PAGE_SIZE;
  searchTerm = signal('');
  statusFilter = signal<MaterialStatus | ''>('');

  constructor() {
    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.load());
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.load();
  }

  onStatusFilterChange(status: MaterialStatus | ''): void {
    this.statusFilter.set(status);
    this.page.set(1);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.materialService
      .adminList({ search: this.searchTerm(), status: this.statusFilter() || undefined, page: this.page(), limit: this.limit })
      .subscribe({
        next: (response) => {
          this.materials.set(response.items);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  setStatus(material: Material, status: MaterialStatus): void {
    this.materialService.updateStatus(material._id, status).subscribe((updated) => {
      this.materials.update((list) => list.map((m) => (m._id === updated._id ? updated : m)));
    });
  }

  remove(material: Material): void {
    if (!confirm(this.i18n.translate('admin.materialsControl.confirmDelete', { title: material.title }))) {
      return;
    }
    this.materialService.remove(material._id).subscribe(() => {
      this.materials.update((list) => list.filter((m) => m._id !== material._id));
    });
  }

  download(material: Material): void {
    this.materialService.download(material);
  }
}
