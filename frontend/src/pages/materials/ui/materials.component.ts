import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Material, MaterialService } from '@entities/material';
import { SessionStore } from '@shared/auth';
import { SkeletonLoaderComponent } from '@shared/ui';
import { IllustrationComponent } from '@shared/ui';
import { MaterialCommentsComponent } from './material-comments.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent, IllustrationComponent, MaterialCommentsComponent],
})
export class MaterialsComponent {
  private readonly materialService = inject(MaterialService);
  private readonly sessionStore = inject(SessionStore);

  isLoading = signal(true);
  isLoadingMore = signal(false);
  searchTerm = signal('');
  sortBy = signal<'downloads' | 'date'>('date');
  materials = signal<Material[]>([]);
  page = signal(1);
  total = signal(0);
  expandedMaterialId = signal<string | null>(null);

  isAuthenticated = this.sessionStore.isAuthenticated;

  skeletonItems = Array(6).fill(0);

  hasMore = computed(() => this.materials().length < this.total());

  constructor() {
    this.fetch(1, true);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.fetch(1, true);
  }

  onSortChange(sortBy: 'downloads' | 'date'): void {
    this.sortBy.set(sortBy);
    this.fetch(1, true);
  }

  loadMore(): void {
    if (!this.hasMore() || this.isLoadingMore()) {
      return;
    }
    this.fetch(this.page() + 1, false);
  }

  private fetch(page: number, replace: boolean): void {
    replace ? this.isLoading.set(true) : this.isLoadingMore.set(true);

    this.materialService.list({ search: this.searchTerm(), sortBy: this.sortBy(), page, limit: 12 }).subscribe({
      next: (response) => {
        this.materials.update((current) => (replace ? response.items : [...current, ...response.items]));
        this.total.set(response.total);
        this.page.set(response.page);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  toggleComments(material: Material): void {
    this.expandedMaterialId.set(this.expandedMaterialId() === material._id ? null : material._id);
  }

  onCommentsCountChanged(material: Material, delta: number): void {
    this.materials.update((list) =>
      list.map((m) => (m._id === material._id ? { ...m, commentsCount: m.commentsCount + delta } : m)),
    );
  }

  download(material: Material): void {
    this.materialService.download(material);
  }
}
