import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationFormModel, GenerationHistoryItem } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class MockGenerationService {
  private readonly HISTORY_KEY = 'generation-history';
  history = signal<GenerationHistoryItem[]>(this.loadHistory());

  generate(formData: GenerationFormModel): Observable<{ success: boolean; message: string }> {
    const historyItem: GenerationHistoryItem = {
      id: self.crypto.randomUUID(),
      timestamp: Date.now(),
      status: 'completed', // Mocking success
      formData: {
        subject: formData.subject,
        audience: formData.audience,
        level: formData.level,
        topic: formData.topic,
        formats: { ...formData.formats },
        teachingWeeks: formData.teachingWeeks,
        lecturesPerWeek: formData.lecturesPerWeek,
        presentationsPerWeek: formData.presentationsPerWeek,
        testQuestions: formData.testQuestions,
      },
    };

    this.history.update(currentHistory => [historyItem, ...currentHistory]);
    this.saveHistory();

    return new Observable(observer => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% chance of success
        if (success) {
          observer.next({ success: true, message: 'Materials generated successfully!' });
        } else {
          historyItem.status = 'failed';
          this.history.update(current => current.map(h => h.id === historyItem.id ? historyItem : h));
          this.saveHistory();
          observer.next({ success: false, message: 'Generation failed. Please try again.' });
        }
        observer.complete();
      }, 5000); // 5-second delay
    });
  }

  private loadHistory(): GenerationHistoryItem[] {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(this.HISTORY_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  }

  private saveHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history()));
    }
  }
}