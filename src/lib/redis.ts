import Redis from 'ioredis';

const REDIS_ENDPOINT = process.env['REDIS_ENDPOINT'];
const REDIS_PASSWORD = process.env['REDIS_PASSWORD'];
const REDIS_PORT = process.env['REDIS_PORT'];

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

// TODO: increase TTL
async function set<T>(key: string, value: T, expiry: number = 120) {
	return await redis.set(key, JSON.stringify(value), 'EX', expiry);
}

export default {
	get,
	set
};
