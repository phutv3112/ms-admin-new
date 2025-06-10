import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): any {
    if (value instanceof File) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
    }
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
