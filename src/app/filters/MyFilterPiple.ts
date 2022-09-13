import { Pipe, PipeTransform } from '@angular/core';
import { Birds } from '../models/Birds';

@Pipe({
    name: 'myfilter',
    pure: false
})

export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Birds): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.name.indexOf(filter.name) !== -1);
    }
}
