import type { ComicResponse, Comic } from '$lib/types';
import { Role } from '$lib/types/enums';
import type { ComicDataWrapper, Comic as ApiComic } from '$lib/types/marvel';
import { dedupe } from '$lib/util';

export function adaptResponses(responses: ComicDataWrapper[]): ComicResponse {
	if (responses.length === 0) {
		return {
			comics: []
		};
	}

	const comics = responses.flatMap((r) => r.data.results);
	const adapted = comics.map(mapComic);

	// remove duplicate ids
	const deduped = dedupe(adapted, (c) => c.id);

	return {
		attr: responses[0].attributionText,
		comics: deduped
	};
}

function mapComic(comic: ApiComic): Comic {
	const { id, digitalId, title, issueNumber, description, modified, pageCount, dates } = comic;

	const detailUrl = comic.urls
		.find((u) => u.type === 'detail')
		?.url.split('?')
		.shift();
	const onSale = dates.find((d) => d.type === 'onsaleDate')?.date;
	const unlimited = dates.find((d) => d.type === 'unlimitedDate')?.date;

	return {
		id,
		digitalId,
		title,
		issue: issueNumber,
		// when this is null, don't include as a key
		description: description ? description : undefined,
		modified,
		pageCount,
		detailUrl,
		// some series are coming back null
		// TODO: try to derive from name
		series: comic.series
			? {
					id: getIdFromApiUrl(comic.series.resourceURI),
					name: comic.series.name
			  }
			: {
					id: -1,
					name: '(unknown)'
			  },
		dates: { onSale, unlimited },
		creators:
			comic.creators?.items.map((c) => ({
				id: getIdFromApiUrl(c.resourceURI),
				name: c.name,
				role: getRoleEnum(c.role)
			})) ?? [],
		cover: {
			path: comic.thumbnail.path,
			ext: comic.thumbnail.extension
		},
		events:
			comic.events?.items.map((e) => ({
				id: getIdFromApiUrl(e.resourceURI),
				name: e.name
			})) ?? []
	};
}

function getIdFromApiUrl(url: string): number {
	return parseInt(url.split('/').pop());
}

function getRoleEnum(role: string): Role {
	// this removes the (cover) designation
	const shortenedRole = role.split(' (').shift().toLowerCase();
	switch (shortenedRole) {
		case 'penciler':
		case 'penciller':
			return Role.Penciler;
		case 'inker':
			return Role.Inker;
		case 'writer':
			return Role.Writer;
		case 'letterer':
			return Role.Letterer;
		case 'colorist':
			return Role.Colorist;
		case 'artist':
			return Role.Artist;
		case 'editor':
			return Role.Editor;
		case 'painter':
			return Role.Painter;
		case 'project manager':
			return Role.ProjectManager;
		// TODO: map these?
		case 'other':
		case 'publisher':
		case 'director of digital content':
		case 'digital coordinator':
		case 'digital production manager':
		case 'editor in chief':
		case 'production':
			return Role.Unknown;
		default:
			console.log('unknown role', role);
			return Role.Unknown;
	}
}
