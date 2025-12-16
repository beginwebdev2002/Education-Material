import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, Theme, FontSize, FontFamily } from '@shared/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class SettingsComponent {
  settingsService = inject(SettingsService);

  setTheme(theme: Theme) {
    this.settingsService.theme.set(theme);
  }

  setFontSize(size: FontSize) {
    this.settingsService.setFontSize(size);
  }

  setFontFamily(family: FontFamily) {
    this.settingsService.setFontFamily(family);
  }
}