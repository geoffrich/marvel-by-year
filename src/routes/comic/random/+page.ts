import type { PageLoad } from './$types';
import { decades } from '$lib/years';

export const load: PageLoad = function ({ data: props }) {
	const { decade } = props;
	return {
		...props,
		title: decade ? `Random comics from the ${getDecadeAsString(decade)}` : 'Random comics'
	};
};

function getDecadeAsString(decade: number) {
	return decades.find((d) => d.startYear >= decade && decade <= d.endYear).text;
}
