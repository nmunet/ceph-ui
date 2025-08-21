import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'cd-help-text',
  templateUrl: './help-text.component.html',
  styleUrls: ['./help-text.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HelpTextComponent {
  @Input()
  formAllFieldsRequired = false;
}
