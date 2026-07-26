import { Component, ChangeDetectionStrategy, signal, OnInit, computed, OnDestroy, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, submit } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { MockGenerationService, TranslationService } from '@shared/services';
import { GenerationFormModel, GenerationHistoryItem, MaterialDescription, MaterialTypes, MaterialTypesKey } from '@shared/models';
import { audienceOptions, levelOptions } from '../config/generation-form-options';
import { TranslatePipe } from '@shared/pipes';
import { generationFormSchema, initialGenerationForm } from '../model/form.model';
import { hasDraft, saveDraft as persistDraft, loadDraft as readDraft, clearDraft as removeDraft } from '../lib/generation-form-draft';

@Component({
  selector: 'app-generation-form',
  templateUrl: './generation-form.component.html',
  styleUrls: ['./generation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormField, TranslatePipe],
})
export class GenerationFormComponent implements OnInit, OnDestroy {
  requestToLoad = input<GenerationHistoryItem | null>(null);

  private progressInterval: ReturnType<typeof setInterval> | undefined;

  // --- Signal Forms ---
  model = signal(initialGenerationForm);
  form = form(this.model, generationFormSchema);

  templateFile = signal<File | null>(null);

  materialFormats = signal<MaterialDescription[]>(
    [
      {
        id: 1,
        key: 'program',
        name: 'Программа',
        sub: 'Syllabus',
        icon: 'fa-solid fa-file-alt'
      },
      {
        id: 2,
        key: 'lecture',
        name: 'Лекция',
        sub: 'Lecture',
        icon: 'fa-solid fa-book-open'
      },
      {
        id: 3,
        key: 'presentation',
        name: 'Презентация',
        sub: 'Slides',
        icon: 'fa-solid fa-person-chalkboard'
      },
      {
        id: 4,
        key: 'test',
        name: 'Тест',
        sub: 'Test',
        icon: 'fa-solid fa-clipboard-question'
      }])

  // --- Wizard State ---
  currentStep = signal(1);

  // --- Static Data for Select Options ---
  audienceOptions = signal(audienceOptions);

  levelOptions = signal(levelOptions);

  // --- Computed Signals ---
  dynamicCourseLevels = computed(() => {
    const audience = this.model().selectedAudience;
    return this.levelOptions()[audience] || [];
  });

  isAnyFormatSelected = computed(() => {
    const formats = this.model().formats;
    return formats.program || formats.lecture || formats.presentation || formats.test;
  });

  isStep1Valid = computed(() => this.form.subject().valid() && this.form.selectedLevel().valid());
  isStep2Valid = computed(() => this.form.topic().valid());

  isFormatsValid = computed(() => {
    return this.form.teachingWeeks().valid()
      && this.form.lecturesPerWeek().valid()
      && this.form.presentationsPerWeek().valid()
      && this.form.testQuestions().valid();
  });

  // --- Component State Signals ---
  isLoading = signal(false);
  progress = signal(0);
  progressMessage = signal('');
  generationStatus = signal<{ success: boolean; message: string } | null>(null);
  fileName = signal<string | null>(null);
  fileError = signal<string | null>(null);
  draftExists = signal(false);
  draftStatus = signal('');
  formatSelectionError = signal<string | null>(null);
  generatedFileUrl = signal<string | null>(null);
  private previousFileUrl: string | null = null;
  private i18n = inject(TranslationService);
  private generationService = inject(MockGenerationService);

  constructor() {
    effect(() => {
      const request = this.requestToLoad();
      if (request) {
        this.loadFromHistory(request);
      }
    });
  }

  ngOnInit(): void {
    this.draftExists.set(hasDraft());
    // Set initial level based on default audience
    const initialLevels = this.dynamicCourseLevels();
    if (initialLevels.length > 0) {
      this.model.update(m => ({ ...m, selectedLevel: initialLevels[0] }));
    }
  }

  ngOnDestroy(): void {
    this.stopProgressIndicator();
    if (this.previousFileUrl) {
      URL.revokeObjectURL(this.previousFileUrl);
    }
  }

  handleAudienceChange(newAudience: string): void {
    // Reset level when audience changes
    const newLevels = this.levelOptions()[newAudience] || [];
    this.model.update(m => ({
      ...m,
      selectedAudience: newAudience,
      selectedLevel: newLevels.length > 0 ? newLevels[0] : '',
    }));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError.set(null);

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedMimeTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!allowedMimeTypes.includes(file.type)) {
        this.fileError.set(this.i18n.translate('generationForm.errors.invalidFileType'));
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.fileError.set(this.i18n.translate('generationForm.errors.fileTooLarge'));
        return;
      }

      this.templateFile.set(file);
      this.fileName.set(file.name);
    }
  }

  clearFileSelection(fileInput?: HTMLInputElement): void {
    this.templateFile.set(null);
    this.fileName.set(null);
    this.fileError.set(null);
    if (fileInput) {
      fileInput.value = '';
    }
  }

  toggleFormat(format: MaterialTypesKey): void {
    this.model.update(m => ({
      ...m,
      formats: { ...m.formats, [format]: !m.formats[format] },
    }));
    if (this.isAnyFormatSelected()) {
      this.formatSelectionError.set(null);
    }
  }

  changeTeachingWeeks(amount: number): void {
    this.model.update(m => ({ ...m, teachingWeeks: Math.max(1, Math.min(36, (m.teachingWeeks || 0) + amount)) }));
  }

  changeLectures(amount: number): void {
    this.model.update(m => ({ ...m, lecturesPerWeek: Math.max(0, Math.min(10, (m.lecturesPerWeek || 0) + amount)) }));
  }

  changePresentations(amount: number): void {
    this.model.update(m => ({ ...m, presentationsPerWeek: Math.max(0, Math.min(10, (m.presentationsPerWeek || 0) + amount)) }));
  }

  generate(): void {
    if (!this.isAnyFormatSelected()) {
      this.formatSelectionError.set(this.i18n.translate('generationForm.errors.selectFormat'));
      return;
    } else {
      this.formatSelectionError.set(null);
    }

    submit(this.form, async () => {
      if (!this.isFormatsValid()) {
        return undefined;
      }

      this.generationStatus.set(null);
      this.isLoading.set(true);
      this.startProgressIndicator();

      if (this.previousFileUrl) {
        URL.revokeObjectURL(this.previousFileUrl);
        this.previousFileUrl = null;
        this.generatedFileUrl.set(null);
      }

      const raw = this.model();
      const formModel: GenerationFormModel = {
        subject: raw.subject,
        audience: raw.selectedAudience,
        level: raw.selectedLevel,
        topic: raw.topic,
        formats: raw.formats as MaterialTypes,
        templateFile: this.templateFile(),
        teachingWeeks: raw.teachingWeeks!,
        lecturesPerWeek: raw.lecturesPerWeek!,
        presentationsPerWeek: raw.presentationsPerWeek!,
        testQuestions: raw.testQuestions!,
      };

      return new Promise<undefined>((resolve) => {
        this.generationService.generate(formModel)
          .pipe(finalize(() => {
            this.isLoading.set(false);
            this.stopProgressIndicator();
            resolve(undefined);
          }))
          .subscribe({
            next: (response) => {
              this.generationStatus.set(response);
              if (response.success) {
                const blob = new Blob(['Mock ZIP content'], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                this.generatedFileUrl.set(url);
                this.previousFileUrl = url;
              }
            },
            error: (err) => {
              this.generationStatus.set({ success: false, message: 'An unexpected error occurred.' });
              console.error(err);
            }
          });
      });
    });
  }

  private startProgressIndicator(): void {
    this.progress.set(0);
    this.progressMessage.set('Initializing generation process...');

    let step = 0;
    const messages = [
      'Analyzing topic and audience...',
      'Structuring content modules...',
      'Generating lecture notes...',
      'Designing presentation slides...',
      'Compiling test questions...',
      'Finalizing materials package...'
    ];

    this.progressInterval = setInterval(() => {
      this.progress.update(p => Math.min(p + 1, 100));

      if (this.progress() >= (step + 1) * (100 / messages.length) && step < messages.length) {
        this.progressMessage.set(messages[step]);
        step++;
      }

      if (this.progress() >= 100) {
        this.stopProgressIndicator();
      }
    }, 45); // Adjust for a ~5 second total duration
  }

  private stopProgressIndicator(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
    this.progress.set(100);
    this.progressMessage.set('Packaging files for download...');
  }

  saveDraft(): void {
    persistDraft(this.model());
    this.draftExists.set(true);
    this.showDraftStatus('Draft saved successfully!');
  }

  loadDraft(): void {
    const draft = readDraft();
    if (!draft) return;

    this.model.set(draft);
    this.clearFileSelection();
    this.showDraftStatus('Draft loaded!');
  }

  clearDraft(): void {
    this.model.set(removeDraft());
    this.draftExists.set(false);
    this.clearFileSelection();
    this.showDraftStatus(this.i18n.translate('generationForm.draft.clearedMessage'));
  }

  private showDraftStatus(message: string): void {
    this.draftStatus.set(message);
    setTimeout(() => this.draftStatus.set(''), 3000);
  }

  loadFromHistory(item: GenerationHistoryItem): void {
    this.model.set({
      subject: item.formData.subject,
      selectedAudience: item.formData.audience,
      selectedLevel: item.formData.level,
      topic: item.formData.topic,
      formats: item.formData.formats,
      teachingWeeks: item.formData.teachingWeeks ?? 16,
      lecturesPerWeek: item.formData.lecturesPerWeek ?? 1,
      presentationsPerWeek: item.formData.presentationsPerWeek ?? 1,
      testQuestions: item.formData.testQuestions ?? 100,
    });
    this.templateFile.set(null);
    this.clearFileSelection();
    this.currentStep.set(1);
  }

  // --- Wizard Navigation ---
  nextStep(): void {
    if (this.currentStep() === 1 && this.isStep1Valid()) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 2 && this.isStep2Valid()) {
      this.currentStep.set(3);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
      return;
    }
    if (step > this.currentStep()) {
      if (this.currentStep() === 1 && this.isStep1Valid()) {
        this.currentStep.set(step);
      } else if (this.currentStep() === 2 && this.isStep1Valid() && this.isStep2Valid()) {
        this.currentStep.set(step);
      }
    }
  }
}
