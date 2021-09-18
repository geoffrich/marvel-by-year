import type { Comic } from '$lib/types';
import { default as dayjs } from 'dayjs';

const NO_EVENT = '(no event)';
const NO_CREATOR = '(unknown)';

export function getSeries(c: Comic): string {
	return c.series.name;
}

export function getCreators({ creators }: Comic): string[] {
	if (creators.length > 0) {
		return creators.map((cr) => cr.name);
	} else {
		return [NO_CREATOR];
	}
}

export function getEvents({ events }: Comic): string[] {
	if (events.length > 0) {
		return events.map((e) => e.name);
	} else {
		return [NO_EVENT];
	}
}

export function compareDates(a: Comic, b: Comic) {
	return getOnSaleDate(a).diff(getOnSaleDate(b));
}

export function compareTitles(a: Comic, b: Comic) {
	return compareStrings(a.title, b.title);
}

export function isEventSelected({ events }: Comic, selectedEvents: Set<string>) {
	return (
		events.find((e) => selectedEvents.has(e.name)) !== undefined ||
		(selectedEvents.has(NO_EVENT) && events.length === 0)
	);
}

export function isCreatorSelected({ creators }: Comic, selectedCreators: Set<string>) {
	return (
		creators.find((e) => selectedCreators.has(e.name)) !== undefined ||
		(selectedCreators.has(NO_CREATOR) && creators.length === 0)
	);
}

export function getOnSaleDate(comic: Comic) {
	return dayjs(comic.dates.onSale);
}

function compareStrings(a, b) {
	if (a < b) {
		return -1;
	}

	if (a > b) {
		return 1;
	}

	return 0;
}
