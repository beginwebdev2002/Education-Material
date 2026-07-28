import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Field, form, submit } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { Material, MATERIAL_CATEGORIES, MaterialCategory, MaterialService } from '@entities/material';
import { AutocompleteItem, AutocompleteItemSelectComponent } from '@entities/autocomplete';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';
import { initialUploadForm, uploadFormSchema } from './model/upload-form.model';

const ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

@Component({
  selector: 'app-material-upload-form',
  imports: [CommonModule, Field, AutocompleteItemSelectComponent, TranslatePipe],
  templateUrl: './material-upload-form.component.html',
  styleUrls: ['./material-upload-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialUploadFormComponent {
  private readonly materialService = inject(MaterialService);
  private readonly i18n = inject(TranslationService);

  uploaded = output<Material>();

  categories = MATERIAL_CATEGORIES;

  model = signal(initialUploadForm);
  form = form(this.model, uploadFormSchema);

  files = signal<File[]>([]);
  fileErrors = signal<string[]>([]);
  category = signal<MaterialCategory[]>([]);

  // Institution/subject selection stays outside the Signal Forms schema — a
  // picked reference id, not free text, same rationale as `category` above.
  institutionId = signal('');
  subjectId = signal('');

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isFilesValid = computed(() => this.files().length > 0 && this.fileErrors().length === 0);
  isCategoryValid = computed(() => this.category().length > 0);
  isInstitutionValid = computed(() => this.institutionId() !== '');
  isSubjectValid = computed(() => this.subjectId() !== '');
  isFormValid = computed(() =>
    !this.form().invalid() && this.isFilesValid() && this.isCategoryValid() && this.isInstitutionValid() && this.isSubjectValid(),
  );

  onInstitutionSelected(item: AutocompleteItem | null): void {
    this.institutionId.set(item?._id ?? '');
    this.subjectId.set('');
  }

  onSubjectSelected(item: AutocompleteItem | null): void {
    this.subjectId.set(item?._id ?? '');
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const nextFiles: File[] = [...this.files()];
    const errors: string[] = [];

    for (const selected of Array.from(input.files)) {
      if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
        errors.push(this.i18n.translate('dashboard.upload.errorInvalidType', { name: selected.name }));
        continue;
      }
      if (selected.size > MAX_FILE_SIZE_BYTES) {
        errors.push(this.i18n.translate('dashboard.upload.errorTooLarge', { name: selected.name }));
        continue;
      }
      nextFiles.push(selected);
    }

    this.files.set(nextFiles);
    this.fileErrors.set(errors);
    input.value = '';
  }

  removeFile(index: number): void {
    this.files.update((list) => list.filter((_, i) => i !== index));
  }

  toggleCategory(category: MaterialCategory): void {
    this.category.update((list) =>
      list.includes(category) ? list.filter((c) => c !== category) : [...list, category],
    );
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.isFilesValid() || !this.isCategoryValid() || !this.isInstitutionValid() || !this.isSubjectValid() || this.isSubmitting()) {
      return;
    }

    submit(this.form, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      this.materialService
        .upload({
          ...this.model(),
          institution: this.institutionId(),
          subject: this.subjectId(),
          category: this.category(),
          files: this.files(),
        })
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: (material) => {
            this.uploaded.emit(material);
            this.successMessage.set(this.i18n.translate('dashboard.upload.successMessage'));
            this.model.set(initialUploadForm);
            this.files.set([]);
            this.fileErrors.set([]);
            this.category.set([]);
            this.institutionId.set('');
            this.subjectId.set('');
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage.set(err.error?.message ?? this.i18n.translate('dashboard.upload.errorFailed'));
          },
        });

      return undefined;
    });
  }
}
