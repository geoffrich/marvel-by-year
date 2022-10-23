import Api from '$lib/api';
import { getImage, ImageSize } from '$lib/comics';
import Redis from '$lib/redis';

import { componentToPng } from '$lib/renderImage';
import type { RequestHandler } from './$types';
import Image from '../Image.svelte';

export const prerender = 'auto';

export const GET: RequestHandler = async ({ params, url }) => {
	const year = parseInt(params.year);
	console.log('Generating social image for ', year);
	const redis = new Redis();
	const api = new Api(redis, url.origin);
	const comics = await api.getRandomComics(year, year + 1, 5);
	const images = comics.map((c) => getImage(c.image, ImageSize.XXLarge, c.ext));
	return componentToPng(Image, { text: `Marvel Comics from ${year}`, images }, 630, 1200);
};
