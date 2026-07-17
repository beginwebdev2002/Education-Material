import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IllustrationComponent } from '@shared/ui';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IllustrationComponent, TranslatePipe],
})
export class HomeComponent { }