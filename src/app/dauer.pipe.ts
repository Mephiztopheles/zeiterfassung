import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dauer'
})
export class DauerPipe implements PipeTransform {

  transform(ms: number): string {
    let stunden = Math.floor(ms / 3600000);
    let minuten = Math.floor(ms / 60000) - stunden * 60;
    return `${stunden}:${minuten <= 9 ? "0" + minuten : minuten}`;
  }

}
