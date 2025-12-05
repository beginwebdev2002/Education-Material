import { Component, ChangeDetectionStrategy, signal, OnInit, computed, OnDestroy, effect, input, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockGenerationService } from '../../shared/services/generation.service';
import { finalize } from 'rxjs';
import { GenerationFormModel, GenerationHistoryItem } from '../../shared/models/generation.model';
import { MaterialDescription, MaterialTypes, MaterialTypesKey } from '../../shared/models/material.model';
import { audienceOptions, levelOptions } from './generation-form.data';

@Component({
  selector: 'app-generation-form',
  templateUrl: './generation-form.component.html',
  styleUrls: ['./generation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class GenerationFormComponent implements OnInit, OnDestroy {
  requestToLoad = input<GenerationHistoryItem | null>(null);

  private readonly DRAFT_KEY = 'generation-form-draft';
  private progressInterval: ReturnType<typeof setInterval> | undefined;

  // --- Signal-based Form State ---
  subject = signal('');
  selectedAudience = signal('university'); // Corresponds to InstitutionType
  selectedLevel = signal<string | null>(null); // Corresponds to CourseLevel
  topic = signal('');
  formats = signal<MaterialTypes>({
    id: 1,
    program: true,
    lecture: false,
    presentation: false,
    test: false,
  });
  // Format-specific options
  teachingWeeks = signal<number | null>(16);
  lecturesPerWeek = signal<number | null>(1);
  presentationsPerWeek = signal<number | null>(1);
  testQuestions = signal<number | null>(100);

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
  templateFile = signal<File | null>(null);

  // --- Wizard State ---
  currentStep = signal(1);

  // --- Static Data for Select Options ---
  audienceOptions = signal(audienceOptions);

  levelOptions = signal(levelOptions);

  // --- Validation Signals ---
  teachingWeeksError = signal<string | null>(null);
  lecturesError = signal<string | null>(null);
  presentationsError = signal<string | null>(null);
  testQuestionsError = signal<string | null>(null);

  // --- Computed Signals ---
  dynamicCourseLevels = computed(() => {
    const audience = this.selectedAudience();
    return this.levelOptions()[audience] || [];
  });

  isAnyFormatSelected = computed(() => {
    const currentFormats = this.formats();
    return currentFormats.program || currentFormats.lecture || currentFormats.presentation || currentFormats.test;
  });

  isStep1Valid = computed(() => {
    return this.subject().trim() !== '' && !!this.selectedLevel();
  });
  isStep2Valid = computed(() => {
    return this.topic().trim() !== '';
  });

  isFormatsValid = computed(() => {
    const currentFormats = this.formats();
    if (currentFormats.program && this.teachingWeeksError() !== null) {
      return false;
    }
    if (currentFormats.lecture && this.lecturesError() !== null) {
      return false;
    }
    if (currentFormats.presentation && this.presentationsError() !== null) {
      return false;
    }
    if (currentFormats.test && this.testQuestionsError() !== null) {
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

  constructor(private generationService: MockGenerationService) {
    effect(() => {
      const request = this.requestToLoad();
      if (request) {
        this.loadFromHistory(request);
      }
    });

    // --- Validation Effects ---
    this.createNumericValidationEffect(this.teachingWeeks, this.teachingWeeksError, 1, 36, 'program');
    this.createNumericValidationEffect(this.lecturesPerWeek, this.lecturesError, 0, 10, 'lecture');
    this.createNumericValidationEffect(this.presentationsPerWeek, this.presentationsError, 0, 10, 'presentation');
    this.createNumericValidationEffect(this.testQuestions, this.testQuestionsError, 50, 300, 'test');
  }

  ngOnInit(): void {
    this.checkDraftExists();
    // Set initial level based on default audience
    const initialLevels = this.dynamicCourseLevels();
    if (initialLevels.length > 0) {
      this.selectedLevel.set(initialLevels[0]);
    }
  }

  ngOnDestroy(): void {
    this.stopProgressIndicator();
    if (this.previousFileUrl) {
      URL.revokeObjectURL(this.previousFileUrl);
    }
  }

  private createNumericValidationEffect(
    valueSignal: Signal<number | null>,
    errorSignal: WritableSignal<string | null>,
    min: number,
    max: number,
    formatKey: MaterialTypesKey
  ) {
    effect(() => {
      // Only validate if the corresponding format is selected
      if (!this.formats()[formatKey]) {
        errorSignal.set(null);
        return;
      }

      const value = valueSignal();
      if (value === null) {
        errorSignal.set('Value is required.');
      } else if (!Number.isInteger(value)) {
        errorSignal.set('Must be a whole number.');
      } else if (value < min || value > max) {
        errorSignal.set(`Must be between ${min} and ${max}.`);
      } else {
        errorSignal.set(null);
      }
    });
  }

  private checkDraftExists(): void {
    if (typeof window !== 'undefined' && localStorage.getItem(this.DRAFT_KEY)) {
      this.draftExists.set(true);
    } else {
      this.draftExists.set(false);
    }
  }

  handleAudienceChange(newAudience: string): void {
    this.selectedAudience.set(newAudience);
    // Reset level when audience changes
    const newLevels = this.levelOptions()[newAudience] || [];
    this.selectedLevel.set(newLevels.length > 0 ? newLevels[0] : null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError.set(null);

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedMimeTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!allowedMimeTypes.includes(file.type)) {
        this.fileError.set($localize`Invalid file type. Please upload a DOCX or PDF file.`);
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.fileError.set($localize`File is too large. Maximum size is 5MB.`);
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

  toggleFormat(format: keyof GenerationFormModel['formats']): void {
    this.formats.update(currentFormats => ({
      ...currentFormats,
      [format]: !currentFormats[format]
    }));
    if (this.isAnyFormatSelected()) {
      this.formatSelectionError.set(null);
    }
  }

  changeTeachingWeeks(amount: number): void {
    this.teachingWeeks.update(v => Math.max(1, Math.min(36, (v || 0) + amount)));
  }

  changeLectures(amount: number): void {
    this.lecturesPerWeek.update(v => Math.max(0, Math.min(10, (v || 0) + amount)));
  }

  changePresentations(amount: number): void {
    this.presentationsPerWeek.update(v => Math.max(0, Math.min(10, (v || 0) + amount)));
  }

  generate(): void {
    if (!this.isAnyFormatSelected()) {
      this.formatSelectionError.set($localize`Please select at least one output format.`);
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

    const formModel: GenerationFormModel = {
      subject: this.subject(),
      audience: this.selectedAudience(),
      level: this.selectedLevel()!,
      topic: this.topic(),
      formats: this.formats(),
      templateFile: this.templateFile(),
      teachingWeeks: this.teachingWeeks()!,
      lecturesPerWeek: this.lecturesPerWeek()!,
      presentationsPerWeek: this.presentationsPerWeek()!,
      testQuestions: this.testQuestions()!,
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
      const draft = {
        subject: this.subject(),
        audience: this.selectedAudience(),
        level: this.selectedLevel(),
        topic: this.topic(),
        formats: this.formats(),
        teachingWeeks: this.teachingWeeks(),
        lecturesPerWeek: this.lecturesPerWeek(),
        presentationsPerWeek: this.presentationsPerWeek(),
        testQuestions: this.testQuestions(),
      };
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
      this.draftExists.set(true);
      this.showDraftStatus('Draft saved successfully!');
    }
  }

  loadDraft(): void {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(this.DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        this.subject.set(draftData.subject || '');
        this.selectedAudience.set(draftData.audience || 'university');
        this.selectedLevel.set(draftData.level || '1st Course');
        this.topic.set(draftData.topic || '');
        this.formats.set(draftData.formats || { program: true, lecture: false, presentation: false, test: false });
        this.teachingWeeks.set(draftData.teachingWeeks ?? 16);
        this.lecturesPerWeek.set(draftData.lecturesPerWeek ?? 1);
        this.presentationsPerWeek.set(draftData.presentationsPerWeek ?? 1);
        this.testQuestions.set(draftData.testQuestions ?? 100);
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
      this.subject.set('');
      this.selectedAudience.set('university');
      this.topic.set('');
      this.formats.set(defaultFormats);
      this.templateFile.set(null);
      this.teachingWeeks.set(16);
      this.lecturesPerWeek.set(1);
      this.presentationsPerWeek.set(1);
      this.testQuestions.set(100);

      const defaultLevels = this.levelOptions()['university'] || [];
      this.selectedLevel.set(defaultLevels.length > 0 ? defaultLevels[0] : null);

      this.clearFileSelection();
      this.showDraftStatus($localize`:Popup message:Draft cleared!`);
    }
  }

  private showDraftStatus(message: string): void {
    this.draftStatus.set(message);
    setTimeout(() => this.draftStatus.set(''), 3000);
  }

  loadFromHistory(item: GenerationHistoryItem): void {
    this.subject.set(item.formData.subject);
    this.selectedAudience.set(item.formData.audience);
    this.selectedLevel.set(item.formData.level);
    this.topic.set(item.formData.topic);
    this.formats.set(item.formData.formats);
    this.teachingWeeks.set(item.formData.teachingWeeks ?? 16);
    this.lecturesPerWeek.set(item.formData.lecturesPerWeek ?? 1);
    this.presentationsPerWeek.set(item.formData.presentationsPerWeek ?? 1);
    this.testQuestions.set(item.formData.testQuestions ?? 100);
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
