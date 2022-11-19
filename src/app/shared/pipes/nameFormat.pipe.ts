import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'nameFormat',
})

export class NameFormatPipe implements PipeTransform{
	transform(value: {lastName: string, firstName: string}) {
		return value.lastName.toUpperCase()+' '+
				value.firstName.charAt(0).toUpperCase() + value.firstName.slice(1).toLowerCase();
	}

}
