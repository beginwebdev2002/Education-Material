import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent { }
