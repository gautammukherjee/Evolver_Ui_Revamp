import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'PairTypeFilterPipe'
})

export class PairTypePipe implements PipeTransform {
    transform(value: any[], filterBy: any): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((p: any) => p.pair_name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}