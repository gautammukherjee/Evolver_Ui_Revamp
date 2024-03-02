import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'FilterFilterPipe'
})

export class FilterDataPipe implements PipeTransform {
    transform(value: any[], filterBy: any): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((p: any) => p.scenario_name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}