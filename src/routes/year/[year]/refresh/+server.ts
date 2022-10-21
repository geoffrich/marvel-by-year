import type { RequestHandler } from './$types';
import type { RefreshRequest } from '$lib/types';
import MarvelApi from '$lib/api';
import Redis from '$lib/redis';

export const POST: RequestHandler = async ({ params, request, url }) => {
	// TODO: input validation
	// TODO: prevent multiple in flight requests? probably not a big deal
	const body: RefreshRequest = await request.json();
	const redis = new Redis();
	const api = new MarvelApi(redis, url.origin);
	await api.getFromMarvelApiAndCache(
		parseInt(params.year),
		body.page,
		new Set(body.comicIdsWithImages)
	);
	return new Response(null, { status: 200 });
};
