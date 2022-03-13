<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Home'
			}
		};
	};
</script>

<script>
	import { MIN_YEAR, MAX_YEAR } from '$lib/years';
</script>

<svelte:head>
	<meta property="og:site_name" content="Marvel Unlimited by Year" />
	<meta property="og:title" content="Home - Marvel Unlimited by Year" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://marvel.geoffrich.net/" />
	<meta property="og:description" content="See what issues are available on MU for a given year." />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@geoffrich_" />
</svelte:head>

<div class="container spaced">
	<h1>Browse Marvel Unlimited by Year</h1>
	<p>
		This site allows you to see what issues are available on Marvel Unlimited for a given year. Tap
		the comic's cover to be taken directly to the comic in Marvel Unlimited or the web-based reader,
		depending on your device. If you're on Android, you may have to use the issue's title link
		instead to launch the app. You can also filter the available issues for a given year by series,
		creators, or events.
	</p>
	<p>
		Note that some of the pages may use up quite a bit of data due to the size of the API response
		and the images. Each cover image is about 13KB, so a year with 1000 comics released will use up
		approximately 13MB of data. Tread carefully if you're on a mobile device with a limited amount
		of data.
	</p>
	<p>
		Curious about how I built this? Browse the <a href="https://github.com/geoffrich/marvel-by-year"
			>source code</a
		>
		or read my <a href="https://geoffrich.net/posts/marvel-unlimited-by-year/">blog post</a>.
	</p>

	<ul>
		<li><a href="/year">Browse all years</a></li>
		<li><a href="/year/{MIN_YEAR}">Start at the beginning</a></li>
		<li><a href="/year/{MAX_YEAR}">See what's current</a></li>
		<li><a href="/comic/random">Get a random comic</a></li>
		<li><a href="/year/1965?search=Daredevil%208">Sky crimes</a></li>
	</ul>
</div>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15.625rem, 1fr));
		gap: var(--size-3);
		align-content: stretch;
	}

	li a {
		color: white;
		background-color: var(--primary);
		padding: var(--size-8) var(--size-3);
		text-align: center;
		font-size: var(--font-size-3);
		display: block;
		border-radius: var(--radius-2);
		height: 100%;
		text-decoration: none;
	}

	li a:hover:not(:active),
	li a:focus {
		outline: 2px solid var(--primary);
		outline-offset: 5px;
	}

	li:nth-child(1) a {
		background-image: var(--gradient-1);
	}

	li:nth-child(2) a {
		background-image: var(--gradient-2);
	}

	li:nth-child(3) a {
		background-image: var(--gradient-3);
	}

	li:nth-child(4) a {
		background-image: var(--gradient-7);
	}

	li:nth-child(5) a {
		background-image: var(--gradient-10);
	}
</style>
