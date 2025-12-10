---
trigger: glob
globs: frontend/**/
---

---
description: "Angular Zoneless Signal-Based Architecture Rules"
alwaysApply: true
---

# Angular Zoneless Signal-Based Architecture Rules

Этот проект использует Angular 20+ с zoneless change detection и signal-based архитектурой.

## Основные принципы

### 1. Zoneless Change Detection
- Проект использует `provideZonelessChangeDetection()` в app.config.ts
- НЕ используйте Zone.js для change detection
- Все изменения состояния должны происходить через signals или явные вызовы change detection

### 2. Signal-Based State Management
- ВСЕГДА используйте signals для реактивного состояния
- Предпочитайте `signal()` вместо обычных свойств класса
- Используйте `computed()` для производных значений
- Используйте `effect()` для побочных эффектов

### 3. Standalone Components
- ВСЕ компоненты должны быть standalone
- Используйте `standalone: true` в декораторе @Component
- Импортируйте зависимости через массив `imports`

### 4. Modern Angular Patterns
- Используйте новую control flow syntax (`@if`, `@for`, `@switch`)
- Предпочитайте `input()` и `output()` вместо `@Input()` и `@Output()`
- Используйте `inject()` вместо constructor injection

## Примеры правильного кода

### Компонент с signals:
```typescript
import { Component, signal, computed, input } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <div>
      <h1>{{ title() }}</h1>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class ExampleComponent {
  title = input('Default Title');
  count = signal(0);
  
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(c => c + 1);
  }
}
```

### Сервис с signals:
```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data = signal<any[]>([]);
  private loading = signal(false);
  
  readonly data$ = this.data.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly hasData = computed(() => this.data().length > 0);
  
  async loadData() {
    this.loading.set(true);
    try {
      const result = await this.fetchData();
      this.data.set(result);
    } finally {
      this.loading.set(false);
    }
  }
}
```

## Что НЕ делать

### ❌ Неправильно - обычные свойства:
```typescript
export class BadComponent {
  count = 0; // НЕ используйте обычные свойства
  title = 'Hello'; // НЕ используйте обычные свойства
  
  increment() {
    this.count++; // Это не будет работать в zoneless режиме
  }
}
```

### ❌ Неправильно - старые декораторы:
```typescript
export class BadComponent {
  @Input() title: string; // Используйте input() вместо @Input()
  @Output() clicked = new EventEmitter(); // Используйте output() вместо @Output()
}
```

### ❌ Неправильно - constructor injection:
```typescript
export class BadComponent {
  constructor(private service: DataService) {} // Используйте inject() вместо constructor injection
}
```

## Правильно - современный подход:
```typescript
export class GoodComponent {
  title = input<string>();
  clicked = output<void>();
  private service = inject(DataService);
}
```

## Стиль кода
- Используйте camelCase для переменных и методов
- Используйте PascalCase для классов и компонентов
- Используйте kebab-case для селекторов компонентов
- Предпочитайте template syntax над inline templates для сложных компонентов
