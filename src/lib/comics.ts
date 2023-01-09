import type { Comic } from '$lib/types';
import dayjs from './dayjs';

const NO_EVENT = '(no event)';
const NO_CREATOR = '(unknown)';

export function getSeries(c: Comic) {
	return c.series;
}

export function getCreators({ creators }: Comic) {
	if (creators.length > 0) {
		return creators;
	} else {
		return [{ id: -1, name: NO_CREATOR }];
	}
}

export function getEvents({ events }: Comic) {
	if (events.length > 0) {
		return events;
	} else {
		return [{ id: -1, name: NO_EVENT }];
	}
}

export function compareDates(a: Comic, b: Comic) {
	return getOnSaleDate(a).diff(getOnSaleDate(b));
}

export function compareUnlimitedDates(a: Comic, b: Comic) {
	return getUnlimitedDate(a).diff(getUnlimitedDate(b));
}

export function compareTitles({ title: titleA }: Comic, { title: titleB }: Comic) {
	// TODO: possible perf enhancement
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#performance
	return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
}

export function isEventSelected({ events }: Comic, selectedEvents: Set<number>) {
	return (
		events.find((e) => selectedEvents.has(e.id)) !== undefined ||
		(selectedEvents.has(-1) && events.length === 0)
	);
}

// TODO: make more efficient
export function isCreatorSelected({ creators }: Comic, selectedCreators: Set<number>) {
	return (
		creators.find((e) => selectedCreators.has(e.id)) !== undefined ||
		(selectedCreators.has(-1) && creators.length === 0)
	);
}

export function getOnSaleDate(comic: Comic) {
	return dayjs.utc(comic.dates.onSale);
}

export function getUnlimitedDate(comic: Comic) {
	return dayjs.utc(comic.dates.unlimited);
}

export function getImage(path: string, size: ImageSize, ext?: string) {
	if (path === undefined) {
		return '';
	}
	if (ext === undefined) {
		// assume the extension is included in the path
		let splitPath = path.split('.');
		ext = splitPath.pop();
		path = splitPath.join('.');
	}

	return `${path.replace('http:', 'https:')}/${size}.${ext}`;
}

// documented at https://developer.marvel.com/documentation/images
export enum ImageSize {
	Small = 'portrait_small', // 50x75
	Medium = 'portrait_medium', // 100x150
	Large = 'portrait_xlarge', // 150x225
	XLarge = 'portrait_fantastic', // 168x252
	XXLarge = 'portrait_incredible', // 216x324
	XXXLarge = 'portrait_uncanny' // 300x450
}
