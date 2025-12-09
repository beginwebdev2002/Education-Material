import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MockMaterialService } from '@shared/services/material.service';
import { Material } from '@shared/models/material.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-materials-control-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materials-control.page.component.html',
  styleUrls: ['./materials-control.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsControlPageComponent {
  // FIX: Added explicit type to materialService to resolve 'unknown' type error.
  private materialService: MockMaterialService = inject(MockMaterialService);
  private allMaterials = this.materialService.materials;

  searchTerm = signal('');

  filteredMaterials = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allMaterials();
    return this.allMaterials().filter(material =>
      material.title.toLowerCase().includes(term) ||
      material.authorName.toLowerCase().includes(term)
    );
  });
}