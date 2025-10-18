import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Профиль
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Здесь будет информация о пользователе и история материалов
      </p>
    </div>
  `
})
export class ProfileComponent { }