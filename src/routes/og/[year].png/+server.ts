import Api from '$lib/api';
import { getImage, ImageSize } from '$lib/comics';
import Redis from '$lib/redis';

import { componentToPng } from '$lib/renderImage';
import type { RequestHandler } from './$types';
import Image from '../Image.svelte';
import { error } from '@sveltejs/kit';
import { MAX_YEAR, MIN_YEAR } from '$lib/years';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	const year = parseInt(params.year);
	// TODO: turn into matcher
	if (year < MIN_YEAR || year > MAX_YEAR || isNaN(year)) {
		throw error(400, 'Not a valid year');
	}
	const redis = new Redis();
	const api = new Api(redis);
	const comics = await api.getRandomComics(year, year + 1);
	const images = comics.map((c) => getImage(c.image, ImageSize.XXLarge, c.ext)).slice(0, 5);
	console.log(images);
	return componentToPng(Image, { text: year, images }, 630, 1200);
};
