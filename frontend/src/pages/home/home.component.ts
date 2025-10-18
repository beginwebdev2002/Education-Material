import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Добро пожаловать в Учительскую автоматизацию
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Автоматизируйте создание учебных материалов с помощью ИИ
        </p>
        <div class="flex justify-center space-x-4">
          <a routerLink="/dashboard" class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
            Начать работу
          </a>
          <a routerLink="/doc" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Документы
          </a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent { }