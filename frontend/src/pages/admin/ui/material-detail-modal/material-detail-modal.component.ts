import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Material, MaterialService, MaterialStatus } from '@entities/material';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';

@Component({
  selector: 'app-material-detail-modal',
  imports: [CommonModule, DatePipe, ModalComponent, TranslatePipe, TranslationLabelPipe],
  templateUrl: './material-detail-modal.component.html',
  styleUrls: ['./material-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDetailModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly materialService = inject(MaterialService);

  material = signal<Material | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.close();
      return;
    }
    this.materialService.getById(id).subscribe({
      next: (material) => {
        this.material.set(material);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set($localize`Material not found.`);
        this.isLoading.set(false);
      },
    });
  }

  setStatus(status: MaterialStatus): void {
    const current = this.material();
    if (!current) return;
    this.materialService.updateStatus(current._id, status).subscribe((updated) => this.material.set(updated));
  }

  download(): void {
    const current = this.material();
    if (current) this.materialService.download(current);
  }

  remove(): void {
    const current = this.material();
    if (!current || !confirm($localize`Delete "${current.title}"? This cannot be undone.`)) {
      return;
    }
    this.materialService.remove(current._id).subscribe(() => this.close());
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
