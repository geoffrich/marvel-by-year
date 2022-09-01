/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {}

	interface Stuff {
		title: string;
	}

	// @migration TODO: use PageData
}
