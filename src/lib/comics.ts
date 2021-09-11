import type { Comic } from '$lib/types/marvel';
import { default as dayjs } from 'dayjs';

const NO_EVENT = '(no event)';
const NO_CREATOR = '(unknown)';

export function getComicSeries(c: Comic): string {
	return c.series.name;
}

export function getComicCreators(c: Comic): string[] {
	const creators = c.creators.items;
	if (creators.length > 0) {
		return creators.map((cr) => cr.name);
	} else {
		return [NO_CREATOR];
	}
}

export function getComicEvents(c: Comic): string[] {
	const events = c.events.items;
	if (events.length > 0) {
		return events.map((e) => e.name);
	} else {
		return [NO_EVENT];
	}
}

export function compareComicDates(a: Comic, b: Comic) {
	return getComicDate(a).diff(getComicDate(b));
}

export function compareComicTitles(a: Comic, b: Comic) {
	return compareStrings(a.title, b.title);
}

export function isEventSelected(comic: Comic, selectedEvents: Set<string>) {
	const eventList = comic.events.items;

	return (
		eventList.find((e) => selectedEvents.has(e.name)) !== undefined ||
		(selectedEvents.has(NO_EVENT) && eventList.length === 0)
	);
}

export function isCreatorSelected(comic: Comic, selectedCreators: Set<string>) {
	const creatorList = comic.creators.items;

	return (
		creatorList.find((e) => selectedCreators.has(e.name)) !== undefined ||
		(selectedCreators.has(NO_CREATOR) && creatorList.length === 0)
	);
}

export function getComicDate(comic: Comic) {
	return dayjs(comic.dates.find((d) => d.type === 'onsaleDate').date);
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
