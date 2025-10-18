import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '@core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Управление пользователями
        </h1>
        <button 
          (click)="showCreateForm.set(true)"
          class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          [disabled]="!canManageUsers()"
        >
          Добавить пользователя
        </button>
      </div>

      <!-- Error message -->
      @if (error()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error() }}
          <button (click)="clearError()" class="float-right font-bold">×</button>
        </div>
      }

      <!-- Loading indicator -->
      @if (loading()) {
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="ml-2">Загрузка...</span>
        </div>
      }

      <!-- User statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Всего пользователей</h3>
          <p class="text-2xl font-bold text-primary-600">{{ users().length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Активные</h3>
          <p class="text-2xl font-bold text-green-600">{{ activeUsers().length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Учителя</h3>
          <p class="text-2xl font-bold text-blue-600">{{ teachers().length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Студенты</h3>
          <p class="text-2xl font-bold text-purple-600">{{ students().length }}</p>
        </div>
      </div>

      <!-- Search and filters -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Поиск пользователей..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
          <select
            [(ngModel)]="roleFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Все роли</option>
            <option value="teacher">Учителя</option>
            <option value="student">Студенты</option>
            <option value="admin">Администраторы</option>
          </select>
        </div>
      </div>

      <!-- Users table -->
      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          @for (user of filteredUsers(); track user.id) {
            <li class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="getRoleBadgeClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.isActive ? 'Активен' : 'Неактивен' }}
                  </span>
                  @if (canManageUsers()) {
                    <button
                      (click)="editUser(user)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Редактировать
                    </button>
                    <button
                      (click)="deleteUser(user.id)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Удалить
                    </button>
                  }
                </div>
              </div>
            </li>
          }
        </ul>
      </div>

      <!-- Create/Edit User Modal -->
      @if (showCreateForm() || editingUser()) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {{ editingUser() ? 'Редактировать пользователя' : 'Добавить пользователя' }}
              </h3>
              
              <form (ngSubmit)="saveUser()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="userForm.name"
                    name="name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="userForm.email"
                    name="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Роль
                  </label>
                  <select
                    [(ngModel)]="userForm.role"
                    name="role"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="student">Студент</option>
                    <option value="teacher">Учитель</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="userForm.isActive"
                    name="isActive"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  >
                  <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Активен
                  </label>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    (click)="cancelEdit()"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    [disabled]="loading()"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
                  >
                    {{ loading() ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);

  // Local state signals
  showCreateForm = signal(false);
  editingUser = signal<User | null>(null);
  searchTerm = '';
  roleFilter = '';

  // Form data
  userForm = {
    name: '',
    email: '',
    role: 'student' as User['role'],
    isActive: true
  };

  // Service signals (readonly)
  users = this.userService.users;
  loading = this.userService.loading;
  error = this.userService.error;
  activeUsers = this.userService.activeUsers;
  teachers = this.userService.teachers;
  students = this.userService.students;
  canManageUsers = this.userService.canManageUsers;

  // Computed signals for filtering
  filteredUsers = computed(() => {
    let filtered = this.users();

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Filter by role
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    return filtered;
  });

  ngOnInit() {
    this.userService.loadUsers();
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.userForm = {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  async saveUser() {
    if (this.editingUser()) {
      // Update existing user
      const result = await this.userService.updateUser(this.editingUser()!.id, this.userForm);
      if (result) {
        this.cancelEdit();
      }
    } else {
      // Create new user
      const result = await this.userService.createUser(this.userForm);
      if (result) {
        this.cancelEdit();
      }
    }
  }

  async deleteUser(id: string) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      await this.userService.deleteUser(id);
    }
  }

  cancelEdit() {
    this.showCreateForm.set(false);
    this.editingUser.set(null);
    this.userForm = {
      name: '',
      email: '',
      role: 'student',
      isActive: true
    };
  }

  clearError() {
    this.userService.clearError();
  }

  getRoleLabel(role: User['role']): string {
    const labels = {
      teacher: 'Учитель',
      student: 'Студент',
      admin: 'Администратор'
    };
    return labels[role];
  }

  getRoleBadgeClass(role: User['role']): string {
    const classes = {
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return classes[role];
  }
}
