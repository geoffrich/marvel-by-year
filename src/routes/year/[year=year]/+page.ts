import type { PageLoad } from './$types';

export const load: PageLoad = function ({ data: props, url }) {
	return {
		...props,
		title: `Comics for ${props.year}`,
		image: `${url.origin}/og/${props.year}.png`,
		description: `See what issues are available on MU for ${props.year}.`
	};
};
