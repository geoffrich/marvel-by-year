import Redis from 'ioredis';
import LZString from '$lib/lz-string';
import type { ComicDataWrapper } from '$lib/types/marvel';

const REDIS_CONNECTION = process.env['REDIS_CONNECTION'];

const DEFAULT_EXPIRY = 24 * 60 * 60;
const COMIC_ID_KEY = 'comics:ids';
const COMPRESS_COMICS = true;
const { compressToUTF16: compress, decompressFromUTF16: decompress } = LZString;

enum Status {
	Ready = 'ready',
	Reconnecting = 'reconnecting',
	End = 'end',
	Wait = 'wait',
	Connecting = 'connecting',
	Connect = 'connect'
}
export default class RedisClient {
	redis: Redis.Redis;

	constructor() {
		this.redis = REDIS_CONNECTION
			? new Redis(REDIS_CONNECTION, {
					retryStrategy: (times) => {
						if (times > 0) {
							console.log('unable to connect to redis');
							return null;
						} else {
							console.log('retrying redis connection');
							return 50;
						}
					},
					connectTimeout: 500
			  })
			: new Redis(); // fallback to locally-hosted Redis
	}

	get status(): string {
		return this.redis.status;
	}

	get closed(): boolean {
		return this.status === Status.End;
	}

	async get<T>(
		key: string,
		compressed = false,
		parse: (val: string) => T = JSON.parse
	): Promise<T> {
		if (this.closed) return;
		try {
			const result = await this.redis.get(key);
			return unpackResult(result, parse, compressed);
		} catch (e) {
			console.log('Unable to retrieve', key);
			console.log(e);
		}

		return null;
	}

	async getCachedComicsMulti(year: number, pages: number[]): Promise<ComicDataWrapper[]> {
		if (this.closed) return [];
		const keys = pages.map((p) => getComicKey(year, p));
		try {
			const results = await this.redis.mget(...keys);
			return results.map((r) => unpackResult(r, JSON.parse, COMPRESS_COMICS));
		} catch (e) {
			console.log('Unable to retrieve', ...keys);
			console.log(e);
		}

		return [];
	}

	async set<T>(key: string, value: T, expiry: number = DEFAULT_EXPIRY, shouldCompress = false) {
		if (this.closed) return;
		try {
			const stringified = JSON.stringify(value);
			const compressed = shouldCompress ? compress(stringified) : stringified;
			return await this.redis.set(key, compressed, 'EX', expiry);
		} catch (e) {
			console.log(e);
		}
	}

	async addComics(year: number, page: number, value: ComicDataWrapper) {
		if (this.closed) return;
		try {
			const key = getComicKey(year, page);
			const comicIds = value.data.results.map((c) => c.digitalId);
			if (comicIds.length === 0) {
				return;
			}

			const stringified = JSON.stringify(value);
			const compressed = COMPRESS_COMICS ? compress(stringified) : stringified;
			return await this.redis
				.multi()
				.set(key, compressed, 'EX', DEFAULT_EXPIRY)
				.sadd(COMIC_ID_KEY, comicIds)
				.exec();
		} catch (e) {
			console.log(e);
		}
	}

	async getRandomComicIds() {
		if (this.closed) return;
		return await this.redis.srandmember(COMIC_ID_KEY, 20);
	}

	async quit() {
		if (this.closed) return;
		await this.redis.quit();
	}
}

function unpackResult<T>(result: string, parse: (val: string) => T, compressed = false) {
	if (result) {
		const uncompressed = COMPRESS_COMICS ? decompress(result) : result;
		return parse(uncompressed);
	}

	return null;
}

function getComicKey(year: number, page: number) {
	return `year:${year}:${page}` + (COMPRESS_COMICS ? ':c' : '');
}
