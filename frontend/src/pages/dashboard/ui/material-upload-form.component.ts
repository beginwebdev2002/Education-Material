import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Material, MaterialService } from '@entities/material';

const ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

@Component({
  selector: 'app-material-upload-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-upload-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialUploadFormComponent {
  private readonly materialService = inject(MaterialService);

  uploaded = output<Material>();

  title = signal('');
  description = signal('');
  subject = signal('');
  level = signal('');
  file = signal<File | null>(null);
  fileName = signal<string | null>(null);
  fileError = signal<string | null>(null);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  isFormValid = computed(() =>
    this.title().trim().length >= 3 &&
    this.description().trim().length >= 10 &&
    this.subject().trim().length > 0 &&
    this.level().trim().length > 0 &&
    this.file() !== null &&
    !this.fileError(),
  );

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError.set(null);

    if (!input.files || input.files.length === 0) {
      return;
    }

    const selected = input.files[0];
    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      this.fileError.set($localize`Only PDF or DOCX files are allowed.`);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      this.fileError.set($localize`File is too large. Maximum size is 15MB.`);
      return;
    }

    this.file.set(selected);
    this.fileName.set(selected.name);
  }

  clearFile(fileInput?: HTMLInputElement): void {
    this.file.set(null);
    this.fileName.set(null);
    this.fileError.set(null);
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submit(fileInput?: HTMLInputElement): void {
    if (!this.isFormValid() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.materialService
      .upload({
        title: this.title(),
        description: this.description(),
        subject: this.subject(),
        level: this.level(),
        file: this.file()!,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (material) => {
          this.uploaded.emit(material);
          this.successMessage.set($localize`Material submitted. It will appear publicly once an admin approves it.`);
          this.title.set('');
          this.description.set('');
          this.subject.set('');
          this.level.set('');
          this.clearFile(fileInput);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(err.error?.message ?? $localize`Upload failed. Please try again.`);
        },
      });
  }
}
