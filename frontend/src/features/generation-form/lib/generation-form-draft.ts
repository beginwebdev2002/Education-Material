import { GenerationFormModelState, initialGenerationForm } from '../model/form.model';
import { levelOptions } from '../config/generation-form-options';

const DRAFT_KEY = 'generation-form-draft';

function defaultLevelFor(audience: string): string {
  return levelOptions[audience]?.[0] ?? '';
}

export function hasDraft(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(DRAFT_KEY);
}

export function saveDraft(model: GenerationFormModelState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(model));
}

export function loadDraft(): GenerationFormModelState | null {
  if (typeof window === 'undefined') return null;

  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (!savedDraft) return null;

  const draftData = JSON.parse(savedDraft);
  const selectedAudience = draftData.audience || draftData.selectedAudience || initialGenerationForm.selectedAudience;

  return {
    ...initialGenerationForm,
    subject: draftData.subject || '',
    selectedAudience,
    selectedLevel: draftData.level || draftData.selectedLevel || defaultLevelFor(selectedAudience),
    topic: draftData.topic || '',
    formats: draftData.formats || initialGenerationForm.formats,
    teachingWeeks: draftData.teachingWeeks ?? initialGenerationForm.teachingWeeks,
    lecturesPerWeek: draftData.lecturesPerWeek ?? initialGenerationForm.lecturesPerWeek,
    presentationsPerWeek: draftData.presentationsPerWeek ?? initialGenerationForm.presentationsPerWeek,
    testQuestions: draftData.testQuestions ?? initialGenerationForm.testQuestions,
  };
}

export function clearDraft(): GenerationFormModelState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DRAFT_KEY);
  }

  return {
    ...initialGenerationForm,
    selectedLevel: defaultLevelFor(initialGenerationForm.selectedAudience),
  };
}
