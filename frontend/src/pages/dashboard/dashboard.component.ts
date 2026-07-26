import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Material, MaterialService } from '@entities/material';
import { IllustrationComponent } from '@shared/ui';
import { MaterialUploadFormComponent } from './ui/material-upload-form.component';
import { MyMaterialsListComponent } from './ui/my-materials-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IllustrationComponent, MaterialUploadFormComponent, MyMaterialsListComponent],
})
export class DashboardComponent {
  private readonly materialService = inject(MaterialService);

  myMaterials = signal<Material[]>([]);
  isLoadingMaterials = signal(true);

  constructor() {
    this.loadMyMaterials();
  }

  private loadMyMaterials(): void {
    this.isLoadingMaterials.set(true);
    this.materialService.mine(1, 50).subscribe({
      next: (response) => {
        this.myMaterials.set(response.items);
        this.isLoadingMaterials.set(false);
      },
      error: () => this.isLoadingMaterials.set(false),
    });
  }

  onUploaded(material: Material): void {
    this.myMaterials.update((list) => [material, ...list]);
  }

  onDownload(material: Material): void {
    this.materialService.download(material);
  }

  onDelete(material: Material): void {
    if (!confirm($localize`Delete "${material.title}"? This cannot be undone.`)) {
      return;
    }
    this.materialService.remove(material._id).subscribe(() => {
      this.myMaterials.update((list) => list.filter((m) => m._id !== material._id));
    });
  }
}
