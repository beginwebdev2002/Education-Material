import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MockGenerationService } from '@shared/services';
import { GenerationHistoryItem } from '@shared/models';

@Component({
  selector: 'app-generation-history',
  imports: [CommonModule, DatePipe],
  templateUrl: './generation-history.component.html',
  styleUrls: ['./generation-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerationHistoryComponent {
  // FIX: Added explicit type to generationService to resolve 'unknown' type error.
  private generationService: MockGenerationService = inject(MockGenerationService);
  rerunRequest = output<GenerationHistoryItem>();

  history = this.generationService.history;

  onRerun(item: GenerationHistoryItem) {
    this.rerunRequest.emit(item);
  }
}