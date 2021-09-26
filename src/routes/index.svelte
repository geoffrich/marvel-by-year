<script context="module">
	export const prerender = true;
</script>

<script>
	import title from '$lib/stores/title';
	import { MIN_YEAR, MAX_YEAR } from '$lib/years';

	$title = 'Home';
</script>

<div class="container">
	<h1>Browse Marvel Unlimited by Year</h1>
	<p>
		This site allows you to see what issues are available on Marvel Unlimited for a given year. Tap
		the comic's cover to be taken directly to the comic in Marvel Unlimited or the web-based reader.
		You can also filter the available issues for a given year by series, creators, or events.
	</p>

	<ul>
		<li><a href="/year/{MIN_YEAR}">Start at the beginning</a></li>
		<li><a href="/year/{MAX_YEAR}">See what's current</a></li>
		<li><a href="/comic/random">Choose a comic for me</a></li>
		<li><a href="/year/1965?search=Daredevil%208">Stilts be praised</a></li>
	</ul>
</div>

<style>
	p {
		margin-bottom: 2rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
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
