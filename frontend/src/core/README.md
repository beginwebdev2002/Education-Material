# Frontend Core

## Описание

Папка `core` содержит ядро приложения - сервисы, интерцепторы, гварды и другие инфраструктурные компоненты, которые используются во всем приложении.

## Структура

```
core/
├── services/             # Основные сервисы
│   ├── api.service.ts   # HTTP клиент
│   ├── auth.service.ts  # Аутентификация
│   ├── storage.service.ts # Локальное хранилище
│   ├── notification.service.ts # Уведомления
│   └── user.service.ts  # Управление пользователями
├── interceptors/         # HTTP интерцепторы
│   ├── auth.interceptor.ts # Аутентификация
│   ├── error.interceptor.ts # Обработка ошибок
│   └── loading.interceptor.ts # Индикаторы загрузки
├── guards/               # Гварды маршрутов
│   ├── auth.guard.ts    # Проверка аутентификации
│   ├── role.guard.ts     # Проверка ролей
│   └── guest.guard.ts    # Только для гостей
├── pipes/                # Кастомные пайпы
│   ├── date-format.pipe.ts
│   ├── file-size.pipe.ts
│   └── truncate.pipe.ts
├── directives/           # Кастомные директивы
│   ├── click-outside.directive.ts
│   ├── lazy-load.directive.ts
│   └── tooltip.directive.ts
├── utils/                # Утилиты
│   ├── date.util.ts
│   ├── string.util.ts
│   ├── validation.util.ts
│   └── file.util.ts
├── constants/            # Константы
│   ├── app.constants.ts
│   ├── api.constants.ts
│   └── storage.constants.ts
└── types/                # Общие типы
    ├── api.types.ts
    ├── auth.types.ts
    └── common.types.ts
```

## Сервисы

### ApiService
Основной HTTP клиент для работы с API:

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = signal('http://localhost:3000/api');
  private loading = signal(false);
  
  constructor(private http: HttpClient) {}
  
  // GET запрос
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    this.setLoading(true);
    
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    
    return this.http.get<T>(`${this.baseUrl()}/${endpoint}`, { params: httpParams })
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // POST запрос
  post<T>(endpoint: string, data: any): Observable<T> {
    this.setLoading(true);
    
    return this.http.post<T>(`${this.baseUrl()}/${endpoint}`, data)
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // PUT запрос
  put<T>(endpoint: string, data: any): Observable<T> {
    this.setLoading(true);
    
    return this.http.put<T>(`${this.baseUrl()}/${endpoint}`, data)
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // DELETE запрос
  delete<T>(endpoint: string): Observable<T> {
    this.setLoading(true);
    
    return this.http.delete<T>(`${this.baseUrl()}/${endpoint}`)
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // Загрузка файла
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    this.setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    return this.http.post<T>(`${this.baseUrl()}/${endpoint}`, formData)
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // Скачивание файла
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    this.setLoading(true);
    
    return this.http.get(`${this.baseUrl()}/${endpoint}`, { responseType: 'blob' })
      .pipe(
        map(response => {
          this.setLoading(false);
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }
  
  // Геттеры
  get isLoading() {
    return this.loading.asReadonly();
  }
  
  // Приватные методы
  private setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
  
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    let errorMessage = 'Произошла ошибка';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### StorageService
Сервис для работы с локальным хранилищем:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = signal<Storage>(localStorage);
  
  constructor() {}
  
  // Установить хранилище
  setStorage(storage: Storage): void {
    this.storage.set(storage);
  }
  
  // Получить значение
  get<T>(key: string): T | null {
    try {
      const item = this.storage().getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }
  
  // Установить значение
  set<T>(key: string, value: T): void {
    try {
      this.storage().setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item to storage:', error);
    }
  }
  
  // Удалить значение
  remove(key: string): void {
    try {
      this.storage().removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
  
  // Очистить хранилище
  clear(): void {
    try {
      this.storage().clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
  
  // Проверить существование ключа
  has(key: string): boolean {
    return this.storage().getItem(key) !== null;
  }
  
  // Получить все ключи
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage().length; i++) {
      const key = this.storage().key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }
  
  // Получить размер хранилища
  size(): number {
    return this.storage().length;
  }
}
```

### NotificationService
Сервис для показа уведомлений:

```typescript
import { Injectable, signal } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  
  readonly notifications$ = this.notifications.asReadonly();
  
  constructor() {}
  
  // Показать уведомление
  show(notification: Omit<Notification, 'id'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    };
    
    this.notifications.update(notifications => [...notifications, newNotification]);
    
    // Автоматическое удаление
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }
    
    return id;
  }
  
  // Успешное уведомление
  success(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }
  
  // Ошибка
  error(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: duration || 0 // Ошибки не исчезают автоматически
    });
  }
  
  // Предупреждение
  warning(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }
  
  // Информация
  info(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }
  
  // Удалить уведомление
  remove(id: string): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }
  
  // Очистить все уведомления
  clear(): void {
    this.notifications.set([]);
  }
  
  // Очистить по типу
  clearByType(type: Notification['type']): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.type !== type)
    );
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
```

## Интерцепторы

### AuthInterceptor
Интерцептор для добавления токена аутентификации:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

### ErrorInterceptor
Интерцептор для обработки ошибок:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Произошла ошибка';
        
        if (error.error instanceof ErrorEvent) {
          // Клиентская ошибка
          errorMessage = error.error.message;
        } else {
          // Серверная ошибка
          switch (error.status) {
            case 401:
              errorMessage = 'Не авторизован';
              this.authService.logout();
              break;
            case 403:
              errorMessage = 'Доступ запрещен';
              break;
            case 404:
              errorMessage = 'Ресурс не найден';
              break;
            case 500:
              errorMessage = 'Внутренняя ошибка сервера';
              break;
            default:
              errorMessage = error.error?.message || error.message;
          }
        }
        
        this.notificationService.error('Ошибка', errorMessage);
        return throwError(() => error);
      })
    );
  }
}
```

## Гварды

### AuthGuard
Гвард для проверки аутентификации:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}
```

### RoleGuard
Гвард для проверки ролей:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (!userRole || !requiredRoles.includes(userRole)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }
    
    return true;
  }
}
```

## Утилиты

### DateUtil
Утилиты для работы с датами:

```typescript
export class DateUtil {
  static formatDate(date: Date, format: string = 'dd.MM.yyyy'): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year.toString());
  }
  
  static formatDateTime(date: Date): string {
    return this.formatDate(date, 'dd.MM.yyyy HH:mm');
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  static isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }
  
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'только что';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин. назад`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ч. назад`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} дн. назад`;
    }
    
    return this.formatDate(date);
  }
}
```

## Использование

### В компонентах
```typescript
@Component({
  selector: 'app-example',
  template: `
    <div>
      <button (click)="loadData()">Загрузить данные</button>
      <app-loading *ngIf="apiService.isLoading()" />
    </div>
  `
})
export class ExampleComponent {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}
  
  loadData() {
    this.apiService.get<any>('data').subscribe({
      next: (data) => {
        this.notificationService.success('Успех', 'Данные загружены');
      },
      error: (error) => {
        this.notificationService.error('Ошибка', error.message);
      }
    });
  }
}
```

## Лучшие практики

1. **Signal-based state** для всех сервисов
2. **Обработка ошибок** во всех методах
3. **Типизация** всех данных
4. **Логирование** важных операций
5. **Кэширование** где необходимо
6. **Тестирование** всех сервисов
7. **Документация** для каждого сервиса
8. **Производительность** оптимизация
9. **Безопасность** проверки
10. **Переиспользование** кода