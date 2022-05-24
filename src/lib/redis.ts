import Redis from 'ioredis';
import LZString from '$lib/lz-string';
import type { ComicDataWrapper } from '$lib/types/marvel';
import type { RandomComic } from '$lib/types';

const REDIS_CONNECTION = process.env['REDIS_CONNECTION'];

const DEFAULT_EXPIRY = 24 * 60 * 60;
const COMIC_ID_KEY = 'comics:ids';
const COMIC_ID_KEY_WITH_YEAR = 'comics:year-ids';

const RANDOM_COMIC_LIMIT = 12;
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

interface ExtendedRedis extends Redis.Redis {
	randomYear(key: string, startYear: number, endYear: number, seed: number): Promise<string[]>;
}

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

	async get<T>(key: string, parse: (val: string) => T = JSON.parse): Promise<T> {
		if (this.closed) return;
		try {
			const result = await this.redis.get(key);
			return parse(result);
		} catch (e) {
			console.log('Unable to retrieve', key);
			console.log(e);
		}

		return null;
	}

	async getCachedComicsMulti(year: number, pages: number[]): Promise<ComicDataWrapper[]> {
		if (this.closed) return [];
		const keys = pages.map((p) => getYearKey(year, p));
		try {
			const results = await this.redis.mget(...keys);
			return results.map((r) => unpackResult(r, JSON.parse));
		} catch (e) {
			console.log('Unable to retrieve', ...keys);
			console.log(e);
		}

		return [];
	}

	async set<T>(key: string, value: T, expiry: number = DEFAULT_EXPIRY) {
		if (this.closed) return;
		try {
			const stringified = JSON.stringify(value);
			return await this.redis.set(key, stringified, 'EX', expiry);
		} catch (e) {
			console.log(e);
		}
	}

	async getComicIdsWithImages(year: number): Promise<Set<string>> {
		if (this.closed) return new Set();
		const imagesKey = getComicWithImagesKey(year);
		const imageSetMembers = await this.redis.smembers(imagesKey);
		return new Set(imageSetMembers);
	}

	async addComics(
		year: number,
		page: number,
		value: ComicDataWrapper,
		comicIdsWithImages: Set<string>
	) {
		if (this.closed) return;
		try {
			const key = getYearKey(year, page);
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
			const compressed = compress(stringified);
			const ids = comics.map((c) => c.id);
			const idsWithYear = comics.flatMap((c) => [year, c.id]);

			let pipeline = this.redis
				.multi()
				// cache the Marvel API response itself
				.set(key, compressed, 'EX', DEFAULT_EXPIRY)
				// set with all Marvel comic IDs
				.sadd(COMIC_ID_KEY, ids)
				// add comic IDs to a sorted set, where the score is the year of publication
				.zadd(COMIC_ID_KEY_WITH_YEAR, ...idsWithYear)
				// Keep track of which comics we have stored images for
				// This set won't expire, so we should keep an eye out for broken images
				.sadd(imagesKey, ids);

			// only set image/ext/title for comics not in that set
			const comicsWithoutStoredImages = comics.filter(
				(c) => !comicIdsWithImages.has(c.id.toString())
			);
			console.log(`Adding images for ${comicsWithoutStoredImages.length} comics`);
			for (let { id, image, ext, title } of comicsWithoutStoredImages) {
				pipeline = pipeline.hset(getComicKey(id), 'image', image, 'ext', ext, 'title', title);
			}

			return await pipeline.exec();
		} catch (e) {
			console.log('Error when adding comics to redis', e);
		}
	}

	async getRandomComics(): Promise<RandomComic[]> {
		if (this.closed) return [];
		const ids = await this.redis.srandmember(COMIC_ID_KEY, RANDOM_COMIC_LIMIT);
		return await this.getRandomComicsFromIds(ids);
	}

	async getRandomComicsFromIds(ids: string[]): Promise<RandomComic[]> {
		let pipeline = this.redis.multi();

		for (let id of ids) {
			pipeline = pipeline.hgetall(getComicKey(id));
		}

		const comics = await pipeline.exec();

		return ids.map((id, idx) => {
			const result = comics[idx][1] as RandomComicRedis;
			return {
				id,
				title: result.title,
				image: result.image,
				ext: result.ext
			};
		});
	}

	async getRandomComicsForYear(
		startYear: number,
		endYear: number,
		seed: number
	): Promise<RandomComic[]> {
		if (this.closed) return;

		this.redis.defineCommand('randomYear', {
			numberOfKeys: 1,
			lua: `
				local count = redis.call('ZCARD', KEYS[1])

				if count ~= 0 then
					math.randomseed(tonumber(ARGV[3]))
					local start = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[1], ARGV[2], 'LIMIT', '0', '1')
					local last = redis.call('ZREVRANGEBYSCORE', KEYS[1], ARGV[2], ARGV[1], 'LIMIT', '0', '1')
					local startRank = redis.call('ZRANK', KEYS[1], start[1])
					local endRank = redis.call('ZRANK', KEYS[1], last[1])

					local ids = {}
					for i=1,${RANDOM_COMIC_LIMIT},1 do
						local rank = math.random(startRank, endRank)
						local range = redis.call('ZRANGE', KEYS[1], rank, rank)
						ids[i] = range[1]
					end

					return ids
				else
					return {}
				end
			`
		});

		console.log(`retrieving random comics with seed ${seed}`);

		const ids = await (this.redis as ExtendedRedis).randomYear(
			COMIC_ID_KEY_WITH_YEAR,
			startYear,
			endYear,
			seed
		);

		return await this.getRandomComicsFromIds(ids);
	}

	async quit() {
		if (this.closed) return;
		await this.redis.quit();
	}
}

function unpackResult<T>(result: string, parse: (val: string) => T) {
	if (result) {
		const uncompressed = decompress(result);
		return parse(uncompressed);
	}

	return null;
}

// Redis key for one page of the year API response
function getYearKey(year: number, page: number) {
	return `year:${year}:${page}:c`;
}

// Redis key for list of comics with stored images
function getComicWithImagesKey(year: number) {
	return `comic:image:${year}`;
}

// Redis key for subset of data about an individual comic
function getComicKey(id: string | number) {
	return `comic:${id}`;
}

interface RandomComicRedis {
	image: string;
	ext: string;
	title: string;
}
