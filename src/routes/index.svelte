<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { years } from '$lib/years';
	import { MIN_ID, MAX_ID } from '$lib/comics';
	import { Refresh } from '$lib/icons';
	import IconButton from '$lib/components/IconButton.svelte';

	// TODO: how is this with prerendering
	let randomId;
	setRandomId();

	// TODO: make this smarter, a lot of the comics don't exist
	// use redis somehow?
	function setRandomId() {
		randomId = Math.floor(Math.random() * (MAX_ID - MIN_ID)) + MIN_ID;
	}
</script>

<svelte:head>
	<title>Browse Marvel Unlimited by Year</title>
</svelte:head>

<h1>Browse Marvel Unlimited by Year</h1>
<p>
	This site allows you to see what issues are available on Marvel Unlimited for a given year. Tap
	the comic's cover to be taken directly to the comic in Marvel Unlimited or the web-based reader.
</p>
<p>
	You can also filter the available issues for a given year by series, creators, or events. Note
	that the data is paginated&mdash;you may not see all series for a given year until you have
	navigated to further pages.
</p>
<p>
	This site is a work in progress. Due to limitations of the Marvel API, you may experience issues
	such as timeouts and rate-limiting. Marvel limits developers to 3000 API calls/day&mdash;caching
	is implemented to try and mitigate that, but it still may be an issue. If you can't get a page to
	load, try again tomorrow.
</p>
<p>
	Because of these API limits, please <em>do not</em> share links to this site on social media for the
	time being.
</p>

<a href="https://read.marvel.com/#/book/{randomId}">Random comic!</a>
<IconButton altText="Refresh" on:click={setRandomId}><Refresh /></IconButton>

<h2>Jump to a year</h2>
<ul>
	{#each years as year (year)}
		<li><a href="/year/{year}">{year}</a></li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, 50px);
		list-style: none;
		padding: 0;
		gap: 0.5rem;
		justify-content: center;
	}

	li {
		background-color: var(--secondary);
	}

	ul a {
		display: block;
		padding: 0.5rem;
	}
</style>
