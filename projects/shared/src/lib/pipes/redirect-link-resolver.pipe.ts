import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'redirectLinkResolver',
  standalone: true
})
export class RedirectLinkResolverPipe implements PipeTransform {
  transform(redirectLink: string[], value: string): string[] {
    return redirectLink.map((seg) => (seg === '::prop' ? value : seg));
  }
}
