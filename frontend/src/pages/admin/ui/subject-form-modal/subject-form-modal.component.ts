import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, form, submit } from '@angular/forms/signals';
import { AutocompleteItem, AutocompleteItemService, InstitutionType, SubjectKind } from '@entities/autocomplete';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { initialSubjectForm, subjectFormSchema } from './model/subject-form.model';

const INSTITUTIONS_LIST_KEY = 'educational-institutions';

@Component({
  selector: 'app-subject-form-modal',
  imports: [CommonModule, Field, ModalComponent, TranslationLabelPipe, TranslatePipe],
  templateUrl: './subject-form-modal.component.html',
  styleUrls: ['./subject-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectFormModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autocompleteItemService = inject(AutocompleteItemService);
  private readonly i18n = inject(TranslationService);

  listId = signal('');
  itemId = signal<string | null>(null);
  isEditMode = computed(() => this.itemId() !== null);

  model = signal(initialSubjectForm);
  form = form(this.model, subjectFormSchema);

  // Metadata sub-field, kept outside the Signal Forms schema - a picked value, not free text.
  subjectKind = signal<SubjectKind>('SCHOOL_SUBJECT');

  // Link to Institutions: candidates are filtered to the institution type matching subjectKind
  // (SCHOOL_SUBJECT -> Schools, SPECIALIZATION -> Universities).
  allInstitutions = signal<AutocompleteItem[]>([]);
  selectedParentItemIds = signal<string[]>([]);
  isLoadingInstitutions = signal(false);

  institutionTypeForKind = computed<InstitutionType>(() => (this.subjectKind() === 'SCHOOL_SUBJECT' ? 'SCHOOL' : 'UNIVERSITY'));
  linkableInstitutions = computed(() =>
    this.allInstitutions().filter((institution) => (institution.metadata?.['institutionType'] ?? 'UNIVERSITY') === this.institutionTypeForKind()),
  );

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.listId.set(this.route.snapshot.paramMap.get('listId') ?? '');
    this.loadInstitutions();

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
        if (typeof metadata['subjectKind'] === 'string') {
          this.subjectKind.set(metadata['subjectKind'] as SubjectKind);
        }

        this.selectedParentItemIds.set(item.parentItems.map((parent) => (typeof parent === 'string' ? parent : parent._id)));

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.i18n.translate('admin.autocomplete.subjectForm.errorFailed'));
        this.isLoading.set(false);
      },
    });
  }

  private loadInstitutions(): void {
    this.isLoadingInstitutions.set(true);
    this.autocompleteItemService.publicItemsByKey({ listKey: INSTITUTIONS_LIST_KEY, limit: 500 }).subscribe({
      next: (response) => {
        this.allInstitutions.set(response.items);
        this.isLoadingInstitutions.set(false);
      },
      error: () => {
        this.allInstitutions.set([]);
        this.isLoadingInstitutions.set(false);
      },
    });
  }

  onSubjectKindChange(kind: SubjectKind): void {
    this.subjectKind.set(kind);
    const linkableIds = new Set(this.linkableInstitutions().map((institution) => institution._id));
    this.selectedParentItemIds.update((ids) => ids.filter((id) => linkableIds.has(id)));
  }

  toggleParentItem(id: string): void {
    this.selectedParentItemIds.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.isSaving.set(true);
      this.errorMessage.set(null);

      const value = this.model();
      const translations = { en: value.translationEn, ru: value.translationRu, tj: value.translationTj };
      const metadata = { subjectKind: this.subjectKind() };
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
          this.errorMessage.set(err.error?.message ?? this.i18n.translate('admin.autocomplete.subjectForm.errorFailed'));
        },
      });

      return undefined;
    });
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
