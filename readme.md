# Education Material Project

## Описание проекта

**Education Material** - это полнофункциональная система для автоматизации создания учебных материалов с помощью ИИ. Проект состоит из frontend (Angular) и backend (NestJS) частей.

## Архитектура проекта

Проект использует **монорепозиторий** структуру с разделением на frontend и backend:

```
Education Material/
├── frontend/          # Angular 20+ приложение (Zoneless + Signals)
├── backend/           # NestJS API сервер
├── .cursor/           # Конфигурация Cursor AI
├── LICENSE            # Лицензия проекта
└── readme.md          # Основная документация
```

## Технологический стек

### Frontend
- **Angular 20+** с Zoneless Change Detection
- **Angular Signals** для реактивного состояния
- **Tailwind CSS** для стилизации
- **Flowbite** для UI компонентов
- **TypeScript** для типизации

### Backend
- **NestJS** для API сервера
- **TypeScript** для типизации
- **ESLint** для линтинга кода

## Основные функции

1. **Автоматизация создания учебных материалов**
2. **Управление пользователями** (учителя, студенты, администраторы)
3. **Панель управления** для мониторинга
4. **Система документов** для хранения материалов
5. **Профили пользователей** с настройками

## Структура папок

### Frontend (`/frontend`)
- Современное Angular приложение с signal-based архитектурой
- Использует Feature Sliced Design для организации кода
- Интегрирован с Flowbite для UI компонентов

### Backend (`/backend`)
- NestJS API сервер
- Модульная архитектура с разделением на features
- RESTful API для взаимодействия с frontend

### Конфигурация (`.cursor/`)
- Правила для Cursor AI
- Настройки для понимания Angular zoneless архитектуры

## Быстрый старт

### Установка зависимостей
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### Запуск проекта
```bash
# Frontend (порт 4200)
cd frontend
npm start

# Backend (порт 3000)
cd backend
npm run start:dev
```

## Документация

- [Frontend Architecture](./frontend/ARCHITECTURE.md)
- [Backend Documentation](./backend/README.md)
- [Cursor AI Rules](./.cursor/rules/)

## Лицензия

Проект распространяется под лицензией, указанной в файле [LICENSE](./LICENSE).

## Контрибьюторы

- Основной разработчик: [Ваше имя]

## Поддержка

Для получения поддержки или сообщения об ошибках, пожалуйста, создайте issue в репозитории проекта.