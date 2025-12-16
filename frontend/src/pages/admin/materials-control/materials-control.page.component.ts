import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockMaterialService } from '@shared/services';


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