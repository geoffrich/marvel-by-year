import type { PageLoad } from './$types';

export const load: PageLoad = function ({ data: props }) {
	return {
		...props,
		title: `Comics for ${props.year}`
	};
};
