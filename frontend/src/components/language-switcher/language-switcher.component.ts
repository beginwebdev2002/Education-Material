import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizationService, SupportedLanguage } from '@core/services/localization.service';

@Component({
   selector: 'app-language-switcher',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
        <span>{{ localizationService.currentLanguageName() }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      @if (isDropdownOpen()) {
        <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div class="py-1">
            @for (language of localizationService.availableLanguages(); track language.code) {
              <button
                (click)="selectLanguage(language.code)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                [class.bg-primary-50]="localizationService.currentLanguage() === language.code"
                [class.text-primary-700]="localizationService.currentLanguage() === language.code"
              >
                <div class="flex items-center justify-between">
                  <span>{{ language.name }}</span>
                  @if (localizationService.currentLanguage() === language.code) {
                    <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  }
                </div>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class LanguageSwitcherComponent {
   localizationService = inject(LocalizationService);
   isDropdownOpen = signal(false);

   toggleDropdown() {
      this.isDropdownOpen.update(isOpen => !isOpen);
   }

   selectLanguage(language: SupportedLanguage) {
      this.localizationService.setLanguage(language);
      this.isDropdownOpen.set(false);
   }
}
