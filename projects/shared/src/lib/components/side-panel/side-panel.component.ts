import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule, IconModule, LayerModule, PanelModule, ThemeModule } from 'carbon-components-angular';

@Component({
  selector: 'cd-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  standalone: true,
  imports: [
    PanelModule,
    ButtonModule,
    IconModule,
    CommonModule,
    LayerModule,
    ThemeModule
  ]
})
export class SidePanelComponent {
  @Input() expanded = false;
  @Input() headerText = '';
  @Input() overlay = true;
   @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
  @Input() layer: number;
  @Input() theme: string;

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
