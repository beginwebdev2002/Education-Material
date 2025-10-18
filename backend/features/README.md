# Backend Features Module

## Описание

Модуль `features` содержит бизнес-функции приложения. Каждая фича представляет собой отдельный модуль с изолированной логикой для конкретной функциональности.

## Архитектура

Каждая фича следует принципам Domain-Driven Design (DDD) и содержит:
- Контроллеры для обработки HTTP запросов
- Сервисы для бизнес-логики
- DTO для передачи данных
- Entities для работы с базой данных
- Интерфейсы для абстракций

## Структура фичи

```
features/feature-name/
├── dto/                    # Data Transfer Objects
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── feature-response.dto.ts
├── entities/               # Сущности базы данных
│   └── feature.entity.ts
├── interfaces/             # Интерфейсы
│   └── feature.interface.ts
├── services/               # Сервисы
│   └── feature.service.ts
├── controllers/             # Контроллеры
│   └── feature.controller.ts
├── feature.module.ts        # Модуль фичи
└── feature.spec.ts         # Тесты
```

## Планируемые фичи

### 1. Auth Feature
**Цель**: Аутентификация и авторизация пользователей
- Регистрация и вход в систему
- JWT токены
- Управление сессиями
- Восстановление пароля

### 2. Users Feature
**Цель**: Управление пользователями
- CRUD операции для пользователей
- Роли и права доступа
- Профили пользователей
- Активация/деактивация аккаунтов

### 3. Materials Feature
**Цель**: Управление учебными материалами
- Создание и редактирование материалов
- Категории и теги
- Версионирование материалов
- Поиск и фильтрация

### 4. AI Generation Feature
**Цель**: Генерация материалов с помощью ИИ
- Интеграция с ИИ API
- Шаблоны для генерации
- История генераций
- Настройки генерации

### 5. Documents Feature
**Цель**: Управление документами
- Загрузка и хранение файлов
- Конвертация форматов
- Шаринг документов
- Версионирование

### 6. Analytics Feature
**Цель**: Аналитика и отчеты
- Статистика использования
- Отчеты по материалам
- Метрики пользователей
- Дашборд аналитики

### 7. Notifications Feature
**Цель**: Уведомления пользователей
- Email уведомления
- Push уведомления
- Настройки уведомлений
- История уведомлений

## Создание новой фичи

### 1. Генерация модуля
```bash
nest generate module features/new-feature
```

### 2. Генерация контроллера
```bash
nest generate controller features/new-feature
```

### 3. Генерация сервиса
```bash
nest generate service features/new-feature
```

### 4. Создание DTO
```typescript
// dto/create-new-feature.dto.ts
export class CreateNewFeatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;
}
```

### 5. Создание Entity
```typescript
// entities/new-feature.entity.ts
@Entity('new_features')
export class NewFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Правила разработки

### 1. Изоляция
- Каждая фича должна быть независимой
- Минимальные зависимости между фичами
- Использование событий для взаимодействия

### 2. Консистентность
- Единый стиль кода
- Стандартная структура папок
- Общие паттерны и подходы

### 3. Тестирование
- Unit тесты для сервисов
- Integration тесты для контроллеров
- E2E тесты для API

### 4. Документация
- README для каждой фичи
- JSDoc комментарии
- API документация

## Интеграция

Фичи интегрируются в основное приложение через импорт в `app.module.ts`:

```typescript
@Module({
  imports: [
    AuthModule,
    UsersModule,
    MaterialsModule,
    // ... другие модули
  ],
})
export class AppModule {}
```

## Мониторинг

Каждая фича должна предоставлять:
- Health check endpoint
- Метрики производительности
- Логирование операций
- Обработку ошибок
