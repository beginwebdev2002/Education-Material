import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Material } from '../model/material.model';
import { TranslatePipe, TranslationLabelPipe } from '@shared/pipes';
import { IconButtonComponent } from '@shared/ui';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, TranslationLabelPipe, IconButtonComponent],
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialListComponent {
  materials = input.required<Material[]>();
  isLoading = input(false);

  download = output<Material>();
  remove = output<Material>();
}
