import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { Dropdown } from 'flowbite';
import { Locale, TranslationService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements AfterViewInit, OnDestroy {
  i18n = inject(TranslationService);

  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panelRef = viewChild.required<ElementRef<HTMLDivElement>>('panel');
  private dropdown?: Dropdown;

  ngAfterViewInit(): void {
    this.dropdown = new Dropdown(this.panelRef().nativeElement, this.triggerRef().nativeElement, {
      placement: 'bottom-end',
    });
  }

  ngOnDestroy(): void {
    this.dropdown?.destroy();
  }

  select(locale: Locale): void {
    this.i18n.setLocale(locale);
    this.dropdown?.hide();
  }
}
