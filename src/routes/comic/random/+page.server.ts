import type { PageServerLoad } from './$types';
import Api from '$lib/api';
import Redis from '$lib/redis';
import { decades } from '$lib/years';
import type { RandomComic } from '$lib/types';
import { error } from '@sveltejs/kit';

interface GetResponse {
	comics: RandomComic[];
	decade: number;
}

// @migration TODO: figure out typing
export const load: PageServerLoad = async function get({ url }) {
	try {
		const query = url.searchParams;
		const redis = new Redis();
		const api = new Api(redis);
		const decadeQuery = parseInt(query.get('decade'));
		let comics: RandomComic[] = [];

		if (decadeQuery) {
			const decade = decades.find((d) => d.startYear === decadeQuery);
			if (!decade) {
				throw error(400);
			}
			comics = await api.getRandomComics(decade.startYear, decade.endYear);
		} else {
			comics = await api.getRandomComics();
		}

		return {
			comics,
			decade: decadeQuery
		};
	} catch (e) {
		console.log('Error when getting random: ', e);
		throw error(500);
	}
};
