import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconButtonVariant = 'primary' | 'danger' | 'neutral';
export type IconButtonSize = 'sm' | 'md';

@Component({
  selector: 'app-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  icon = input.required<string>();
  ariaLabel = input.required<string>();
  variant = input<IconButtonVariant>('neutral');
  size = input<IconButtonSize>('md');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit'>('button');
}
