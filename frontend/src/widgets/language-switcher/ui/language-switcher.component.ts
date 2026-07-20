import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Locale, TranslationService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  i18n = inject(TranslationService);
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  select(locale: Locale): void {
    this.i18n.setLocale(locale);
    this.isOpen.set(false);
  }
}
