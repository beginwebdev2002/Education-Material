import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@shared/services';
import { TranslatePipe } from '@shared/pipes';
import { SYSTEM_SETTINGS_LANGUAGES } from '../../config/system-settings-languages';

@Component({
  selector: 'app-system-settings-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemSettingsComponent {
  settingsService = inject(SettingsService);

  languages = SYSTEM_SETTINGS_LANGUAGES;
}