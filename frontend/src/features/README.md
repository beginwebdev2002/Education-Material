# Frontend Features

## Описание

Папка `features` содержит бизнес-функции приложения, организованные по принципам Feature Sliced Design. Каждая фича представляет собой изолированную функциональность с собственной логикой, компонентами и сервисами.

## Структура

```
features/
├── auth/                 # Аутентификация и авторизация
│   ├── components/       # Компоненты фичи
│   ├── services/         # Сервисы фичи
│   ├── types/            # Типы фичи
│   ├── utils/            # Утилиты фичи
│   └── auth.feature.ts   # Главный файл фичи
├── materials/            # Управление учебными материалами
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── materials.feature.ts
├── students/             # Управление студентами
├── ai-generation/        # ИИ-генерация материалов
├── analytics/            # Аналитика и отчеты
├── notifications/        # Уведомления
├── file-management/      # Управление файлами
└── user-management/     # Управление пользователями
```

## Архитектура фичи

Каждая фича следует единой структуре:

```
feature-name/
├── components/           # UI компоненты фичи
│   ├── feature-list/
│   ├── feature-form/
│   ├── feature-card/
│   └── feature-detail/
├── services/             # Бизнес-логика фичи
│   ├── feature.service.ts
│   ├── feature-api.service.ts
│   └── feature-state.service.ts
├── types/                # TypeScript типы
│   ├── feature.types.ts
│   ├── feature-api.types.ts
│   └── feature-state.types.ts
├── utils/                # Утилиты фичи
│   ├── feature.helpers.ts
│   └── feature.validators.ts
├── constants/             # Константы фичи
│   └── feature.constants.ts
└── feature-name.feature.ts # Главный файл фичи
```

## Примеры фич

### AuthFeature
Фича аутентификации и авторизации:

```typescript
// features/auth/auth.feature.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './types/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthFeature {
  // Private state
  private _user = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly state
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed state
  readonly userRole = computed(() => this._user()?.role || null);
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  readonly isTeacher = computed(() => this.userRole() === 'teacher');
  readonly isStudent = computed(() => this.userRole() === 'student');
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeAuth();
  }
  
  // Actions
  async login(credentials: LoginCredentials): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const user = await this.authService.login(credentials);
      this._user.set(user);
      this._isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this._error.set(error.message);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async register(userData: RegisterData): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const user = await this.authService.register(userData);
      this._user.set(user);
      this._isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this._error.set(error.message);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async logout(): Promise<void> {
    this._isLoading.set(true);
    
    try {
      await this.authService.logout();
      this._user.set(null);
      this._isAuthenticated.set(false);
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async refreshToken(): Promise<boolean> {
    try {
      const user = await this.authService.refreshToken();
      this._user.set(user);
      this._isAuthenticated.set(true);
      return true;
    } catch (error: any) {
      this.logout();
      return false;
    }
  }
  
  clearError(): void {
    this._error.set(null);
  }
  
  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authService.validateToken(token).then(user => {
        this._user.set(user);
        this._isAuthenticated.set(true);
      }).catch(() => {
        this.logout();
      });
    }
  }
}
```

### MaterialsFeature
Фича управления учебными материалами:

```typescript
// features/materials/materials.feature.ts
import { Injectable, signal, computed } from '@angular/core';
import { MaterialsService } from './services/materials.service';
import { Material, CreateMaterialData, UpdateMaterialData } from './types/materials.types';

@Injectable({
  providedIn: 'root'
})
export class MaterialsFeature {
  // Private state
  private _materials = signal<Material[]>([]);
  private _currentMaterial = signal<Material | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _totalCount = signal(0);
  private _currentPage = signal(1);
  private _searchQuery = signal('');
  private _filters = signal<Record<string, any>>({});
  
  // Public readonly state
  readonly materials = this._materials.asReadonly();
  readonly currentMaterial = this._currentMaterial.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filters = this._filters.asReadonly();
  
  // Computed state
  readonly hasMaterials = computed(() => this._materials().length > 0);
  readonly publishedMaterials = computed(() => 
    this._materials().filter(m => m.status === 'published')
  );
  readonly draftMaterials = computed(() => 
    this._materials().filter(m => m.status === 'draft')
  );
  readonly materialsBySubject = computed(() => {
    const materials = this._materials();
    return materials.reduce((acc, material) => {
      const subject = material.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(material);
      return acc;
    }, {} as Record<string, Material[]>);
  });
  
  constructor(private materialsService: MaterialsService) {}
  
  // Actions
  async loadMaterials(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const response = await this.materialsService.getMaterials({
        page: this._currentPage(),
        search: this._searchQuery(),
        filters: this._filters()
      });
      
      this._materials.set(response.data);
      this._totalCount.set(response.totalCount);
    } catch (error: any) {
      this._error.set(error.message);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async loadMaterial(id: string): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const material = await this.materialsService.getMaterial(id);
      this._currentMaterial.set(material);
    } catch (error: any) {
      this._error.set(error.message);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async createMaterial(data: CreateMaterialData): Promise<Material | null> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const material = await this.materialsService.createMaterial(data);
      this._materials.update(materials => [material, ...materials]);
      this._totalCount.update(count => count + 1);
      return material;
    } catch (error: any) {
      this._error.set(error.message);
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async updateMaterial(id: string, data: UpdateMaterialData): Promise<Material | null> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const material = await this.materialsService.updateMaterial(id, data);
      this._materials.update(materials => 
        materials.map(m => m.id === id ? material : m)
      );
      
      if (this._currentMaterial()?.id === id) {
        this._currentMaterial.set(material);
      }
      
      return material;
    } catch (error: any) {
      this._error.set(error.message);
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async deleteMaterial(id: string): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      await this.materialsService.deleteMaterial(id);
      this._materials.update(materials => 
        materials.filter(m => m.id !== id)
      );
      this._totalCount.update(count => count - 1);
      
      if (this._currentMaterial()?.id === id) {
        this._currentMaterial.set(null);
      }
      
      return true;
    } catch (error: any) {
      this._error.set(error.message);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async duplicateMaterial(id: string): Promise<Material | null> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const material = await this.materialsService.duplicateMaterial(id);
      this._materials.update(materials => [material, ...materials]);
      this._totalCount.update(count => count + 1);
      return material;
    } catch (error: any) {
      this._error.set(error.message);
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }
  
  // Search and filters
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
    this._currentPage.set(1);
    this.loadMaterials();
  }
  
  setFilters(filters: Record<string, any>): void {
    this._filters.set(filters);
    this._currentPage.set(1);
    this.loadMaterials();
  }
  
  setPage(page: number): void {
    this._currentPage.set(page);
    this.loadMaterials();
  }
  
  clearFilters(): void {
    this._filters.set({});
    this._searchQuery.set('');
    this._currentPage.set(1);
    this.loadMaterials();
  }
  
  clearError(): void {
    this._error.set(null);
  }
}
```

### AIGenerationFeature
Фича ИИ-генерации материалов:

```typescript
// features/ai-generation/ai-generation.feature.ts
import { Injectable, signal, computed } from '@angular/core';
import { AIGenerationService } from './services/ai-generation.service';
import { GenerationRequest, GenerationResult, GenerationTemplate } from './types/ai-generation.types';

@Injectable({
  providedIn: 'root'
})
export class AIGenerationFeature {
  // Private state
  private _isGenerating = signal(false);
  private _generationProgress = signal(0);
  private _currentGeneration = signal<GenerationResult | null>(null);
  private _generationHistory = signal<GenerationResult[]>([]);
  private _templates = signal<GenerationTemplate[]>([]);
  private _error = signal<string | null>(null);
  
  // Public readonly state
  readonly isGenerating = this._isGenerating.asReadonly();
  readonly generationProgress = this._generationProgress.asReadonly();
  readonly currentGeneration = this._currentGeneration.asReadonly();
  readonly generationHistory = this._generationHistory.asReadonly();
  readonly templates = this._templates.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed state
  readonly hasGenerationHistory = computed(() => this._generationHistory().length > 0);
  readonly recentGenerations = computed(() => 
    this._generationHistory().slice(0, 5)
  );
  readonly availableTemplates = computed(() => 
    this._templates().filter(t => t.isActive)
  );
  
  constructor(private aiGenerationService: AIGenerationService) {
    this.loadTemplates();
  }
  
  // Actions
  async generateMaterial(request: GenerationRequest): Promise<GenerationResult | null> {
    this._isGenerating.set(true);
    this._generationProgress.set(0);
    this._error.set(null);
    
    try {
      const result = await this.aiGenerationService.generateMaterial(request, (progress) => {
        this._generationProgress.set(progress);
      });
      
      this._currentGeneration.set(result);
      this._generationHistory.update(history => [result, ...history]);
      
      return result;
    } catch (error: any) {
      this._error.set(error.message);
      return null;
    } finally {
      this._isGenerating.set(false);
      this._generationProgress.set(0);
    }
  }
  
  async generateWithTemplate(templateId: string, parameters: Record<string, any>): Promise<GenerationResult | null> {
    const template = this._templates().find(t => t.id === templateId);
    if (!template) {
      this._error.set('Template not found');
      return null;
    }
    
    const request: GenerationRequest = {
      template: template,
      parameters: parameters,
      type: 'template'
    };
    
    return this.generateMaterial(request);
  }
  
  async generateCustom(prompt: string, options: Partial<GenerationRequest>): Promise<GenerationResult | null> {
    const request: GenerationRequest = {
      prompt: prompt,
      type: 'custom',
      ...options
    };
    
    return this.generateMaterial(request);
  }
  
  async saveGenerationAsMaterial(generationId: string, materialData: any): Promise<boolean> {
    this._isGenerating.set(true);
    this._error.set(null);
    
    try {
      const success = await this.aiGenerationService.saveAsMaterial(generationId, materialData);
      if (success) {
        this._currentGeneration.update(gen => 
          gen ? { ...gen, saved: true } : null
        );
      }
      return success;
    } catch (error: any) {
      this._error.set(error.message);
      return false;
    } finally {
      this._isGenerating.set(false);
    }
  }
  
  async loadTemplates(): Promise<void> {
    try {
      const templates = await this.aiGenerationService.getTemplates();
      this._templates.set(templates);
    } catch (error: any) {
      this._error.set(error.message);
    }
  }
  
  async loadGenerationHistory(): Promise<void> {
    try {
      const history = await this.aiGenerationService.getGenerationHistory();
      this._generationHistory.set(history);
    } catch (error: any) {
      this._error.set(error.message);
    }
  }
  
  clearCurrentGeneration(): void {
    this._currentGeneration.set(null);
  }
  
  clearError(): void {
    this._error.set(null);
  }
}
```

## Использование фич

### В компонентах
```typescript
@Component({
  selector: 'app-materials-page',
  template: `
    <div>
      <h1>Материалы</h1>
      <app-loading *ngIf="materialsFeature.isLoading()" />
      
      <div *ngIf="materialsFeature.hasMaterials()">
        <div *ngFor="let material of materialsFeature.materials()">
          {{ material.title }}
        </div>
      </div>
      
      <app-empty-state 
        *ngIf="!materialsFeature.hasMaterials() && !materialsFeature.isLoading()"
        title="Нет материалов"
        description="Создайте свой первый материал"
      />
    </div>
  `
})
export class MaterialsPageComponent {
  constructor(public materialsFeature: MaterialsFeature) {
    this.materialsFeature.loadMaterials();
  }
}
```

### В сервисах
```typescript
@Injectable()
export class MaterialsPageService {
  constructor(
    private materialsFeature: MaterialsFeature,
    private authFeature: AuthFeature
  ) {}
  
  canCreateMaterial(): boolean {
    return this.authFeature.isTeacher() || this.authFeature.isAdmin();
  }
  
  async createMaterial(data: CreateMaterialData): Promise<void> {
    if (!this.canCreateMaterial()) {
      throw new Error('Unauthorized');
    }
    
    await this.materialsFeature.createMaterial(data);
  }
}
```

## Создание новой фичи

### 1. Структура папки
```
features/new-feature/
├── components/
├── services/
├── types/
├── utils/
├── constants/
└── new-feature.feature.ts
```

### 2. Шаблон фичи
```typescript
// features/new-feature/new-feature.feature.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewFeature {
  // Private state
  private _data = signal<any[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly state
  readonly data = this._data.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed state
  readonly hasData = computed(() => this._data().length > 0);
  
  // Actions
  async loadData(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      // Логика загрузки данных
    } catch (error: any) {
      this._error.set(error.message);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  clearError(): void {
    this._error.set(null);
  }
}
```

## Лучшие практики

1. **Изоляция логики** - каждая фича независима
2. **Signal-based state** - использование signals для состояния
3. **Единая структура** - все фичи следуют одной структуре
4. **Типизация** - строгая типизация всех данных
5. **Обработка ошибок** - правильная обработка ошибок
6. **Тестирование** - тесты для всех фич
7. **Документация** - документация для каждой фичи
8. **Переиспользование** - фичи могут использовать друг друга
9. **Производительность** - оптимизация загрузки данных
10. **Масштабируемость** - возможность легкого расширения