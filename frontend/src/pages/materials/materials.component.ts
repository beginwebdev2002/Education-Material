import { Component, ChangeDetectionStrategy, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockMaterialService } from '@shared/services';
import { SkeletonLoaderComponent } from '@shared/ui';
import { IllustrationComponent } from '@shared/ui';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SkeletonLoaderComponent, IllustrationComponent],
})
export class MaterialsComponent implements OnInit {
  // FIX: Added explicit type to materialService to resolve 'unknown' type error.
  private materialService: MockMaterialService = inject(MockMaterialService);

  private allMaterials = this.materialService.materials;

  isLoading = signal(true);
  searchTerm = signal('');
  sortBy = signal<'rating' | 'downloads'>('rating');

  // A dummy array for rendering skeleton loaders
  skeletonItems = Array(6).fill(0);

  filteredMaterials = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sortKey = this.sortBy();

    return this.allMaterials()
      .filter(material => material.title.toLowerCase().includes(term))
      .sort((a, b) => b[sortKey] - a[sortKey]);
  });

  ngOnInit(): void {
    // Simulate network delay
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}