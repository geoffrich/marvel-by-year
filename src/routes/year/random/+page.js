import { redirect } from '@sveltejs/kit';
import { getRandomYear } from '$lib/years';

export async function load() {
	// @migration TODO: throws error on client. needs beta vite version
	throw redirect(303, `/year/${getRandomYear()}`);
}
