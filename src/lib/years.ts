import dayjs from './dayjs';
export const MAX_YEAR = dayjs().year();
export const MIN_YEAR = 1939;

export const years = Array.from(Array(MAX_YEAR - MIN_YEAR + 1).keys()).map((x) => x + MIN_YEAR);

export const decades = [
	{ text: 'pre-1960', startYear: 1930, endYear: 1959 },
	{ text: '1960s', startYear: 1960, endYear: 1969 },
	{ text: '1970s', startYear: 1970, endYear: 1979 },
	{ text: '1980s', startYear: 1980, endYear: 1989 },
	{ text: '1990s', startYear: 1990, endYear: 1999 },
	{ text: '2000s', startYear: 2000, endYear: 2009 },
	{ text: '2010s', startYear: 2010, endYear: 2019 },
	{ text: '2020s', startYear: 2020, endYear: 2029 }
];

export function getRandomYear(): number {
	return Math.floor(Math.random() * (MAX_YEAR - MIN_YEAR) + MIN_YEAR);
}
