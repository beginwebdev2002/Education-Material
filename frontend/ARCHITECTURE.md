# Frontend Architecture - Education Material

## Описание

Frontend часть системы Education Material, построенная на **Angular 20+** с использованием **Zoneless Change Detection** и **Signal-based архитектуры**. Проект интегрирован с **Flowbite Blocks** для создания современного UI.

## Технологический стек

- **Angular 20+** - основной фреймворк
- **Zoneless Change Detection** - без Zone.js
- **Angular Signals** - реактивное состояние
- **Tailwind CSS** - стилизация
- **Flowbite** - UI компоненты и блоки
- **TypeScript** - типизация

## Архитектура

Проект использует **Feature Sliced Design (FSD)** с адаптацией для Flowbite Blocks:

```
src/
├── app/                    # Главный модуль приложения
├── components/            # UI компоненты
├── pages/                 # Страницы приложения (с Flowbite шаблонами)
├── features/              # Бизнес-функции
├── core/                  # Ядро приложения
├── shared/                # Переиспользуемые ресурсы
├── layouts/               # Макеты страниц
└── assets/                # Статические ресурсы
```

## Структура папок

### `/src/app/`
Главный модуль приложения:
- `app.ts` - корневой компонент
- `app.config.ts` - конфигурация приложения
- `app.routes.ts` - маршруты
- `app.html` - главный шаблон
- `app.scss` - глобальные стили

### `/src/components/`
UI компоненты приложения:
- Переиспользуемые компоненты
- Компоненты, специфичные для проекта
- Адаптированные Flowbite компоненты

### `/src/pages/`
Страницы приложения с Flowbite шаблонами:
- Готовые шаблоны из Flowbite Blocks
- Адаптированные под проект Education Material
- Signal-based архитектура

### `/src/layouts/`
Макеты страниц:
- Основные макеты приложения
- Макеты для разных типов страниц
- Компоновка компонентов

### `/src/pages/`
Страницы приложения:
- Компоненты страниц
- Композиция блоков и компонентов
- Бизнес-логика страниц

### `/src/features/`
Бизнес-функции:
- Изолированные фичи
- Специфичная бизнес-логика
- Компоненты фич

### `/src/core/`
Ядро приложения:
- Сервисы
- Интерцепторы
- Гварды
- Утилиты

### `/src/shared/`
Переиспользуемые ресурсы:
- Типы и интерфейсы
- Константы
- Утилиты
- Хелперы

## Flowbite Integration

### Использование готовых шаблонов
Проект использует готовые шаблоны из [Flowbite Blocks](https://flowbite.com/blocks/) для создания страниц:

- **Home Page** - Landing page шаблон
- **Dashboard** - Admin dashboard шаблон  
- **Profile** - User profile шаблон
- **Admin** - Admin panel шаблон
- **Documentation** - Documentation шаблон

### Адаптация шаблонов
```typescript
// Пример адаптации Flowbite шаблона для Home страницы
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Flowbite Hero Section -->
    <section class="bg-white dark:bg-gray-900">
      <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            {{ heroTitle() }}
          </h1>
          <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            {{ heroSubtitle() }}
          </p>
          <a href="/dashboard" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
            Начать работу
            <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </a>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="/assets/hero-image.svg" alt="Education Material">
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent {
  heroTitle = signal('Автоматизация учебных материалов');
  heroSubtitle = signal('Создавайте качественные учебные материалы с помощью ИИ');
}
```

## Signal-based Architecture

### Основные принципы
1. **Всегда используйте signals** для реактивного состояния
2. **Используйте computed()** для производных значений
3. **Используйте effect()** для побочных эффектов
4. **Standalone компоненты** везде

### Пример компонента
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <div>
      <h1>{{ title() }}</h1>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class ExampleComponent {
  title = signal('Example');
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1);
  }
}
```

## Path Aliases

Настроены следующие алиасы:

```typescript
"@frontend/*"           → src/*
"@frontend/app/*"       → src/app/*
"@frontend/components/*" → src/components/*
"@frontend/layouts/*"   → src/layouts/*
"@frontend/pages/*"     → src/pages/*
"@frontend/features/*"  → src/features/*
"@frontend/core/*"      → src/core/*
"@frontend/shared/*"    → src/shared/*
"@frontend/assets/*"    → src/assets/*
```

## Стилизация

### Tailwind CSS
- Utility-first подход
- Кастомная конфигурация
- Темная тема поддержка

### Flowbite
- Готовые компоненты
- Адаптивный дизайн
- Accessibility поддержка

### Кастомные стили
```scss
// app.scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

// Кастомные компоненты
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

## Разработка

### Создание новой страницы с Flowbite шаблоном
```bash
# Создать страницу
ng generate component pages/page-name --standalone

# Структура страницы
pages/page-name/
├── page-name.component.ts
├── page-name.component.html
├── page-name.component.scss
└── README.md
```

### Адаптация Flowbite шаблона
1. Выберите подходящий шаблон с [Flowbite Blocks](https://flowbite.com/blocks/)
2. Скопируйте HTML код в template компонента
3. Адаптируйте под signal-based архитектуру
4. Добавьте необходимую логику
5. Стилизуйте под дизайн проекта

### Создание страницы
```bash
# Создать страницу
ng generate component pages/page-name --standalone

# Структура страницы
pages/page-name/
├── page-name.component.ts
├── page-name.component.html
├── page-name.component.scss
└── README.md
```

## Тестирование

### Unit тесты
```bash
ng test
```

### E2E тесты
```bash
ng e2e
```

## Сборка

### Development
```bash
ng serve
```

### Production
```bash
ng build --configuration production
```

## Лучшие практики

1. **Используйте signals** для всех реактивных состояний
2. **Standalone компоненты** везде
3. **Flowbite шаблоны** для страниц из [Flowbite Blocks](https://flowbite.com/blocks/)
4. **Feature Sliced Design** для организации
5. **Типизация** для всех компонентов
6. **Тестирование** для критической логики
7. **Документация** для каждого компонента

## Расширение

При добавлении новых страниц:
1. Выберите подходящий шаблон с Flowbite Blocks
2. Создайте компонент страницы
3. Адаптируйте шаблон под signal-based архитектуру
4. Добавьте необходимую бизнес-логику
5. Используйте Flowbite шаблоны где возможно
6. Добавьте тесты и документацию
7. Обновите архитектурную документацию