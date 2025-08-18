import { Component, Input } from '@angular/core';
import { GridModule, TilesModule } from 'carbon-components-angular';

@Component({
  selector: 'cd-details-card',
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.scss',
  standalone: true,
  imports: [TilesModule, GridModule]
})
export class DetailsCardComponent {
  @Input()
  cardTitle: string;
}
