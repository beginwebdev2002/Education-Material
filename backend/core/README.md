# Backend Core Module

## Описание

Модуль `core` содержит ядро приложения - общие компоненты, которые используются во всем приложении. Это включает в себя гварды, интерцепторы, декораторы, фильтры и другие инфраструктурные компоненты.

## Структура

```
core/
├── guards/           # Гварды для аутентификации и авторизации
├── interceptors/     # Интерцепторы для обработки запросов/ответов
├── decorators/       # Кастомные декораторы
├── filters/          # Фильтры для обработки исключений
├── pipes/            # Кастомные пайпы для валидации
├── middleware/       # Middleware для обработки запросов
└── constants/        # Константы приложения
```

## Компоненты

### Guards
- **AuthGuard** - проверка аутентификации пользователя
- **RolesGuard** - проверка ролей пользователя
- **JwtAuthGuard** - JWT токен валидация

### Interceptors
- **LoggingInterceptor** - логирование запросов
- **TransformInterceptor** - трансформация ответов
- **CacheInterceptor** - кэширование запросов
- **TimeoutInterceptor** - таймауты запросов

### Decorators
- **Roles** - декоратор для указания требуемых ролей
- **Public** - декоратор для публичных эндпоинтов
- **CurrentUser** - декоратор для получения текущего пользователя

### Filters
- **HttpExceptionFilter** - обработка HTTP исключений
- **ValidationExceptionFilter** - обработка ошибок валидации
- **AllExceptionsFilter** - глобальная обработка исключений

### Pipes
- **ValidationPipe** - валидация входных данных
- **ParseIntPipe** - парсинг целых чисел
- **ParseUUIDPipe** - парсинг UUID

## Использование

### Импорт в модуле
```typescript
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
```

### Использование гвардов
```typescript
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  // Контроллер защищен гвардами
}
```

### Использование декораторов
```typescript
@Get('profile')
@UseGuards(AuthGuard)
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## Конфигурация

Все компоненты core модуля настраиваются через конфигурационные файлы и переменные окружения.

## Расширение

При добавлении новых общих компонентов, следуйте принципам:
1. Компонент должен быть переиспользуемым
2. Не должен содержать бизнес-логику
3. Должен быть хорошо документирован
4. Должен иметь тесты
