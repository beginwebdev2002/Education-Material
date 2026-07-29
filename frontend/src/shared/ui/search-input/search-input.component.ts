import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  placeholder = input<string>('');
  value = input<string>('');
  debounceMs = input<number>(300);

  search = output<string>();

  term = signal('');
  private readonly termChanges = new Subject<string>();

  ngOnInit(): void {
    this.term.set(this.value());
    this.termChanges
      .pipe(debounceTime(this.debounceMs()), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => this.search.emit(term));
  }

  onInput(value: string): void {
    this.term.set(value);
    this.termChanges.next(value);
  }
}
