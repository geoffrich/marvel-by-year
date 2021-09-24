import dayjs from './dayjs';
export const MAX_YEAR = dayjs().year();
export const MIN_YEAR = 1939;

export const years = Array.from(Array(MAX_YEAR - MIN_YEAR + 1).keys()).map((x) => x + MIN_YEAR);
// TODO: consolidate decade -> string representation
export const decades = ['pre-1960', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export function getRandomYear(): number {
	return Math.floor(Math.random() * (MAX_YEAR - MIN_YEAR) + MIN_YEAR);
}
