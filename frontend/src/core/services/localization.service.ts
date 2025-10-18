import { Injectable, signal, computed } from '@angular/core';

export type SupportedLanguage = 'en' | 'ru' | 'tg';

export interface TranslationKeys {
   // Header translations
   header: {
      home: string;
      dashboard: string;
      documents: string;
      profile: string;
      admin: string;
      userManagement: string;
      language: string;
      logout: string;
      login: string;
   };
   // Common translations
   common: {
      loading: string;
      error: string;
      success: string;
      cancel: string;
      save: string;
      edit: string;
      delete: string;
      close: string;
   };
}

const translations: Record<SupportedLanguage, TranslationKeys> = {
   en: {
      header: {
         home: 'Home',
         dashboard: 'Dashboard',
         documents: 'Documents',
         profile: 'Profile',
         admin: 'Admin',
         userManagement: 'User Management',
         language: 'Language',
         logout: 'Logout',
         login: 'Login'
      },
      common: {
         loading: 'Loading...',
         error: 'Error',
         success: 'Success',
         cancel: 'Cancel',
         save: 'Save',
         edit: 'Edit',
         delete: 'Delete',
         close: 'Close'
      }
   },
   ru: {
      header: {
         home: 'Главная',
         dashboard: 'Панель управления',
         documents: 'Документы',
         profile: 'Профиль',
         admin: 'Админка',
         userManagement: 'Управление пользователями',
         language: 'Язык',
         logout: 'Выйти',
         login: 'Войти'
      },
      common: {
         loading: 'Загрузка...',
         error: 'Ошибка',
         success: 'Успешно',
         cancel: 'Отмена',
         save: 'Сохранить',
         edit: 'Редактировать',
         delete: 'Удалить',
         close: 'Закрыть'
      }
   },
   tg: {
      header: {
         home: 'Асосӣ',
         dashboard: 'Панели идоракунӣ',
         documents: 'Ҳуҷҷатҳо',
         profile: 'Профил',
         admin: 'Админ',
         userManagement: 'Идоракунии корбарон',
         language: 'Забон',
         logout: 'Баромадан',
         login: 'Даромадан'
      },
      common: {
         loading: 'Боргирӣ...',
         error: 'Хатогӣ',
         success: 'Муваффақият',
         cancel: 'Бекор кардан',
         save: 'Захира кардан',
         edit: 'Таҳрир кардан',
         delete: 'Ҳазф кардан',
         close: 'Пӯшидан'
      }
   }
};

const languageNames: Record<SupportedLanguage, string> = {
   en: 'English',
   ru: 'Русский',
   tg: 'Тоҷикӣ'
};

@Injectable({
   providedIn: 'root'
})
export class LocalizationService {
   // Private writable signal для текущего языка
   private _currentLanguage = signal<SupportedLanguage>('ru');

   // Public readonly signals
   readonly currentLanguage = this._currentLanguage.asReadonly();
   readonly translations = computed(() => translations[this._currentLanguage()]);

   // Computed signal для названий языков
   readonly availableLanguages = computed(() =>
      Object.keys(translations).map(code => ({
         code: code as SupportedLanguage,
         name: languageNames[code as SupportedLanguage]
      }))
   );

   // Computed signal для текущего названия языка
   readonly currentLanguageName = computed(() =>
      languageNames[this._currentLanguage()]
   );

   constructor() {
      // Загружаем сохраненный язык из localStorage
      const savedLanguage = localStorage.getItem('app-language') as SupportedLanguage;
      if (savedLanguage && translations[savedLanguage]) {
         this._currentLanguage.set(savedLanguage);
      }
   }

   /**
    * Изменить текущий язык
    */
   setLanguage(language: SupportedLanguage): void {
      if (translations[language]) {
         this._currentLanguage.set(language);
         localStorage.setItem('app-language', language);
      }
   }

   /**
    * Получить перевод по ключу
    */
   translate(key: string): string {
      const keys = key.split('.');
      let value: any = this.translations();

      for (const k of keys) {
         if (value && typeof value === 'object' && k in value) {
            value = value[k];
         } else {
            console.warn(`Translation key "${key}" not found`);
            return key;
         }
      }

      return typeof value === 'string' ? value : key;
   }

   /**
    * Получить перевод с параметрами
    */
   translateWithParams(key: string, params: Record<string, string | number>): string {
      let translation = this.translate(key);

      Object.entries(params).forEach(([paramKey, paramValue]) => {
         translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });

      return translation;
   }

   /**
    * Проверить, поддерживается ли язык
    */
   isLanguageSupported(language: string): language is SupportedLanguage {
      return language in translations;
   }

   /**
    * Получить направление текста для текущего языка
    */
   getTextDirection(): 'ltr' | 'rtl' {
      // Для таджикского языка можно использовать RTL, но обычно используется LTR
      return 'ltr';
   }
}
