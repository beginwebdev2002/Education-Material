# Frontend Pages

## Описание

Папка `pages` содержит компоненты страниц приложения. Каждая страница создана на основе готовых шаблонов из [Flowbite Blocks](https://flowbite.com/blocks/) и адаптирована под signal-based архитектуру проекта.

## Структура

```
pages/
├── home/                 # Главная страница
├── dashboard/            # Панель управления
├── profile/              # Профиль пользователя
├── admin/                # Административная панель
├── doc/                  # Документы
├── auth/                 # Аутентификация
│   ├── login/           # Вход
│   ├── register/        # Регистрация
│   └── forgot-password/ # Восстановление пароля
├── materials/            # Учебные материалы
│   ├── list/            # Список материалов
│   ├── create/          # Создание материала
│   ├── edit/            # Редактирование
│   └── view/            # Просмотр материала
├── students/             # Управление студентами
├── reports/              # Отчеты и аналитика
└── settings/             # Настройки
```

## Компоненты страниц

### HomePage
Главная страница на основе Flowbite Landing Page шаблона:

```typescript
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Flowbite Hero Section -->
    <section class="bg-white dark:bg-gray-900">
      <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            {{ heroTitle() }}
          </h1>
          <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            {{ heroSubtitle() }}
          </p>
          <a routerLink="/dashboard" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
            Начать работу
            <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </a>
          <a routerLink="/about" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            Узнать больше
          </a>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="/assets/hero-image.svg" alt="Education Material">
        </div>
      </div>
    </section>

    <!-- Flowbite Features Section -->
    <section class="bg-gray-50 dark:bg-gray-800">
      <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div class="max-w-screen-md mb-8 lg:mb-16">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Возможности платформы
          </h2>
          <p class="text-gray-500 sm:text-xl dark:text-gray-400">
            Современные инструменты для создания и управления учебными материалами
          </p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div *ngFor="let feature of features()" class="text-center">
            <div class="flex justify-center items-center w-10 h-10 rounded-lg bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900 mb-4">
              <svg class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">{{ feature.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Flowbite Stats Section -->
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Наши достижения
          </h2>
          <p class="mb-6 font-light text-gray-500 lg:mb-8 sm:text-xl dark:text-gray-400">
            Тысячи учителей уже используют нашу платформу
          </p>
        </div>
        <div class="grid grid-cols-2 gap-8 pt-8 text-center md:grid-cols-4">
          <div *ngFor="let stat of statsData()">
            <div class="flex flex-col items-center justify-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</div>
              <div class="text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent {
  heroTitle = signal('Автоматизация учебных материалов');
  heroSubtitle = signal('Создавайте качественные учебные материалы с помощью ИИ');
  
  features = signal([
    {
      title: 'ИИ-генерация',
      description: 'Создавайте материалы с помощью искусственного интеллекта'
    },
    {
      title: 'Совместная работа',
      description: 'Работайте в команде над учебными материалами'
    },
    {
      title: 'Аналитика',
      description: 'Отслеживайте эффективность ваших материалов'
    }
  ]);
  
  statsData = signal([
    { label: 'Пользователей', value: '1000+' },
    { label: 'Материалов', value: '5000+' },
    { label: 'Студентов', value: '10000+' },
    { label: 'Школ', value: '100+' }
  ]);
}
```

### DashboardPage
Панель управления на основе Flowbite Admin Dashboard шаблона:

```typescript
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Flowbite Dashboard Header -->
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mx-auto max-w-screen-xl">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Добро пожаловать, {{ userName() }}!
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {{ welcomeMessage() }}
          </p>
        </div>

        <!-- Flowbite Stats Cards -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div *ngFor="let stat of stats()" class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                      {{ stat.title }}
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ stat.value }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 dark:bg-gray-700">
              <div class="text-sm">
                <span class="font-medium text-green-600 dark:text-green-400">
                  {{ stat.change }}
                </span>
                <span class="text-gray-500 dark:text-gray-400"> с прошлого месяца</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Flowbite Charts Section -->
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Materials Chart -->
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Материалы по месяцам
              </h3>
              <div class="mt-5">
                <div class="h-64">
                  <!-- Chart placeholder - можно интегрировать Chart.js или другую библиотеку -->
                  <div class="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                    График материалов
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Students Chart -->
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Активность студентов
              </h3>
              <div class="mt-5">
                <div class="h-64">
                  <div class="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                    График активности
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Flowbite Recent Activity -->
        <div class="mt-8">
          <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Последняя активность
              </h3>
              <div class="mt-5">
                <div class="flow-root">
                  <ul role="list" class="-mb-8">
                    <li *ngFor="let activity of recentActivities(); let i = index" class="relative pb-8">
                      <div *ngIf="i !== recentActivities().length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                            </svg>
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ activity.description }}
                            </p>
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {{ activity.time }}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardPageComponent {
  userName = signal('Иван Иванов');
  welcomeMessage = signal('Вот что происходит в вашем аккаунте сегодня');
  
  stats = signal([
    {
      title: 'Всего материалов',
      value: '24',
      change: '+12%'
    },
    {
      title: 'Активных студентов',
      value: '156',
      change: '+8%'
    },
    {
      title: 'Завершенных курсов',
      value: '8',
      change: '+2'
    },
    {
      title: 'Средняя оценка',
      value: '4.8',
      change: '+0.2'
    }
  ]);
  
  recentActivities = signal([
    {
      description: 'Создан новый материал "Математика 5 класс - Уравнения"',
      time: '2 часа назад'
    },
    {
      description: 'Анна Петрова присоединилась к курсу',
      time: '4 часа назад'
    },
    {
      description: 'Обновлен материал "Физика 8 класс"',
      time: '1 день назад'
    }
  ]);
}
```

### MaterialsListPage
Страница списка учебных материалов на основе Flowbite Table шаблона:

```typescript
@Component({
  selector: 'app-materials-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mx-auto max-w-screen-xl">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Учебные материалы
              </h1>
              <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Управляйте своими учебными материалами
              </p>
            </div>
            <button 
              routerLink="/materials/create"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Создать материал
            </button>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="mb-6">
          <div class="bg-white shadow rounded-lg dark:bg-gray-800">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Поиск материалов
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      [(ngModel)]="searchQuery"
                      (input)="onSearch($event)"
                      class="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Поиск..."
                    />
                  </div>
                </div>
                
                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Предмет
                  </label>
                  <select
                    [(ngModel)]="selectedSubject"
                    (change)="onFilterChange()"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Все предметы</option>
                    <option value="math">Математика</option>
                    <option value="physics">Физика</option>
                    <option value="chemistry">Химия</option>
                  </select>
                </div>
                
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Статус
                  </label>
                  <select
                    [(ngModel)]="selectedStatus"
                    (change)="onFilterChange()"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Все статусы</option>
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликован</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Materials Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Список материалов
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Всего материалов: {{ totalMaterials() }}
            </p>
          </div>
          
          <div *ngIf="loading()" class="px-4 py-5 sm:px-6">
            <div class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span class="ml-2 text-gray-500 dark:text-gray-400">Загрузка...</span>
            </div>
          </div>

          <div *ngIf="!loading() && materials().length === 0" class="px-4 py-5 sm:px-6">
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет материалов</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Создайте свой первый учебный материал.</p>
              <div class="mt-6">
                <button
                  routerLink="/materials/create"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Создать материал
                </button>
              </div>
            </div>
          </div>

          <ul *ngIf="!loading() && materials().length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li *ngFor="let material of materials()" class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ material.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ material.subject }} • {{ material.grade }} класс
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="getStatusBadgeClass(material.status)">
                    {{ getStatusLabel(material.status) }}
                  </span>
                  <div class="flex space-x-1">
                    <button
                      (click)="editMaterial(material)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Редактировать
                    </button>
                    <button
                      (click)="deleteMaterial(material.id)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading() && materials().length > 0" class="mt-6">
          <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
            <div class="hidden sm:block">
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Показано {{ (currentPage() - 1) * pageSize() + 1 }} - {{ Math.min(currentPage() * pageSize(), totalMaterials()) }} из {{ totalMaterials() }} результатов
              </p>
            </div>
            <div class="flex-1 flex justify-between sm:justify-end">
              <button
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Предыдущая
              </button>
              <button
                (click)="nextPage()"
                [disabled]="currentPage() * pageSize() >= totalMaterials()"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Следующая
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class MaterialsListPageComponent {
  materials = signal<Material[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  pageSize = signal(10);
  totalMaterials = signal(0);
  
  searchQuery = '';
  selectedSubject = '';
  selectedStatus = '';
  
  ngOnInit() {
    this.loadMaterials();
  }
  
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.currentPage.set(1);
    this.loadMaterials();
  }
  
  onFilterChange() {
    this.currentPage.set(1);
    this.loadMaterials();
  }
  
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadMaterials();
    }
  }
  
  nextPage() {
    if (this.currentPage() * this.pageSize() < this.totalMaterials()) {
      this.currentPage.update(page => page + 1);
      this.loadMaterials();
    }
  }
  
  editMaterial(material: Material) {
    this.router.navigate(['/materials/edit', material.id]);
  }
  
  deleteMaterial(id: string) {
    if (confirm('Вы уверены, что хотите удалить этот материал?')) {
      // Логика удаления
    }
  }
  
  getStatusLabel(status: string): string {
    const labels = {
      draft: 'Черновик',
      published: 'Опубликован',
      archived: 'Архив'
    };
    return labels[status] || status;
  }
  
  getStatusBadgeClass(status: string): string {
    const classes = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  private loadMaterials() {
    this.loading.set(true);
    // Логика загрузки материалов
    setTimeout(() => {
      this.materials.set([
        {
          id: '1',
          title: 'Математика 5 класс - Уравнения',
          subject: 'Математика',
          grade: '5',
          status: 'published',
          createdAt: new Date()
        }
      ]);
      this.totalMaterials.set(1);
      this.loading.set(false);
    }, 1000);
  }
}
```

## Использование страниц

### В маршрутах
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'materials', component: MaterialsListPageComponent },
      { path: 'materials/create', component: MaterialsCreatePageComponent },
      { path: 'materials/edit/:id', component: MaterialsEditPageComponent },
      { path: 'profile', component: ProfilePageComponent }
    ]
  }
];
```

### Навигация между страницами
```typescript
@Component({
  template: `
    <button (click)="navigateToMaterials()" class="btn-primary">
      Перейти к материалам
    </button>
  `
})
export class ExampleComponent {
  constructor(private router: Router) {}
  
  navigateToMaterials() {
    this.router.navigate(['/materials']);
  }
}
```

## Создание новой страницы

### 1. Структура папки
```
pages/page-name/
├── page-name.component.ts
├── page-name.component.html
├── page-name.component.scss
├── page-name.types.ts
├── page-name.spec.ts
└── README.md
```

### 2. Шаблон компонента
```typescript
@Component({
  selector: 'app-page-name',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss']
})
export class PageNameComponent {
  // Page state
  loading = signal(false);
  data = signal<any[]>([]);
  
  // Page configuration
  title = signal('Page Title');
  
  ngOnInit() {
    this.loadData();
  }
  
  private loadData() {
    this.loading.set(true);
    // Логика загрузки данных
  }
}
```

## Лучшие практики

1. **Композиция блоков** для создания страниц
2. **Signal-based state** для всех состояний
3. **Loading states** для всех асинхронных операций
4. **Error handling** для обработки ошибок
5. **Empty states** для пустых данных
6. **Responsive design** для всех устройств
7. **SEO optimization** для публичных страниц
8. **Accessibility** поддержка
9. **Тестирование** всех страниц
10. **Документация** для каждой страницы
