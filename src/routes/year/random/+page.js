import { redirect } from '@sveltejs/kit';
import { getRandomYear } from '$lib/years';

export async function load() {
	throw redirect(303, `/year/${getRandomYear()}`);
}
