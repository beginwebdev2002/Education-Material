import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../shared/services/settings.service';

@Component({
  selector: 'app-system-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
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