import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  templateUrl: './analytics.page.component.html',
  styleUrls: ['./analytics.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent { }
