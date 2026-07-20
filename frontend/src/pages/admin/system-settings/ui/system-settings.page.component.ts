import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes';
import { SYSTEM_SETTINGS_LANGUAGES } from '../config/system-settings-languages';

@Component({
  selector: 'app-system-settings-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './system-settings.page.component.html',
  styleUrls: ['./system-settings.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemSettingsPageComponent {
  settingsService = inject(SettingsService);

  languages = SYSTEM_SETTINGS_LANGUAGES;
}