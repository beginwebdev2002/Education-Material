# Локализация в Angular приложении

## Обзор

Приложение поддерживает многоязычность с использованием Angular Signals и zoneless change detection. Поддерживаются следующие языки:

- **English (en)** - Английский
- **Русский (ru)** - Русский  
- **Тоҷикӣ (tg)** - Таджикский

## Архитектура

### 1. LocalizationService

Основной сервис для управления локализацией, расположенный в `@core/services/localization.service.ts`.

**Ключевые особенности:**
- Использует Angular Signals для реактивности
- Автоматическое сохранение выбранного языка в localStorage
- Поддержка параметров в переводах
- TypeScript типизация для всех ключей переводов

**API:**
```typescript
// Изменить язык
localizationService.setLanguage('en');

// Получить перевод
const text = localizationService.translate('header.home');

// Перевод с параметрами
const text = localizationService.translateWithParams('welcome', { name: 'John' });

// Текущий язык
const currentLang = localizationService.currentLanguage();

// Доступные языки
const languages = localizationService.availableLanguages();
```

### 2. TranslatePipe

Pipe для использования в шаблонах, расположенный в `@shared/pipes/translate.pipe.ts`.

**Использование:**
```html
<!-- Простой перевод -->
{{ 'header.home' | translate }}

<!-- Перевод с параметрами -->
{{ 'welcome' | translate: { name: 'John' } }}
```

### 3. LanguageSwitcherComponent

Компонент для переключения языков, расположенный в `@components/language-switcher/`.

**Особенности:**
- Dropdown меню с доступными языками
- Визуальная индикация текущего языка
- Адаптивный дизайн

## Структура переводов

Переводы организованы в иерархической структуре:

```typescript
interface TranslationKeys {
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
```

## Добавление новых переводов

### 1. Обновить интерфейс TranslationKeys

```typescript
interface TranslationKeys {
  // ... существующие ключи
  newSection: {
    newKey: string;
  };
}
```

### 2. Добавить переводы для всех языков

```typescript
const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    // ... существующие переводы
    newSection: {
      newKey: 'New Text'
    }
  },
  ru: {
    // ... существующие переводы
    newSection: {
      newKey: 'Новый текст'
    }
  },
  tg: {
    // ... существующие переводы
    newSection: {
      newKey: 'Матни нав'
    }
  }
};
```

### 3. Использовать в шаблоне

```html
{{ 'newSection.newKey' | translate }}
```

## Добавление нового языка

### 1. Обновить тип SupportedLanguage

```typescript
export type SupportedLanguage = 'en' | 'ru' | 'tg' | 'uz';
```

### 2. Добавить переводы

```typescript
const translations: Record<SupportedLanguage, TranslationKeys> = {
  // ... существующие языки
  uz: {
    header: {
      home: 'Bosh sahifa',
      // ... остальные переводы
    },
    // ... остальные секции
  }
};
```

### 3. Добавить название языка

```typescript
const languageNames: Record<SupportedLanguage, string> = {
  // ... существующие языки
  uz: 'O\'zbek'
};
```

## Интеграция в компоненты

### Header компонент

Header компонент уже интегрирован с локализацией:

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Компонент автоматически реагирует на изменения языка
}
```

### Использование в других компонентах

```typescript
import { LocalizationService } from '@core/services/localization.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <h1>{{ 'header.home' | translate }}</h1>
    <p>{{ 'common.loading' | translate }}</p>
  `
})
export class ExampleComponent {
  private localizationService = inject(LocalizationService);
  
  // Компонент автоматически обновится при смене языка
}
```

## Лучшие практики

1. **Используйте сигналы**: Все переводы реактивны благодаря signals
2. **Типизация**: Всегда типизируйте ключи переводов
3. **Иерархия**: Организуйте переводы в логические группы
4. **Консистентность**: Используйте одинаковые ключи для похожих элементов
5. **Параметры**: Используйте параметры для динамических переводов
6. **Fallback**: Всегда предоставляйте fallback значения

## Производительность

- Переводы загружаются синхронно (встроены в код)
- Signals обеспечивают эффективную реактивность
- Минимальное влияние на производительность при смене языка
- Автоматическая очистка при изменении языка

## Отладка

Для отладки переводов используйте:

```typescript
// Проверить, поддерживается ли язык
localizationService.isLanguageSupported('en');

// Получить текущий язык
console.log(localizationService.currentLanguage());

// Получить все доступные языки
console.log(localizationService.availableLanguages());
```
