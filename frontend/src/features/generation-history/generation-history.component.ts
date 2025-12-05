import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MockGenerationService } from '../../shared/services/generation.service';
import { GenerationHistoryItem } from '../../shared/models/generation.model';

@Component({
  selector: 'app-generation-history',
  standalone: true,
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