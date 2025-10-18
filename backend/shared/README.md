# Backend Shared Module

## Описание

Модуль `shared` содержит переиспользуемые ресурсы, которые могут использоваться в любой части приложения. Это включает в себя DTO, утилиты, константы, типы и другие общие компоненты.

## Структура

```
shared/
├── dto/              # Общие Data Transfer Objects
├── interfaces/       # Общие интерфейсы и типы
├── utils/            # Утилиты и хелперы
├── constants/        # Константы приложения
├── enums/            # Перечисления
├── decorators/       # Общие декораторы
├── pipes/            # Общие пайпы
├── validators/       # Кастомные валидаторы
└── types/            # TypeScript типы
```

## Компоненты

### DTO (Data Transfer Objects)
Общие структуры данных для API:

```typescript
// dto/api-response.dto.ts
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;
}

// dto/pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

### Interfaces
Общие интерфейсы:

```typescript
// interfaces/user.interface.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// interfaces/pagination.interface.ts
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Utils
Утилиты и хелперы:

```typescript
// utils/string.util.ts
export class StringUtil {
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// utils/date.util.ts
export class DateUtil {
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    // Реализация форматирования даты
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
```

### Constants
Константы приложения:

```typescript
// constants/app.constants.ts
export const APP_CONSTANTS = {
  JWT_EXPIRES_IN: '24h',
  PASSWORD_MIN_LENGTH: 8,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

// constants/error-codes.constants.ts
export const ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const;
```

### Enums
Перечисления:

```typescript
// enums/user-role.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

// enums/material-status.enum.ts
export enum MaterialStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
```

### Validators
Кастомные валидаторы:

```typescript
// validators/password.validator.ts
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return typeof value === 'string' && strongPasswordRegex.test(value);
        },
        defaultMessage() {
          return 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character';
        },
      },
    });
  };
}
```

### Types
TypeScript типы:

```typescript
// types/common.types.ts
export type ID = string | number;

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type SoftDelete = {
  deletedAt?: Date;
};

export type BaseEntity = Timestamps & SoftDelete & {
  id: ID;
};
```

## Использование

### Импорт в модуле
```typescript
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule],
})
export class FeatureModule {}
```

### Использование DTO
```typescript
import { ApiResponseDto, PaginationDto } from '@shared/dto';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<ApiResponseDto<User[]>> {
    // Реализация
  }
}
```

### Использование утилит
```typescript
import { StringUtil, DateUtil } from '@shared/utils';

export class UserService {
  generateUsername(email: string): string {
    const base = email.split('@')[0];
    return StringUtil.slugify(base);
  }
}
```

## Правила разработки

### 1. Переиспользуемость
- Компоненты должны быть универсальными
- Не должны содержать бизнес-логику
- Должны быть хорошо документированы

### 2. Типизация
- Все компоненты должны быть типизированы
- Использовать строгие типы TypeScript
- Избегать `any` типа

### 3. Тестирование
- Все утилиты должны иметь тесты
- Покрытие тестами должно быть высоким
- Тесты должны быть быстрыми и изолированными

### 4. Производительность
- Утилиты должны быть оптимизированы
- Избегать тяжелых вычислений
- Использовать кэширование где необходимо

## Расширение

При добавлении новых компонентов в shared:
1. Определите, действительно ли компонент переиспользуемый
2. Следуйте существующим паттернам
3. Добавьте тесты
4. Обновите документацию
5. Рассмотрите возможность вынесения в отдельный пакет
