import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-statistics-page',
  standalone: true,
  templateUrl: './statistics.page.component.html',
  styleUrls: ['./statistics.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPageComponent { }
