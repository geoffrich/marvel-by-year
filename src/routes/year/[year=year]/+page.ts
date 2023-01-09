import type { PageLoad } from './$types';

import { filterSchema } from './util';

export const load: PageLoad = function ({ data: props, url }) {
	const filter = filterSchema.parse(url.searchParams);
	return {
		...props,
		...filter,
		title: `Comics for ${props.year}`,
		image: `${url.origin}/og/${props.year}.png`,
		description: `See what issues are available on MU for ${props.year}.`
	};
};
