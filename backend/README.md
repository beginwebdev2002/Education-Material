# Backend API - Education Material

## Описание

Backend часть системы Education Material, построенная на **NestJS** фреймворке. Предоставляет RESTful API для frontend приложения, включая управление пользователями, создание учебных материалов и административные функции.

## Технологический стек

- **NestJS 11+** - основной фреймворк
- **TypeScript** - язык программирования
- **ESLint** - линтинг кода
- **Jest** - тестирование
- **Prettier** - форматирование кода

## Архитектура

Проект использует модульную архитектуру NestJS с разделением на:

```
src/
├── app/              # Главный модуль приложения
├── core/             # Ядро приложения (гварды, интерцепторы, декораторы)
├── features/         # Бизнес-функции (модули)
├── shared/           # Переиспользуемые ресурсы
└── main.ts           # Точка входа приложения
```

## Структура папок

### `/src/app/`
Основной модуль приложения, содержащий:
- `app.module.ts` - корневой модуль
- `app.controller.ts` - основной контроллер
- `app.service.ts` - основной сервис

### `/src/core/`
Ядро приложения с общими компонентами:
- Гварды для аутентификации и авторизации
- Интерцепторы для обработки запросов/ответов
- Декораторы для кастомной логики
- Фильтры для обработки исключений

### `/src/features/`
Бизнес-функции приложения:
- Каждая фича - отдельный модуль
- Содержит контроллеры, сервисы, DTO, entities
- Изолированная логика для конкретной функциональности

### `/src/shared/`
Переиспользуемые ресурсы:
- DTO для общих структур данных
- Утилиты и хелперы
- Константы и конфигурации
- Типы и интерфейсы

## API Endpoints

### Аутентификация
- `POST /auth/login` - вход в систему
- `POST /auth/register` - регистрация
- `POST /auth/logout` - выход из системы
- `POST /auth/refresh` - обновление токена

### Пользователи
- `GET /users` - получить список пользователей
- `GET /users/:id` - получить пользователя по ID
- `POST /users` - создать нового пользователя
- `PUT /users/:id` - обновить пользователя
- `DELETE /users/:id` - удалить пользователя

### Учебные материалы
- `GET /materials` - получить список материалов
- `GET /materials/:id` - получить материал по ID
- `POST /materials` - создать новый материал
- `PUT /materials/:id` - обновить материал
- `DELETE /materials/:id` - удалить материал

### Административные функции
- `GET /admin/stats` - получить статистику
- `GET /admin/users` - управление пользователями
- `POST /admin/materials/generate` - генерация материалов с ИИ

## Установка и запуск

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run start:dev
```

### Запуск в продакшене
```bash
npm run build
npm run start:prod
```

### Тестирование
```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие тестами
npm run test:cov
```

### Линтинг и форматирование
```bash
# Линтинг
npm run lint

# Форматирование
npm run format
```

## Конфигурация

### Переменные окружения
Создайте файл `.env` в корне проекта:

```env
# Порт сервера
PORT=3000

# База данных
DATABASE_URL=postgresql://user:password@localhost:5432/education_material

# JWT секрет
JWT_SECRET=your-secret-key

# ИИ API ключ
AI_API_KEY=your-ai-api-key
```

## Разработка

### Создание нового модуля
```bash
# Создать модуль
nest generate module features/feature-name

# Создать контроллер
nest generate controller features/feature-name

# Создать сервис
nest generate service features/feature-name
```

### Структура модуля
```
features/feature-name/
├── dto/              # Data Transfer Objects
├── entities/         # Сущности базы данных
├── interfaces/       # Интерфейсы
├── feature-name.controller.ts
├── feature-name.service.ts
├── feature-name.module.ts
└── feature-name.spec.ts
```

## Документация API

API документация доступна по адресу `/api/docs` (Swagger UI) после запуска сервера.

## Безопасность

- JWT токены для аутентификации
- Роли пользователей (teacher, student, admin)
- Валидация входных данных
- CORS настройки
- Rate limiting

## Мониторинг

- Логирование запросов
- Метрики производительности
- Обработка ошибок
- Health check endpoint

## Лицензия

Проект распространяется под лицензией MIT.