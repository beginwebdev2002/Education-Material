import { Injectable, effect, signal } from '@angular/core';

import en from '@locale/en.json';
import ru from '@locale/ru.json';
import tj from '@locale/tj.json';

export type Locale = 'en' | 'ru' | 'tj';

export interface LocaleInfo {
    code: Locale;
    labelShort: string;
    flag: string;
    name: string;
}

type TranslationDict = { [key: string]: string | TranslationDict };

const LOCALE_KEY = 'locale';

@Injectable({ providedIn: 'root' })
export class TranslationService {
    readonly locales: LocaleInfo[] = [
        { code: 'en', labelShort: 'EN', flag: '/flags/usa.png', name: 'English' },
        { code: 'ru', labelShort: 'RU', flag: '/flags/russian.png', name: 'Русский' },
        { code: 'tj', labelShort: 'TJ', flag: '/flags/tajikistan.png', name: 'Тоҷикӣ' },
    ];

    private readonly dictionaries: Record<Locale, TranslationDict> = {
        en: en as TranslationDict,
        ru: ru as TranslationDict,
        tj: tj as TranslationDict,
    };

    locale = signal<Locale>(this.getInitialLocale());

    constructor() {
        effect(() => localStorage.setItem(LOCALE_KEY, this.locale()));
    }

    setLocale(locale: Locale): void {
        this.locale.set(locale);
    }

    current(): LocaleInfo {
        return this.locales.find(l => l.code === this.locale()) ?? this.locales[0];
    }

    translate(key: string, params?: Record<string, string | number>): string {
        const dict = this.dictionaries[this.locale()];
        const raw = key.split('.').reduce<TranslationDict | string | undefined>(
            (acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined),
            dict
        );
        let text = typeof raw === 'string' ? raw : key;

        if (params) {
            for (const [paramKey, value] of Object.entries(params)) {
                text = text.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(value));
            }
        }

        return text;
    }

    private getInitialLocale(): Locale {
        if (typeof window === 'undefined') {
            return 'en';
        }

        const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
        if (stored && this.locales.some(l => l.code === stored)) {
            return stored;
        }

        return 'en';
    }
}
