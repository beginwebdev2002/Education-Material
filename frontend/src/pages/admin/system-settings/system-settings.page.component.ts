import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-system-settings-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './system-settings.page.component.html',
  styleUrls: ['./system-settings.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemSettingsPageComponent {
  settingsService = inject(SettingsService);

  languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'ru-RU', name: 'Russian' },
  ];
}