import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = function () {
	return {
		title: 'Home'
	};
};
