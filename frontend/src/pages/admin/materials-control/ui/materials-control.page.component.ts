import { CommonModule } from '@angular/common';
<<<<<<< HEAD:frontend/src/pages/admin/materials-control/materials-control.page.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Material, MaterialService, MaterialStatus } from '@entities/material';
=======
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MockMaterialService } from '@shared/services';

>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/pages/admin/materials-control/ui/materials-control.page.component.ts

@Component({
  selector: 'app-materials-control-page',
  imports: [CommonModule],
  templateUrl: './materials-control.page.component.html',
  styleUrls: ['./materials-control.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsControlPageComponent {
  private readonly materialService = inject(MaterialService);

  isLoading = signal(true);
  materials = signal<Material[]>([]);
  total = signal(0);
  searchTerm = signal('');
  statusFilter = signal<MaterialStatus | ''>('');

  constructor() {
    this.load();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.load();
  }

  onStatusFilterChange(status: MaterialStatus | ''): void {
    this.statusFilter.set(status);
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.materialService
      .adminList({ search: this.searchTerm(), status: this.statusFilter() || undefined, page: 1, limit: 50 })
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
    if (!confirm($localize`Delete "${material.title}"? This cannot be undone.`)) {
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
