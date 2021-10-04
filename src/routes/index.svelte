<script context="module">
	export const prerender = true;
</script>

<script>
	import title from '$lib/stores/title';
	import { MIN_YEAR, MAX_YEAR } from '$lib/years';

	$title = 'Home';
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

<div class="container">
	<h1>Browse Marvel Unlimited by Year</h1>
	<p>
		This site allows you to see what issues are available on Marvel Unlimited for a given year. Tap
		the comic's cover to be taken directly to the comic in Marvel Unlimited or the web-based reader,
		depending on your device. You can also filter the available issues for a given year by series,
		creators, or events.
	</p>
	<p>
		Note that some of the pages may use up quite a bit of data due to the size of the API response
		and the images. Each cover image is about 13KB, so a year with 1000 comics released will use up
		approximately 13MB of data. Tread carefully if you're on a mobile device with a limited amount
		of data.
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
		margin-top: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		align-content: stretch;
	}

	a {
		color: white;
		background-color: var(--primary);
		padding: 3rem 1rem;
		text-align: center;
		font-size: 1.25rem;
		display: block;
		border-radius: 0.5rem;
		height: 100%;
		text-decoration: none;
	}

	a:hover:not(:active),
	a:focus {
		color: var(--primary);
		background-color: var(--secondary);
	}
</style>
