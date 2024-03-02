import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nodespipes'
})
export class NodespipesPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return value * 3;
  }

}
