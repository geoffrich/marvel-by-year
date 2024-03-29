/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {}

	interface PageData {
		title: string;
		image?: string;
		description?: string;
	}
}
