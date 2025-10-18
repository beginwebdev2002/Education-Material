import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSwitcherComponent } from '@components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Используем signal вместо обычного свойства для реактивности в zoneless режиме
  isMenuOpen = signal(false);

  toggleMenu() {
    // Обновляем signal с помощью update метода
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  closeMenu() {
    // Устанавливаем новое значение signal
    this.isMenuOpen.set(false);
  }
}