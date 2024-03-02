import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'EdgeTypeFilterPipe'
})

export class EdgeTypePipe implements PipeTransform {
    transform(value: any[], filterBy: any): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((p: any) => p.edge_type_name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}