import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, form, submit } from '@angular/forms/signals';
import { AutocompleteListService } from '@entities/autocomplete';
import { ModalComponent } from '@shared/ui';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { autocompleteListFormSchema, initialAutocompleteListForm } from './model/autocomplete-list-form.model';

@Component({
  selector: 'app-autocomplete-list-form-modal',
  imports: [CommonModule, Field, ModalComponent, TranslatePipe],
  templateUrl: './autocomplete-list-form-modal.component.html',
  styleUrls: ['./autocomplete-list-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteListFormModalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly autocompleteListService = inject(AutocompleteListService);
  private readonly i18n = inject(TranslationService);

  listId = signal<string | null>(null);
  isEditMode = computed(() => this.listId() !== null);

  model = signal(initialAutocompleteListForm);
  form = form(this.model, autocompleteListFormSchema);

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('listId');
    if (!id || id === 'new') {
      return;
    }
    this.listId.set(id);
    this.isLoading.set(true);
    this.autocompleteListService.getById(id).subscribe({
      next: (list) => {
        this.model.set({
          key: list.key,
          labelTranslationEn: list.labelTranslations.en,
          labelTranslationRu: list.labelTranslations.ru,
          labelTranslationTj: list.labelTranslations.tj,
          description: list.description ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.i18n.translate('admin.autocomplete.listForm.errorFailed'));
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.isSaving.set(true);
      this.errorMessage.set(null);

      const value = this.model();
      const labelTranslations = { en: value.labelTranslationEn, ru: value.labelTranslationRu, tj: value.labelTranslationTj };

      const request = this.isEditMode()
        ? this.autocompleteListService.update(this.listId()!, { labelTranslations, description: value.description })
        : this.autocompleteListService.create({ key: value.key, labelTranslations, description: value.description });

      request.subscribe({
        next: () => {
          this.isSaving.set(false);
          this.close();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message ?? this.i18n.translate('admin.autocomplete.listForm.errorFailed'));
        },
      });

      return undefined;
    });
  }

  close(): void {
    this.router.navigate([{ outlets: { modal: null } }], { relativeTo: this.route.parent });
  }
}
