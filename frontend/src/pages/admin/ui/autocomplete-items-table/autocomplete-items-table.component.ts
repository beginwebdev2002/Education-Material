import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import {
  AutocompleteItem,
  AutocompleteItemService,
  AutocompleteItemSelectComponent,
  AutocompleteList,
  AutocompleteListService,
} from '@entities/autocomplete';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { IconButtonComponent, PaginationComponent, SearchInputComponent } from '@shared/ui';
import { ListFilterSidebarComponent } from '@widgets/admin';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-autocomplete-items-table-page',
  imports: [
    CommonModule,
    RouterLink,
    AutocompleteItemSelectComponent,
    TranslationLabelPipe,
    TranslatePipe,
    PaginationComponent,
    SearchInputComponent,
    ListFilterSidebarComponent,
    IconButtonComponent,
  ],
  templateUrl: './autocomplete-items-table.component.html',
  styleUrls: ['./autocomplete-items-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteItemsTableComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autocompleteListService = inject(AutocompleteListService);
  private readonly autocompleteItemService = inject(AutocompleteItemService);
  private readonly i18n = inject(TranslationService);

  listId = signal('');
  list = signal<AutocompleteList | null>(null);

  isLoading = signal(true);
  items = signal<AutocompleteItem[]>([]);
  total = signal(0);
  page = signal(1);
  limit = PAGE_SIZE;
  searchTerm = signal('');

  allLists = signal<AutocompleteList[]>([]);
  filterListKey = signal('');
  filterParentItemId = signal<string | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('listId') ?? '';
    this.listId.set(id);

    this.autocompleteListService.getById(id).subscribe((list) => this.list.set(list));
    this.autocompleteListService.adminList(1, 100).subscribe((response) => this.allLists.set(response.items));

    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.load());
  }

  private load(): void {
    this.isLoading.set(true);
    this.autocompleteItemService
      .adminList({
        listId: this.listId(),
        parentItem: this.filterParentItemId() ?? undefined,
        search: this.searchTerm(),
        page: this.page(),
        limit: this.limit,
      })
      .subscribe({
        next: (response) => {
          this.items.set(response.items);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.page.set(1);
    this.load();
  }

  onFilterListChange(key: string): void {
    this.filterListKey.set(key);
    this.filterParentItemId.set(null);
    this.page.set(1);
    this.load();
  }

  onFilterParentSelected(item: AutocompleteItem | null): void {
    this.filterParentItemId.set(item?._id ?? null);
    this.page.set(1);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  remove(item: AutocompleteItem): void {
    if (!confirm(this.i18n.translate('admin.autocomplete.itemsTable.confirmDeleteItem'))) {
      return;
    }
    this.autocompleteItemService.remove(item._id).subscribe(() => this.load());
  }

  parentItemLabel(parent: AutocompleteItem | string): string {
    if (typeof parent === 'string') {
      return '';
    }
    const translations = parent.translations;
    return translations[this.i18n.locale()] || translations.en || '';
  }

  metadataSummary(item: AutocompleteItem): string {
    if (!item.metadata || Object.keys(item.metadata).length === 0) {
      return '';
    }
    return Object.entries(item.metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
}
