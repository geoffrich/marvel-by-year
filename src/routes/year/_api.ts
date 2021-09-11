import md5 from 'crypto-js/md5';
import type { ComicDataWrapper } from '$lib/types/marvel';

const PUBLIC_KEY = process.env['MARVEL_PUBLIC_KEY'];
const PRIVATE_KEY = process.env['MARVEL_PRIVATE_KEY'];

export async function getComics(year: string, page: number): Promise<ComicDataWrapper> {
	const ts = Date.now().toString();

	const params = {
		formatType: 'comic',
		noVariants: 'true',
		dateRange: `${year}-01-01,${year}-12-31`,
		hasDigitalIssue: 'true',
		orderBy: 'onsaleDate',
		limit: '100',
		offset: (100 * page).toString(),
		apikey: PUBLIC_KEY,
		hash: md5(ts + PRIVATE_KEY + PUBLIC_KEY),
		ts
	};

	const url = new URL('https://gateway.marvel.com:443/v1/public/comics');
	url.search = new URLSearchParams(params).toString();

	const result = await fetch(url.toString());
	const parsedResult = await result.json();

	return parsedResult;

	// TODO: error handling
}

// TODO: filter out digital comics not on MU (check for date?), e.g. Alias by Bendis
