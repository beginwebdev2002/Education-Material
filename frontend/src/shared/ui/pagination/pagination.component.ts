import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-pagination',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  page = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();

  pageChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));
  canPrev = computed(() => this.page() > 1);
  canNext = computed(() => this.page() < this.totalPages());

  rangeStart = computed(() => (this.total() === 0 ? 0 : (this.page() - 1) * this.limit() + 1));
  rangeEnd = computed(() => Math.min(this.page() * this.limit(), this.total()));

  prev(): void {
    if (this.canPrev()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next(): void {
    if (this.canNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
