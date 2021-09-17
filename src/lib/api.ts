import md5 from 'crypto-js/md5.js';
import type { ComicDataWrapper } from '$lib/types/marvel';
import redis from '$lib/redis';

const PUBLIC_KEY = process.env['MARVEL_PUBLIC_KEY'];
const PRIVATE_KEY = process.env['MARVEL_PRIVATE_KEY'];

const COMICS_ENDPOINT = 'https://gateway.marvel.com/v1/public/comics';
const MAX_LIMIT = 100;

export async function getComics(year: string, page: number): Promise<ComicDataWrapper> {
	const key = `year:${year}:${page}`;
	// TODO: handle error
	const val = await redis.get<ComicDataWrapper>(key);

	if (val) {
		console.log(`found ${year} page ${page} in redis cache`);
		return val;
	}

	const result = await callMarvelApi(
		COMICS_ENDPOINT,
		getComicsSearchParams(year, page * MAX_LIMIT, MAX_LIMIT)
	);

	const parsedResult: ComicDataWrapper = await result.json();
	if (parsedResult.code === 200) {
		redis.addComics(key, parsedResult);
	}

	return parsedResult;
}

export async function getTotalComics(year: string): Promise<number> {
	const key = `year:${year}:total`;
	const val = await redis.get<number>(key, parseInt);
	if (val) {
		return val;
	}

	const result = await callMarvelApi(COMICS_ENDPOINT, getComicsSearchParams(year, 0, 1));
	const parsedResult: ComicDataWrapper = await result.json();

	if (parsedResult.code === 200) {
		const { total } = parsedResult.data;
		await redis.set(key, total);
		return total;
	}
	return -1;
}

export async function getRandomIds() {
	return await redis.getRandomComicIds();
}

async function callMarvelApi(urlString: string, params: Record<string, string>): Promise<Response> {
	const ts = Date.now().toString();

	const paramsWithKey = {
		...params,
		apikey: PUBLIC_KEY,
		hash: md5(ts + PRIVATE_KEY + PUBLIC_KEY).toString(),
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
