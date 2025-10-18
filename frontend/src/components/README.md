# Frontend Components

## Описание

Папка `components` содержит переиспользуемые UI компоненты приложения. Эти компоненты специфичны для проекта Education Material и дополняют Flowbite блоки.

## Структура

```
components/
├── header/               # Заголовок приложения
├── footer/               # Подвал приложения
├── sidebar/              # Боковая панель
├── breadcrumb/           # Хлебные крошки
├── search/               # Поиск
├── filters/              # Фильтры
├── pagination/           # Пагинация
├── loading/              # Индикаторы загрузки
├── error/                # Компоненты ошибок
├── empty-state/          # Пустые состояния
├── confirmation/         # Диалоги подтверждения
└── tooltip/              # Подсказки
```

## Компоненты

### HeaderComponent
Навигационная панель с меню и пользовательским меню:

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Signal-based state
  isMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  
  // Configuration
  menuItems = signal([
    { label: 'Главная', route: '/home', icon: 'home' },
    { label: 'Панель', route: '/dashboard', icon: 'dashboard' },
    { label: 'Документы', route: '/documents', icon: 'documents' },
    { label: 'Профиль', route: '/profile', icon: 'user' }
  ]);
  
  userMenuItems = signal([
    { label: 'Профиль', route: '/profile' },
    { label: 'Настройки', route: '/settings' },
    { label: 'Помощь', route: '/help' },
    { label: 'Выход', action: 'logout' }
  ]);
  
  // Methods
  toggleMenu() {
    this.isMenuOpen.update(isOpen => !isOpen);
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen.update(isOpen => !isOpen);
  }
  
  closeMenus() {
    this.isMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }
  
  handleUserAction(action: string) {
    if (action === 'logout') {
      // Логика выхода
    }
    this.closeMenus();
  }
}
```

### SearchComponent
Компонент поиска с автодополнением:

```typescript
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input
        type="text"
        [(ngModel)]="searchQuery"
        (input)="onSearch($event)"
        (focus)="showSuggestions.set(true)"
        (blur)="hideSuggestions()"
        placeholder="Поиск..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      />
      
      <!-- Suggestions -->
      <div 
        *ngIf="showSuggestions() && suggestions().length > 0"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
      >
        <div 
          *ngFor="let suggestion of suggestions(); trackBy: trackBySuggestion"
          (click)="selectSuggestion(suggestion)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50"
        >
          <span class="font-normal block truncate">{{ suggestion.title }}</span>
          <span class="text-gray-500 text-sm">{{ suggestion.type }}</span>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent {
  searchQuery = '';
  suggestions = signal<SearchSuggestion[]>([]);
  showSuggestions = signal(false);
  
  search = output<string>();
  suggestionSelected = output<SearchSuggestion>();
  
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.search.emit(query);
    this.loadSuggestions(query);
  }
  
  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchQuery = suggestion.title;
    this.suggestionSelected.emit(suggestion);
    this.showSuggestions.set(false);
  }
  
  hideSuggestions() {
    setTimeout(() => this.showSuggestions.set(false), 200);
  }
  
  trackBySuggestion(index: number, suggestion: SearchSuggestion) {
    return suggestion.id;
  }
  
  private loadSuggestions(query: string) {
    if (query.length < 2) {
      this.suggestions.set([]);
      return;
    }
    
    // Логика загрузки предложений
  }
}
```

### LoadingComponent
Индикатор загрузки:

```typescript
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClasses()">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" 
           [class]="spinnerClasses()"></div>
      <span *ngIf="showText()" class="ml-2 text-gray-600 dark:text-gray-400">
        {{ text() }}
      </span>
    </div>
  `
})
export class LoadingComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  variant = input<'default' | 'overlay' | 'inline'>('default');
  text = input('Загрузка...');
  showText = input(true);
  
  containerClasses = computed(() => {
    const baseClasses = 'flex items-center justify-center';
    const variantClasses = {
      default: 'p-4',
      overlay: 'fixed inset-0 bg-white bg-opacity-75 z-50',
      inline: 'p-2'
    };
    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });
  
  spinnerClasses = computed(() => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return `animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[this.size()]}`;
  });
}
```

### EmptyStateComponent
Компонент для пустых состояний:

```typescript
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12">
      <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
        <ng-content select="[slot=icon]"></ng-content>
      </div>
      
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ title() }}
      </h3>
      
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {{ description() }}
      </p>
      
      <div class="flex justify-center">
        <ng-content select="[slot=action]"></ng-content>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  title = input('Нет данных');
  description = input('Здесь пока ничего нет');
}
```

### ConfirmationDialogComponent
Диалог подтверждения:

```typescript
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
             (click)="close()"></div>
        
        <!-- Dialog -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ title() }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              (click)="confirm()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ confirmText() }}
            </button>
            <button
              type="button"
              (click)="close()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ cancelText() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationDialogComponent {
  isOpen = signal(false);
  title = input('Подтверждение');
  message = input('Вы уверены?');
  confirmText = input('Подтвердить');
  cancelText = input('Отмена');
  
  confirmed = output<void>();
  cancelled = output<void>();
  
  open() {
    this.isOpen.set(true);
  }
  
  close() {
    this.isOpen.set(false);
  }
  
  confirm() {
    this.confirmed.emit();
    this.close();
  }
  
  cancel() {
    this.cancelled.emit();
    this.close();
  }
}
```

## Использование компонентов

### Импорт в модуле
```typescript
import { HeaderComponent, SearchComponent, LoadingComponent } from '@frontend/components';

@Component({
  imports: [HeaderComponent, SearchComponent, LoadingComponent],
  template: `
    <app-header />
    <app-search (search)="onSearch($event)" />
    <app-loading *ngIf="loading()" [text]="'Загрузка данных...'" />
  `
})
export class ExampleComponent {
  loading = signal(false);
  
  onSearch(query: string) {
    this.loading.set(true);
    // Логика поиска
  }
}
```

### Использование EmptyState
```typescript
@Component({
  template: `
    <app-empty-state 
      title="Нет материалов"
      description="Создайте свой первый учебный материал"
    >
      <div slot="icon">
        <svg class="h-24 w-24" fill="currentColor" viewBox="0 0 20 20">
          <!-- Icon SVG -->
        </svg>
      </div>
      
      <button slot="action" class="btn-primary">
        Создать материал
      </button>
    </app-empty-state>
  `
})
export class EmptyMaterialsComponent {}
```

## Создание нового компонента

### 1. Структура папки
```
components/component-name/
├── component-name.component.ts
├── component-name.component.html
├── component-name.component.scss
├── component-name.types.ts
├── component-name.spec.ts
└── README.md
```

### 2. Шаблон компонента
```typescript
import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss']
})
export class ComponentNameComponent {
  // Input signals
  variant = input<'default' | 'custom'>('default');
  
  // Output events
  clicked = output<Event>();
  
  // Internal state
  isActive = signal(false);
  
  // Computed properties
  classes = computed(() => {
    // Логика вычисления классов
  });
  
  // Methods
  handleClick(event: Event) {
    this.clicked.emit(event);
  }
}
```

## Лучшие практики

1. **Signal-based architecture** для всех компонентов
2. **Standalone components** везде
3. **Content projection** для гибкости
4. **Accessibility** поддержка
5. **Responsive design** для всех устройств
6. **Темная тема** поддержка
7. **Тестирование** всех компонентов
8. **Документация** для каждого компонента
