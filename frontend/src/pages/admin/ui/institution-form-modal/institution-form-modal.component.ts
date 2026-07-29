import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, form, submit } from '@angular/forms/signals';
import { AutocompleteItem, AutocompleteItemService, InstitutionType } from '@entities/autocomplete';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { initialInstitutionForm, institutionFormSchema } from './model/institution-form.model';

const SUBJECTS_LIST_KEY = 'subjects-specializations';

@Component({
  selector: 'app-institution-form-modal',
  imports: [CommonModule, Field, ModalComponent, TranslationLabelPipe, TranslatePipe],
  templateUrl: './institution-form-modal.component.html',
  styleUrls: ['./institution-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionFormModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autocompleteItemService = inject(AutocompleteItemService);
  private readonly i18n = inject(TranslationService);

  listId = signal('');
  itemId = signal<string | null>(null);
  isEditMode = computed(() => this.itemId() !== null);

  model = signal(initialInstitutionForm);
  form = form(this.model, institutionFormSchema);

  // Metadata sub-fields, kept outside the Signal Forms schema - a picked value, not free text.
  institutionType = signal<InstitutionType>('UNIVERSITY');
  city = signal('');

  // Read-only: subjects/specialties that already link to this institution (link is written
  // from the subject/specialty side - see SubjectFormModalComponent).
  linkedSubjects = signal<AutocompleteItem[]>([]);
  isLoadingLinkedSubjects = signal(false);

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.listId.set(this.route.snapshot.paramMap.get('listId') ?? '');

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

        this.isLoading.set(false);
        this.loadLinkedSubjects(itemId);
      },
      error: () => {
        this.errorMessage.set(this.i18n.translate('admin.autocomplete.institutionForm.errorFailed'));
        this.isLoading.set(false);
      },
    });
  }

  private loadLinkedSubjects(itemId: string): void {
    this.isLoadingLinkedSubjects.set(true);
    this.autocompleteItemService.publicItemsByKey({ listKey: SUBJECTS_LIST_KEY, parentItem: itemId, limit: 100 }).subscribe({
      next: (response) => {
        this.linkedSubjects.set(response.items);
        this.isLoadingLinkedSubjects.set(false);
      },
      error: () => {
        this.linkedSubjects.set([]);
        this.isLoadingLinkedSubjects.set(false);
      },
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.isSaving.set(true);
      this.errorMessage.set(null);

      const value = this.model();
      const translations = { en: value.translationEn, ru: value.translationRu, tj: value.translationTj };
      const metadata = { institutionType: this.institutionType(), city: this.city() };

      const request = this.isEditMode()
        ? this.autocompleteItemService.update(this.itemId()!, { translations, metadata })
        : this.autocompleteItemService.create({ list: this.listId(), translations, metadata });

      request.subscribe({
        next: () => {
          this.isSaving.set(false);
          this.close();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message ?? this.i18n.translate('admin.autocomplete.institutionForm.errorFailed'));
        },
      });

      return undefined;
    });
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
