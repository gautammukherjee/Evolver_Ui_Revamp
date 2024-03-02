import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ArticleFilterPipe'
})

export class FilterArticlePipe implements PipeTransform {
    transform(value: any[], filterBy: any): any[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((p: any) => p.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}