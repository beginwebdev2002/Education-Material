import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { TranslationLabelPipe } from '@shared/pipes';
import { AutocompleteItemService } from '../api/autocomplete-item.service';
import { AutocompleteItem } from '../model/autocomplete-item.model';

@Component({
    selector: 'app-autocomplete-item-select',
    imports: [TranslationLabelPipe],
    templateUrl: './item-select.component.html',
    styleUrls: ['./item-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteItemSelectComponent {
    private readonly itemService = inject(AutocompleteItemService);

    listKey = input.required<string>();
    parentItemId = input<string | null>(null);
    placeholder = input<string>('');
    disabled = input<boolean>(false);
    selectId = input<string>('');

    selected = output<AutocompleteItem | null>();

    items = signal<AutocompleteItem[]>([]);
    selectedId = signal('');
    isLoading = signal(false);

    constructor() {
        effect(() => {
            const listKey = this.listKey();
            const parentItemId = this.parentItemId();

            this.selectedId.set('');
            this.selected.emit(null);
            this.isLoading.set(true);

            this.itemService
                .publicItemsByKey({ listKey, parentItem: parentItemId ?? undefined })
                .subscribe({
                    next: (response) => {
                        this.items.set(response.items);
                        this.isLoading.set(false);
                    },
                    error: () => {
                        this.items.set([]);
                        this.isLoading.set(false);
                    },
                });
        });
    }

    onChange(event: Event): void {
        const id = (event.target as HTMLSelectElement).value;
        this.selectedId.set(id);
        const item = this.items().find((i) => i._id === id) ?? null;
        this.selected.emit(item);
    }
}
