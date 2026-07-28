import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, form, submit } from '@angular/forms/signals';
import {
  AutocompleteItem,
  AutocompleteItemService,
  AutocompleteList,
  AutocompleteListService,
  InstitutionType,
  SubjectKind,
} from '@entities/autocomplete';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { autocompleteItemFormSchema, initialAutocompleteItemForm } from './model/autocomplete-item-form.model';

const INSTITUTIONS_LIST_KEY = 'educational-institutions';
const SUBJECTS_LIST_KEY = 'subjects-specializations';

@Component({
  selector: 'app-autocomplete-item-form-modal',
  imports: [CommonModule, Field, ModalComponent, TranslationLabelPipe, TranslatePipe],
  templateUrl: './autocomplete-item-form-modal.component.html',
  styleUrls: ['./autocomplete-item-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteItemFormModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autocompleteListService = inject(AutocompleteListService);
  private readonly autocompleteItemService = inject(AutocompleteItemService);
  private readonly i18n = inject(TranslationService);

  listId = signal('');
  list = signal<AutocompleteList | null>(null);
  isInstitutionsList = computed(() => this.list()?.key === INSTITUTIONS_LIST_KEY);
  isSubjectsList = computed(() => this.list()?.key === SUBJECTS_LIST_KEY);

  itemId = signal<string | null>(null);
  isEditMode = computed(() => this.itemId() !== null);

  model = signal(initialAutocompleteItemForm);
  form = form(this.model, autocompleteItemFormSchema);

  // Metadata sub-fields, kept outside the Signal Forms schema — same rationale as
  // material-upload-form's `category`: a picked/switched value, not free text.
  institutionType = signal<InstitutionType>('UNIVERSITY');
  city = signal('');
  subjectKind = signal<SubjectKind>('SCHOOL_SUBJECT');
  metadataJson = signal('{}');

  // parentItems picker.
  allLists = signal<AutocompleteList[]>([]);
  linkFromListKey = signal('');
  linkableItems = signal<AutocompleteItem[]>([]);
  selectedParentItemIds = signal<string[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const listId = this.route.snapshot.paramMap.get('listId') ?? '';
    this.listId.set(listId);
    this.autocompleteListService.getById(listId).subscribe((list) => this.list.set(list));
    this.autocompleteListService.adminList(1, 100).subscribe((response) => this.allLists.set(response.items));

    const itemId = this.route.snapshot.paramMap.get('itemId');
    if (!itemId || itemId === 'new') {
      return;
    }
    this.itemId.set(itemId);
    this.isLoading.set(true);
    this.autocompleteItemService.getById(itemId).subscribe({
      next: (item) => {
        this.model.set({
          translationEn: item.translations.en,
          translationRu: item.translations.ru,
          translationTj: item.translations.tj,
        });

        const metadata = item.metadata ?? {};
        if (typeof metadata['institutionType'] === 'string') {
          this.institutionType.set(metadata['institutionType'] as InstitutionType);
        }
        if (typeof metadata['city'] === 'string') {
          this.city.set(metadata['city'] as string);
        }
        if (typeof metadata['subjectKind'] === 'string') {
          this.subjectKind.set(metadata['subjectKind'] as SubjectKind);
        }
        if (Object.keys(metadata).length > 0) {
          this.metadataJson.set(JSON.stringify(metadata));
        }

        this.selectedParentItemIds.set(
          item.parentItems.map((parent) => (typeof parent === 'string' ? parent : parent._id)),
        );

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.i18n.translate('admin.autocomplete.itemForm.errorFailed'));
        this.isLoading.set(false);
      },
    });
  }

  onLinkFromListChange(key: string): void {
    this.linkFromListKey.set(key);
    const targetList = this.allLists().find((l) => l.key === key);
    if (!targetList) {
      this.linkableItems.set([]);
      return;
    }
    this.autocompleteItemService
      .adminList({ listId: targetList._id, page: 1, limit: 500 })
      .subscribe((response) => this.linkableItems.set(response.items));
  }

  toggleParentItem(id: string): void {
    this.selectedParentItemIds.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  private buildMetadata(): Record<string, unknown> {
    if (this.isInstitutionsList()) {
      return { institutionType: this.institutionType(), city: this.city() };
    }
    if (this.isSubjectsList()) {
      return { subjectKind: this.subjectKind() };
    }
    try {
      return JSON.parse(this.metadataJson() || '{}');
    } catch {
      return {};
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.isSaving.set(true);
      this.errorMessage.set(null);

      const value = this.model();
      const translations = { en: value.translationEn, ru: value.translationRu, tj: value.translationTj };
      const metadata = this.buildMetadata();
      const parentItems = this.selectedParentItemIds();

      const request = this.isEditMode()
        ? this.autocompleteItemService.update(this.itemId()!, { translations, metadata, parentItems })
        : this.autocompleteItemService.create({ list: this.listId(), translations, metadata, parentItems });

      request.subscribe({
        next: () => {
          this.isSaving.set(false);
          this.close();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message ?? this.i18n.translate('admin.autocomplete.itemForm.errorFailed'));
        },
      });

      return undefined;
    });
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
