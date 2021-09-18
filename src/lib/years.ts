import dayjs from './dayjs';
export const MAX_YEAR = dayjs().year();
export const MIN_YEAR = 1939;

export const years = Array.from(Array(MAX_YEAR - MIN_YEAR + 1).keys()).map((x) => x + MIN_YEAR);
