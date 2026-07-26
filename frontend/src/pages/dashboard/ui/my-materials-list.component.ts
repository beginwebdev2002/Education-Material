import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Material } from '@entities/material';

const STATUS_BADGE_CLASSES: Record<Material['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

@Component({
  selector: 'app-my-materials-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-materials-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMaterialsListComponent {
  materials = input.required<Material[]>();
  isLoading = input(false);

  download = output<Material>();
  remove = output<Material>();

  statusBadgeClass(status: Material['status']): string {
    return STATUS_BADGE_CLASSES[status];
  }
}
