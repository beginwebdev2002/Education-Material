# Frontend Shared

## Описание

Папка `shared` содержит переиспользуемые ресурсы, которые могут использоваться в любой части приложения. Это включает в себя типы, интерфейсы, константы, утилиты и другие общие компоненты.

## Структура

```
shared/
├── types/                # TypeScript типы и интерфейсы
│   ├── common.types.ts  # Общие типы
│   ├── api.types.ts     # API типы
│   ├── auth.types.ts    # Типы аутентификации
│   ├── user.types.ts    # Типы пользователей
│   ├── material.types.ts # Типы материалов
│   └── form.types.ts    # Типы форм
├── constants/            # Константы приложения
│   ├── app.constants.ts # Общие константы
│   ├── api.constants.ts # API константы
│   ├── routes.constants.ts # Константы маршрутов
│   └── validation.constants.ts # Константы валидации
├── utils/                # Утилиты и хелперы
│   ├── string.util.ts   # Работа со строками
│   ├── date.util.ts     # Работа с датами
│   ├── validation.util.ts # Валидация
│   ├── file.util.ts     # Работа с файлами
│   └── format.util.ts   # Форматирование
├── enums/                # Перечисления
│   ├── user-role.enum.ts # Роли пользователей
│   ├── material-status.enum.ts # Статусы материалов
│   ├── notification-type.enum.ts # Типы уведомлений
│   └── file-type.enum.ts # Типы файлов
├── validators/            # Кастомные валидаторы
│   ├── password.validator.ts # Валидатор пароля
│   ├── email.validator.ts # Валидатор email
│   └── file.validator.ts # Валидатор файлов
├── pipes/                 # Переиспользуемые пайпы
│   ├── date-format.pipe.ts # Форматирование дат
│   ├── file-size.pipe.ts # Размер файлов
│   └── truncate.pipe.ts # Обрезка текста
└── directives/           # Переиспользуемые директивы
    ├── click-outside.directive.ts # Клик вне элемента
    ├── lazy-load.directive.ts # Ленивая загрузка
    └── tooltip.directive.ts # Подсказки
```

## Типы

### Common Types
Общие типы приложения:

```typescript
// shared/types/common.types.ts

// Базовые типы
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date;
}

// Пагинация
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API ответы
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: Date;
}

// Фильтры
export interface Filter {
  key: string;
  value: any;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
}

export interface SearchParams {
  query?: string;
  filters?: Filter[];
  pagination?: PaginationParams;
}

// Файлы
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

// Формы
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'min' | 'max';
  value?: any;
  message: string;
}

// Уведомления
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
}

// Модальные окна
export interface ModalConfig {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Таблицы
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => string;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  selection?: boolean;
  actions?: TableAction<T>[];
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  action: (row: T) => void;
  condition?: (row: T) => boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### API Types
Типы для API:

```typescript
// shared/types/api.types.ts

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiRequest<T = any> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  body?: T;
  headers?: Record<string, string>;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: Date;
}

// HTTP статусы
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

// Методы HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Заголовки
export interface HttpHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  'Accept'?: string;
  [key: string]: string | undefined;
}
```

### User Types
Типы пользователей:

```typescript
// shared/types/user.types.ts

export interface User extends BaseEntity {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  bio?: string;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
}

export interface UserProfile extends User {
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface UserStatistics {
  materialsCount: number;
  studentsCount: number;
  coursesCount: number;
  totalViews: number;
  averageRating: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Константы

### App Constants
Общие константы приложения:

```typescript
// shared/constants/app.constants.ts

export const APP_CONFIG = {
  NAME: 'Education Material',
  VERSION: '1.0.0',
  DESCRIPTION: 'Платформа для автоматизации создания учебных материалов',
  AUTHOR: 'Education Material Team',
  SUPPORT_EMAIL: 'support@education-material.com',
  WEBSITE: 'https://education-material.com'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'user_preferences'
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  BIO_MAX_LENGTH: 500,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

export const NOTIFICATION_DEFAULTS = {
  SUCCESS_DURATION: 5000,
  ERROR_DURATION: 0, // Не исчезает автоматически
  WARNING_DURATION: 7000,
  INFO_DURATION: 5000,
  MAX_NOTIFICATIONS: 5
} as const;
```

### API Constants
Константы для API:

```typescript
// shared/constants/api.constants.ts

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    PASSWORD: '/users/password'
  },
  MATERIALS: {
    BASE: '/materials',
    TEMPLATES: '/materials/templates',
    CATEGORIES: '/materials/categories',
    TAGS: '/materials/tags'
  },
  STUDENTS: {
    BASE: '/students',
    INVITE: '/students/invite',
    ENROLL: '/students/enroll'
  },
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: '/files/download',
    DELETE: '/files/delete'
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    STATS: '/analytics/stats'
  }
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 секунд
  UPLOAD: 300000, // 5 минут
  DOWNLOAD: 60000 // 1 минута
} as const;

export const HTTP_STATUS_MESSAGES = {
  400: 'Неверный запрос',
  401: 'Не авторизован',
  403: 'Доступ запрещен',
  404: 'Ресурс не найден',
  409: 'Конфликт данных',
  422: 'Ошибка валидации',
  500: 'Внутренняя ошибка сервера',
  502: 'Ошибка шлюза',
  503: 'Сервис недоступен'
} as const;
```

## Утилиты

### String Utils
Утилиты для работы со строками:

```typescript
// shared/utils/string.util.ts

export class StringUtil {
  /**
   * Генерация случайной строки
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Создание slug из строки
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  /**
   * Обрезка текста с многоточием
   */
  static truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
  
  /**
   * Первая буква заглавная
   */
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  
  /**
   * Каждое слово с заглавной буквы
   */
  static titleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  
  /**
   * Удаление HTML тегов
   */
  static stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  
  /**
   * Подсчет слов
   */
  static wordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }
  
  /**
   * Подсчет символов
   */
  static charCount(text: string): number {
    return text.length;
  }
  
  /**
   * Проверка на пустую строку
   */
  static isEmpty(text: string): boolean {
    return !text || text.trim().length === 0;
  }
  
  /**
   * Проверка на валидный email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Маскирование email
   */
  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.substring(0, 2) + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  }
}
```

### Validation Utils
Утилиты для валидации:

```typescript
// shared/utils/validation.util.ts

export class ValidationUtil {
  /**
   * Валидация пароля
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавную букву');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать строчную букву');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Пароль должен содержать цифру');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Пароль должен содержать специальный символ');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Валидация файла
   */
  static validateFile(file: File, options: FileValidationOptions): ValidationResult {
    const errors: string[] = [];
    
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`Размер файла не должен превышать ${this.formatFileSize(options.maxSize)}`);
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`Тип файла должен быть одним из: ${options.allowedTypes.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Форматирование размера файла
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Валидация URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Валидация телефона
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}
```

## Перечисления

### User Role Enum
Роли пользователей:

```typescript
// shared/enums/user-role.enum.ts

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export const USER_ROLE_LABELS = {
  [UserRole.ADMIN]: 'Администратор',
  [UserRole.TEACHER]: 'Учитель',
  [UserRole.STUDENT]: 'Студент'
} as const;

export const USER_ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'users:read',
    'users:write',
    'users:delete',
    'materials:read',
    'materials:write',
    'materials:delete',
    'analytics:read',
    'settings:write'
  ],
  [UserRole.TEACHER]: [
    'materials:read',
    'materials:write',
    'students:read',
    'students:write',
    'analytics:read'
  ],
  [UserRole.STUDENT]: [
    'materials:read',
    'profile:read',
    'profile:write'
  ]
} as const;
```

### Material Status Enum
Статусы материалов:

```typescript
// shared/enums/material-status.enum.ts

export enum MaterialStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REVIEW = 'review'
}

export const MATERIAL_STATUS_LABELS = {
  [MaterialStatus.DRAFT]: 'Черновик',
  [MaterialStatus.PUBLISHED]: 'Опубликован',
  [MaterialStatus.ARCHIVED]: 'Архив',
  [MaterialStatus.REVIEW]: 'На проверке'
} as const;

export const MATERIAL_STATUS_COLORS = {
  [MaterialStatus.DRAFT]: 'gray',
  [MaterialStatus.PUBLISHED]: 'green',
  [MaterialStatus.ARCHIVED]: 'red',
  [MaterialStatus.REVIEW]: 'yellow'
} as const;
```

## Использование

### Импорт типов
```typescript
import { User, UserRole, ApiResponse } from '@frontend/shared/types';
import { APP_CONFIG, STORAGE_KEYS } from '@frontend/shared/constants';
import { StringUtil, ValidationUtil } from '@frontend/shared/utils';
```

### Использование в компонентах
```typescript
@Component({
  template: `
    <div>
      <h1>{{ APP_CONFIG.NAME }}</h1>
      <p>Пользователь: {{ user.name }}</p>
    </div>
  `
})
export class ExampleComponent {
  APP_CONFIG = APP_CONFIG;
  user: User = {
    id: '1',
    email: 'user@example.com',
    name: 'Иван Иванов',
    role: UserRole.TEACHER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  validateEmail(email: string): boolean {
    return StringUtil.isValidEmail(email);
  }
}
```

## Лучшие практики

1. **Типизация** - все данные должны быть типизированы
2. **Константы** - используйте константы вместо магических чисел
3. **Переиспользование** - создавайте переиспользуемые утилиты
4. **Документация** - документируйте все функции и типы
5. **Тестирование** - тестируйте утилиты и валидаторы
6. **Производительность** - оптимизируйте часто используемые функции
7. **Безопасность** - валидируйте все входные данные
8. **Консистентность** - следуйте единому стилю кода
9. **Версионирование** - версионируйте изменения в типах
10. **Импорты** - используйте алиасы для импортов