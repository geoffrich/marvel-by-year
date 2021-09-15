import md5 from 'crypto-js/md5.js';
import type { ComicDataWrapper } from '$lib/types/marvel';

const PUBLIC_KEY = process.env['MARVEL_PUBLIC_KEY'];
const PRIVATE_KEY = process.env['MARVEL_PRIVATE_KEY'];

const COMICS_ENDPOINT = 'https://gateway.marvel.com/v1/public/comics';
const MAX_LIMIT = 100;

export async function getComics(year: string, page: number): Promise<ComicDataWrapper> {
	const result = await callMarvelApi(
		COMICS_ENDPOINT,
		getComicsSearchParams(year, page * MAX_LIMIT, MAX_LIMIT)
	);
	return await result.json();
}

export async function getTotalComics(year: string): Promise<number> {
	const result = await callMarvelApi(COMICS_ENDPOINT, getComicsSearchParams(year, 0, 1));
	const parsedResult: ComicDataWrapper = await result.json();
	// TODO: errors
	return parsedResult.data.total;
}

async function callMarvelApi(urlString: string, params: Record<string, string>): Promise<Response> {
	const ts = Date.now().toString();

	const paramsWithKey = {
		...params,
		apikey: PUBLIC_KEY,
		hash: md5(ts + PRIVATE_KEY + PUBLIC_KEY),
		ts
	};

	const url = new URL(urlString);
	url.search = new URLSearchParams(paramsWithKey).toString();

	return await fetch(url.toString());
}

function getComicsSearchParams(year: string, offset: number, limit: number) {
	return {
		formatType: 'comic',
		noVariants: 'true',
		dateRange: `${year}-01-01,${year}-12-31`,
		hasDigitalIssue: 'true',
		limit: limit.toString(),
		offset: offset.toString()
	};
}
