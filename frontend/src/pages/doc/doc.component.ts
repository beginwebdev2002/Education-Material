import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Документы
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Здесь будут отображаться созданные документы
      </p>
    </div>
  `
})
export class DocComponent { }