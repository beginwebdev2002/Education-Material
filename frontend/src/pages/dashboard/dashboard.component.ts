import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Панель управления
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Рабочие программы</h3>
          <p class="text-gray-600 dark:text-gray-300">Создайте рабочую программу</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Лекции</h3>
          <p class="text-gray-600 dark:text-gray-300">Создайте лекцию</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Тесты</h3>
          <p class="text-gray-600 dark:text-gray-300">Создайте тест</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent { }