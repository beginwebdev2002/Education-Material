import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg';
export type FontFamily = 'sans' | 'serif';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  theme = signal<Theme>(this.getInitialTheme());
  fontSize = signal<FontSize>('base');
  fontFamily = signal<FontFamily>('sans');

  // New settings
  maintenanceMode = signal(this.loadSetting('maintenanceMode', false));
  userRegistration = signal(this.loadSetting('userRegistration', true));
  communityMaterials = signal(this.loadSetting('communityMaterials', true));
  maxGenerationsPerDay = signal(this.loadSetting('maxGenerationsPerDay', 50));
  defaultLanguage = signal(this.loadSetting('defaultLanguage', 'en-US'));

  constructor() {
    effect(() => localStorage.setItem('theme', this.theme()));
    effect(() => this.saveSetting('maintenanceMode', this.maintenanceMode()));
    effect(() => this.saveSetting('userRegistration', this.userRegistration()));
    effect(() => this.saveSetting('communityMaterials', this.communityMaterials()));
    effect(() => this.saveSetting('maxGenerationsPerDay', this.maxGenerationsPerDay()));
    effect(() => this.saveSetting('defaultLanguage', this.defaultLanguage()));
  }

  toggleTheme() {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  setFontSize(size: FontSize) {
    this.fontSize.set(size);
  }
  
  setFontFamily(family: FontFamily) {
    this.fontFamily.set(family);
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  // Helper methods for persisting settings
  private saveSetting<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`setting_${key}`, JSON.stringify(value));
    }
  }

  private loadSetting<T>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(`setting_${key}`);
      return value ? JSON.parse(value) : defaultValue;
    }
    return defaultValue;
  }
}