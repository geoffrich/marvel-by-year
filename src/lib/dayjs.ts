import { default as dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export default dayjs;
