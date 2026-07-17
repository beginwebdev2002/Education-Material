import { Component, ChangeDetectionStrategy, signal, OnInit, computed, OnDestroy, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MockGenerationService, TranslationService } from '@shared/services';
import { GenerationFormModel, GenerationHistoryItem, MaterialDescription, MaterialTypes, MaterialTypesKey } from '@shared/models';
type FormatsValue = Record<MaterialTypesKey, boolean>;
import { audienceOptions, levelOptions } from '@features/generation-form';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { firstError, integerValidator, maxValidator, minValidator, requiredValidator } from '@shared/validation';

@Component({
  selector: 'app-generation-form',
  templateUrl: './generation-form.component.html',
  styleUrls: ['./generation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
})
export class GenerationFormComponent implements OnInit, OnDestroy {
  requestToLoad = input<GenerationHistoryItem | null>(null);

  private readonly DRAFT_KEY = 'generation-form-draft';
  private progressInterval: ReturnType<typeof setInterval> | undefined;

  protected readonly firstError = firstError;

  // --- Reactive form ---
  form = new FormGroup({
    subject: new FormControl('', { nonNullable: true, validators: [requiredValidator()] }),
    selectedAudience: new FormControl('university', { nonNullable: true }), // Corresponds to InstitutionType
    selectedLevel: new FormControl<string | null>(null),
    topic: new FormControl('', { nonNullable: true, validators: [requiredValidator()] }),
    formats: new FormGroup({
      program: new FormControl(true, { nonNullable: true }),
      lecture: new FormControl(false, { nonNullable: true }),
      presentation: new FormControl(false, { nonNullable: true }),
      test: new FormControl(false, { nonNullable: true }),
    }),
    teachingWeeks: new FormControl<number | null>(16, [integerValidator(), minValidator(1), maxValidator(36)]),
    lecturesPerWeek: new FormControl<number | null>(1, [integerValidator(), minValidator(0), maxValidator(10)]),
    presentationsPerWeek: new FormControl<number | null>(1, [integerValidator(), minValidator(0), maxValidator(10)]),
    testQuestions: new FormControl<number | null>(100, [integerValidator(), minValidator(50), maxValidator(300)]),
  });

  // Bridges the FormGroup's live value back to a signal so the existing
  // computed()s below stay reactive without rewriting their logic.
  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

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
    const audience = this.formValue().selectedAudience ?? 'university';
    return this.levelOptions()[audience] || [];
  });

  isAnyFormatSelected = computed(() => {
    const formats = this.formValue().formats as Partial<FormatsValue> | undefined;
    return !!(formats?.program || formats?.lecture || formats?.presentation || formats?.test);
  });

  isStep1Valid = computed(() => {
    this.formValue();
    return this.form.controls.subject.valid && !!this.form.controls.selectedLevel.value;
  });
  isStep2Valid = computed(() => {
    this.formValue();
    return this.form.controls.topic.valid;
  });

  isFormatsValid = computed(() => {
    const formats = this.formValue().formats as Partial<FormatsValue> | undefined;
    if (formats?.program && this.form.controls.teachingWeeks.invalid) {
      return false;
    }
    if (formats?.lecture && this.form.controls.lecturesPerWeek.invalid) {
      return false;
    }
    if (formats?.presentation && this.form.controls.presentationsPerWeek.invalid) {
      return false;
    }
    if (formats?.test && this.form.controls.testQuestions.invalid) {
      return false;
    }
    return true;
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
    this.checkDraftExists();
    // Set initial level based on default audience
    const initialLevels = this.dynamicCourseLevels();
    if (initialLevels.length > 0) {
      this.form.controls.selectedLevel.setValue(initialLevels[0]);
    }
  }

  ngOnDestroy(): void {
    this.stopProgressIndicator();
    if (this.previousFileUrl) {
      URL.revokeObjectURL(this.previousFileUrl);
    }
  }

  private checkDraftExists(): void {
    if (typeof window !== 'undefined' && localStorage.getItem(this.DRAFT_KEY)) {
      this.draftExists.set(true);
    } else {
      this.draftExists.set(false);
    }
  }

  handleAudienceChange(newAudience: string): void {
    this.form.controls.selectedAudience.setValue(newAudience);
    // Reset level when audience changes
    const newLevels = this.levelOptions()[newAudience] || [];
    this.form.controls.selectedLevel.setValue(newLevels.length > 0 ? newLevels[0] : null);
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
    const control = this.form.controls.formats.controls[format];
    control.setValue(!control.value);
    if (this.isAnyFormatSelected()) {
      this.formatSelectionError.set(null);
    }
  }

  changeTeachingWeeks(amount: number): void {
    const control = this.form.controls.teachingWeeks;
    control.setValue(Math.max(1, Math.min(36, (control.value || 0) + amount)));
  }

  changeLectures(amount: number): void {
    const control = this.form.controls.lecturesPerWeek;
    control.setValue(Math.max(0, Math.min(10, (control.value || 0) + amount)));
  }

  changePresentations(amount: number): void {
    const control = this.form.controls.presentationsPerWeek;
    control.setValue(Math.max(0, Math.min(10, (control.value || 0) + amount)));
  }

  generate(): void {
    if (!this.isAnyFormatSelected()) {
      this.formatSelectionError.set(this.i18n.translate('generationForm.errors.selectFormat'));
      return;
    } else {
      this.formatSelectionError.set(null);
    }

    if (!this.isFormatsValid()) {
      return;
    }

    this.generationStatus.set(null);
    this.isLoading.set(true);
    this.startProgressIndicator();

    if (this.previousFileUrl) {
      URL.revokeObjectURL(this.previousFileUrl);
      this.previousFileUrl = null;
      this.generatedFileUrl.set(null);
    }

    const raw = this.form.getRawValue();
    const formModel: GenerationFormModel = {
      subject: raw.subject,
      audience: raw.selectedAudience,
      level: raw.selectedLevel!,
      topic: raw.topic,
      formats: raw.formats as MaterialTypes,
      templateFile: this.templateFile(),
      teachingWeeks: raw.teachingWeeks!,
      lecturesPerWeek: raw.lecturesPerWeek!,
      presentationsPerWeek: raw.presentationsPerWeek!,
      testQuestions: raw.testQuestions!,
    };

    this.generationService.generate(formModel)
      .pipe(finalize(() => {
        this.isLoading.set(false);
        this.stopProgressIndicator();
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(this.form.getRawValue()));
      this.draftExists.set(true);
      this.showDraftStatus('Draft saved successfully!');
    }
  }

  loadDraft(): void {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(this.DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        this.form.patchValue({
          subject: draftData.subject || '',
          selectedAudience: draftData.audience || draftData.selectedAudience || 'university',
          selectedLevel: draftData.level || draftData.selectedLevel || '1st Course',
          topic: draftData.topic || '',
          formats: draftData.formats || { program: true, lecture: false, presentation: false, test: false },
          teachingWeeks: draftData.teachingWeeks ?? 16,
          lecturesPerWeek: draftData.lecturesPerWeek ?? 1,
          presentationsPerWeek: draftData.presentationsPerWeek ?? 1,
          testQuestions: draftData.testQuestions ?? 100,
        });
        this.clearFileSelection();
        this.showDraftStatus('Draft loaded!');
      }
    }
  }

  clearDraft(): void {
    if (typeof window !== 'undefined') {
      const defaultFormats: MaterialTypes = { id: 1, program: true, lecture: false, presentation: false, test: false };
      localStorage.removeItem(this.DRAFT_KEY);
      this.draftExists.set(false);

      const defaultLevels = this.levelOptions()['university'] || [];
      this.form.reset({
        subject: '',
        selectedAudience: 'university',
        selectedLevel: defaultLevels.length > 0 ? defaultLevels[0] : null,
        topic: '',
        formats: defaultFormats,
        teachingWeeks: 16,
        lecturesPerWeek: 1,
        presentationsPerWeek: 1,
        testQuestions: 100,
      });

      this.clearFileSelection();
      this.showDraftStatus(this.i18n.translate('generationForm.draft.clearedMessage'));
    }
  }

  private showDraftStatus(message: string): void {
    this.draftStatus.set(message);
    setTimeout(() => this.draftStatus.set(''), 3000);
  }

  loadFromHistory(item: GenerationHistoryItem): void {
    this.form.patchValue({
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
