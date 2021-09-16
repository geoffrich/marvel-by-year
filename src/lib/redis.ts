import Redis from 'ioredis';
import type { ComicDataWrapper } from '$lib/types/marvel';

const REDIS_ENDPOINT = process.env['REDIS_ENDPOINT'];
const REDIS_PASSWORD = process.env['REDIS_PASSWORD'];
const REDIS_PORT = process.env['REDIS_PORT'];

const DEFAULT_EXPIRY = 24 * 60 * 60;
const COMIC_ID_KEY = 'comics:ids';

// TODO: handle Redis connection issues
const redis = new Redis({
	host: REDIS_ENDPOINT,
	port: parseInt(REDIS_PORT),
	password: REDIS_PASSWORD,
	tls: {}
});

async function get<T>(key: string, parse: (val: string) => T = JSON.parse): Promise<T> {
	const val = await redis.get(key);
	if (val) {
		return parse(val);
	}

	return null;
}

async function set<T>(key: string, value: T, expiry: number = DEFAULT_EXPIRY) {
	return await redis.set(key, JSON.stringify(value), 'EX', expiry);
}

async function addComics(key: string, value: ComicDataWrapper) {
	const comicIds = value.data.results.map((c) => c.digitalId);
	return await redis
		.multi()
		.set(key, JSON.stringify(value), 'EX', DEFAULT_EXPIRY)
		.sadd(COMIC_ID_KEY, comicIds)
		.exec();
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
