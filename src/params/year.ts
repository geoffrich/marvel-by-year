import type { ParamMatcher } from '@sveltejs/kit';
import { MIN_YEAR, MAX_YEAR } from '$lib/years';

export const match: ParamMatcher = (param) => {
	const year = parseInt(param);
	return !isNaN(+param) && year >= MIN_YEAR && year <= MAX_YEAR;
};
