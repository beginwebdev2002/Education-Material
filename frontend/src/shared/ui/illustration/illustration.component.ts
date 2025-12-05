import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { IllustrationNames, IllustrationsData } from '../../models/illustration.model';
import { getIllustrationData } from './lib/illustration.data';


@Component({
  selector: 'app-illustration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './illustration.component.html',
  styleUrls: ['./illustration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IllustrationComponent implements OnInit {
  type = input.required<IllustrationNames>();

  currentIllustration = signal<IllustrationsData | undefined>(undefined);
  // currentIllustration = getIllustrationData(this.type);

  ngOnInit(): void {
    this.currentIllustration.set(getIllustrationData(this.type()));
  }

}