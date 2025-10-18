# Angular Zoneless Signal-Based Architecture - Правила для Cursor AI

## Созданные файлы правил:

### 1. `.cursor/rules/frontend.mdc` - Основные правила
- **Описание**: Основные принципы Angular zoneless/signal-based архитектуры
- **Всегда применяется**: Да
- **Содержит**:
  - Принципы zoneless change detection
  - Signal-based state management
  - Standalone components
  - Modern Angular patterns
  - Примеры правильного и неправильного кода

### 2. `.cursor/rules/angular-signals.mdc` - Детальные практики signals
- **Описание**: Подробные практики работы с Angular signals
- **Всегда применяется**: Да
- **Содержит**:
  - Типы signals (writable, readonly, computed, effect)
  - Паттерны для компонентов
  - Сервисы с signals
  - Работа с HTTP и async operations
  - Template integration
  - Performance tips

### 3. `.cursor/rules/angular-forms.mdc` - Формы в zoneless режиме
- **Описание**: Правила работы с формами в zoneless режиме
- **Всегда применяется**: Да
- **Содержит**:
  - Reactive forms с signals
  - Signal-based forms
  - Динамические формы
  - Валидация форм
  - Кастомные валидаторы
  - Лучшие практики

## Примеры кода:

### Обновленный HeaderComponent
- Показывает правильное использование `signal()` вместо обычных свойств
- Демонстрирует `update()` и `set()` методы для signals
- Обновленный template с вызовами signal функций

### UserService
- Полноценный сервис с signal-based state management
- Private writable signals для внутреннего состояния
- Public readonly signals для внешнего API
- Computed signals для производных значений
- Async operations с proper error handling

### UserManagementComponent
- Компонент, использующий все возможности signals
- Демонстрирует computed signals для фильтрации
- Показывает правильную работу с формами
- Использует современные Angular patterns

## Ключевые принципы:

1. **Всегда используйте signals** для реактивного состояния
2. **НЕ используйте обычные свойства** класса для состояния
3. **Используйте computed()** для производных значений
4. **Используйте effect()** для побочных эффектов
5. **Все компоненты standalone** с `standalone: true`
6. **Используйте input() и output()** вместо старых декораторов
7. **Используйте inject()** вместо constructor injection
8. **Используйте новую control flow syntax** (`@if`, `@for`, `@switch`)

## Что НЕ делать:

- ❌ Обычные свойства класса для состояния
- ❌ Старые декораторы `@Input()`, `@Output()`
- ❌ Constructor injection
- ❌ Zone.js для change detection
- ❌ Мутация объектов без signals

Теперь Cursor AI будет понимать специфику вашего Angular проекта и предлагать код, соответствующий zoneless signal-based архитектуре!
