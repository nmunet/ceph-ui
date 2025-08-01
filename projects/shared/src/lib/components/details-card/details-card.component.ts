import { Component, Input } from '@angular/core';
import { TilesModule } from 'carbon-components-angular';

@Component({
  selector: 'cd-details-card',
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.scss',
  standalone: true,
  imports: [TilesModule]
})
export class DetailsCardComponent {
  @Input()
  cardTitle: string;
}
