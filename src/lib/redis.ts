import Redis from 'ioredis';
import LZString from '$lib/lz-string';
import type { ComicDataWrapper } from '$lib/types/marvel';
import type { RandomComic } from '$lib/types';

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

const redisConfig: Redis.RedisOptions = {
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
};

export default class RedisClient {
	redis: Redis.Redis;

	constructor() {
		this.redis = REDIS_CONNECTION
			? new Redis(REDIS_CONNECTION, redisConfig)
			: new Redis(redisConfig); // fallback to locally-hosted Redis
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
			const imagesKey = getComicWithImagesKey(year);
			const comics = value.data.results.map((c) => ({
				id: c.digitalId,
				image: c.thumbnail.path,
				ext: c.thumbnail.extension,
				title: c.title
			}));
			if (comics.length === 0) {
				return;
			}

			const stringified = JSON.stringify(value);
			const compressed = COMPRESS_COMICS ? compress(stringified) : stringified;
			const ids = comics.map((c) => c.id);

			// TODO: is there a way to combine this command with the previous get?
			const imageSetMembers = await this.redis.smembers(imagesKey);
			const comicIdsWithImages = new Set(imageSetMembers);

			let pipeline = this.redis
				.multi()
				.set(key, compressed, 'EX', DEFAULT_EXPIRY)
				.sadd(COMIC_ID_KEY, ids)
				.sadd(
					// Keep track of which comics we have stored images for
					// TODO: this won't expire -- is this an issue?
					imagesKey,
					ids
				);

			// only set image/ext/title for comics not in that set
			const comicsWithoutStoredImages = comics.filter(
				(c) => !comicIdsWithImages.has(c.id.toString())
			);
			console.log(`Adding images for ${comicsWithoutStoredImages.length} comics`);
			for (let { id, image, ext, title } of comicsWithoutStoredImages) {
				// TODO: extract common id
				// TODO: document redis structure
				pipeline = pipeline.hset(`comic:${id}`, 'image', image, 'ext', ext, 'title', title);
			}

			return await pipeline.exec();
		} catch (e) {
			console.log('Error when adding comics to redis', e);
		}
	}

	async getRandomComics(): Promise<RandomComic[]> {
		if (this.closed) return;
		const ids = await this.redis.srandmember(COMIC_ID_KEY, 18);
		let pipeline = this.redis.multi();

		for (let id of ids) {
			pipeline = pipeline.hgetall(`comic:${id}`);
		}

		const imagePaths = await pipeline.exec();

		return ids.map((id, idx) => {
			const result = imagePaths[idx][1] as RandomComicRedis;
			return {
				id,
				title: result.title,
				image: result.image,
				ext: result.ext
			};
		});
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

function getComicWithImagesKey(year: number) {
	return `comic:image:${year}`;
}

interface RandomComicRedis {
	image: string;
	ext: string;
	title: string;
}
