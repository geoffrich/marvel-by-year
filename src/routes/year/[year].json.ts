import type { RequestHandler } from '@sveltejs/kit';
import testResponse from './testData.json';

const get: RequestHandler = async function get({ params }) {
	return {
		body: testResponse
	};
};

export { get };
