import { Component, Input } from '@angular/core';
import { Icons } from '../../enum/icons.enum';
import { HelperType } from '../../enum/cd-helper.enum';
import { IconModule, PopoverModule, TooltipModule } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cd-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
  standalone: true,
  imports: [
    TooltipModule,
    PopoverModule,
    IconModule,
    CommonModule
  ] 
})
export class HelperComponent {
  icons = Icons;
  isPopoverOpen = false;
  helperType = HelperType;

  // Tooltip: Displayed on hover or focus and contains contextual, helpful, and nonessential information.
  // Popover: Displayed on click and can contain varying text and interactive elements
  @Input() type: HelperType.tooltip | HelperType.popover = HelperType.tooltip; // Default to tooltip for backward compatibility
  @Input() class: string;
  @Input() html: any;
  @Input() iconSize = this.icons.size16;
  @Input() iconType = this.icons.info;

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  closePopover() {
    if (this.type === HelperType.popover && this.isPopoverOpen) {
      this.isPopoverOpen = false;
    }
  }
}
