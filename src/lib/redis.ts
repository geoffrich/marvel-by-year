import Redis from 'ioredis';
import LZString from '$lib/lz-string';
import type { ComicDataWrapper } from '$lib/types/marvel';

const REDIS_ENDPOINT = process.env['REDIS_ENDPOINT'];
const REDIS_PASSWORD = process.env['REDIS_PASSWORD'];
const REDIS_PORT = process.env['REDIS_PORT'];

const DEFAULT_EXPIRY = 24 * 60 * 60;
const COMIC_ID_KEY = 'comics:ids';
const COMPRESS_COMICS = true;
const { compressToUTF16: compress, decompressFromUTF16: decompress } = LZString;

// TODO: handle Redis connection issues
const redis = new Redis({
	host: REDIS_ENDPOINT,
	port: parseInt(REDIS_PORT),
	password: REDIS_PASSWORD,
	tls: {}
});

async function get<T>(
	key: string,
	compressed = false,
	parse: (val: string) => T = JSON.parse
): Promise<T> {
	try {
		const result = await redis.get(key);
		return unpackResult(result, parse, compressed);
	} catch (e) {
		console.log('Unable to retrieve', key);
		console.log(e);
	}

	return null;
}

async function set<T>(
	key: string,
	value: T,
	expiry: number = DEFAULT_EXPIRY,
	shouldCompress = false
) {
	try {
		const stringified = JSON.stringify(value);
		const compressed = shouldCompress ? compress(stringified) : stringified;
		return await redis.set(key, compressed, 'EX', expiry);
	} catch (e) {
		console.log(e);
	}
}

export async function getCachedComicsMulti(
	year: number,
	pages: number[]
): Promise<ComicDataWrapper[]> {
	const keys = pages.map((p) => getComicKey(year, p));
	try {
		const results = await redis.mget(...keys);
		return results.map((r) => unpackResult(r, JSON.parse, COMPRESS_COMICS));
	} catch (e) {
		console.log('Unable to retrieve', ...keys);
		console.log(e);
	}

	return [];
}

function unpackResult<T>(result: string, parse: (val: string) => T, compressed = false) {
	if (result) {
		const uncompressed = COMPRESS_COMICS ? decompress(result) : result;
		return parse(uncompressed);
	}

	return null;
}

async function addComics(year: number, page: number, value: ComicDataWrapper) {
	try {
		const key = getComicKey(year, page);
		const comicIds = value.data.results.map((c) => c.digitalId);
		if (comicIds.length === 0) {
			return;
		}

		const stringified = JSON.stringify(value);
		const compressed = COMPRESS_COMICS ? compress(stringified) : stringified;
		return await redis
			.multi()
			.set(key, compressed, 'EX', DEFAULT_EXPIRY)
			.sadd(COMIC_ID_KEY, comicIds)
			.exec();
	} catch (e) {
		console.log(e);
	}
}

function getComicKey(year: number, page: number) {
	return `year:${year}:${page}` + (COMPRESS_COMICS ? ':c' : '');
}

async function getRandomComicIds() {
	return await redis.srandmember(COMIC_ID_KEY, 20);
}

export default {
	get,
	set,
	addComics,
	getRandomComicIds
};
