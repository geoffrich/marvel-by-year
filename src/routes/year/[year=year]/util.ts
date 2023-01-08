import { z } from 'zod';
import { zfd } from 'zod-form-data';

const SortOptionEnum = z.enum(['BestMatch', 'Title', 'PublishDate', 'UnlimitedDate']);

const MonthEnum = z.enum([
	'all',
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]);

export const SortOption = SortOptionEnum.enum;
export const Month = MonthEnum.enum;

export const sortOptionText = SortOptionEnum.options.map(splitPascalCase);
export const filterSchema = zfd.formData({
	search: zfd.text(z.string().default('')),
	ascending: zfd.checkbox(),
	// use catch in case no value or bad value passed
	sortBy: zfd.text(SortOptionEnum.catch('BestMatch')),
	month: zfd.text(MonthEnum.catch('all'))
});

function splitPascalCase(s: string) {
	return s.replace(/[A-Z]/g, (match) => ' ' + match.toLowerCase()).trim();
}
