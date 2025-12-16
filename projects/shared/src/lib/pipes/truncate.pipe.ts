import { Pipe, PipeTransform } from '@angular/core';

import _ from 'lodash';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: any, length: number, omission?: string): any {
    if (!_.isString(value)) {
      return value;
    }
    omission = _.defaultTo(omission, '');
    if (value.length <= length) {
      return value;
    }
    return `${_.truncate(value, { length, omission })}...`;
  }
}
