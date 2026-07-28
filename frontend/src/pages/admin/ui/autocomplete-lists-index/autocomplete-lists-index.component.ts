import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AutocompleteList, AutocompleteListService } from '@entities/autocomplete';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';

@Component({
  selector: 'app-autocomplete-lists-index-page',
  imports: [CommonModule, RouterLink, TranslationLabelPipe, TranslatePipe],
  templateUrl: './autocomplete-lists-index.component.html',
  styleUrls: ['./autocomplete-lists-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteListsIndexComponent {
  private readonly autocompleteListService = inject(AutocompleteListService);
  private readonly router = inject(Router);
  private readonly i18n = inject(TranslationService);

  isLoading = signal(true);
  lists = signal<AutocompleteList[]>([]);
  total = signal(0);

  constructor() {
    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.load());
  }

  private load(): void {
    this.isLoading.set(true);
    this.autocompleteListService.adminList(1, 100).subscribe({
      next: (response) => {
        this.lists.set(response.items);
        this.total.set(response.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  remove(list: AutocompleteList): void {
    if (!confirm(this.i18n.translate('admin.autocomplete.listsIndex.confirmDeleteList', { key: list.key }))) {
      return;
    }
    this.autocompleteListService.remove(list._id).subscribe(() => this.load());
  }
}
