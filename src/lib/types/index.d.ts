import { Role } from './enums';

export interface RandomResponse {
	ids: string[];
}

export interface ComicResponse {
	comics: Comic[];
	attr?: string;
}

export interface Comic {
	id: number;
	digitalId: number;
	title: string;
	issue: number;
	description: string;
	modified: string;
	pageCount: number;
	detailUrl: string; // urls[ { type: detail } ]
	series: SeriesSummary;
	dates: Dates;
	creators: CreatorSummary[];
	cover: ImageDetail;
	events: EventSummary[];
}

export interface SeriesSummary {
	name: string;
	id: number;
}

export interface Dates {
	onSale: string;
	unlimited: string;
}

export interface CreatorSummary {
	name: string;
	id: number;
	role: Role;
}

export interface ImageDetail {
	path: string; // TODO: store base path somehow?
	ext: string;
}

export interface EventSummary {
	name: string;
	id: number;
}
