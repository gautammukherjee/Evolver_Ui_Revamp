import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'SourceNodeFilterPipe'
})

export class SourceNodePipe implements PipeTransform {
    transform(value: any[], filterBy: any): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((p: any) => p.source_node_name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}