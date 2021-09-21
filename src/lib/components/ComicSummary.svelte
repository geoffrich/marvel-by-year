<script lang="ts">
	import type { Comic } from '$lib/types';
	import { getOnSaleDate, getUnlimitedDate } from '$lib/comics';

	import { Plus, Minus } from '$lib/icons';
	import IconButton from '$lib/components/IconButton.svelte';

	export let comic: Comic;
	export let lazyLoad = true;
	export let showUnlimitedDate = false;

	let showAllCreators = false;

	const MAX_CREATORS = 3;

	// documented at https://developer.marvel.com/documentation/images
	enum ImageSize {
		Small = 'portrait_small', // 50x75
		Medium = 'portrait_medium', // 100x150
		Large = 'portrait_xlarge', // 150x225
		XLarge = 'portrait_fantastic', // 168x252
		XXLarge = 'portrait_incredible', // 216x324
		XXXLarge = 'portrait_uncanny' // 300x450
	}

	$: onSaleDate = getOnSaleDate(comic).format('D MMM YYYY');
	$: unlimitedDate = getUnlimitedDate(comic).format('D MMM YYYY');

	$: creatorCount = comic.creators.length;
	$: creatorText = getCreatorText(
		comic.creators.map((c) => c.name),
		showAllCreators ? creatorCount : MAX_CREATORS
	);

	function getImageSrc(comic: Comic, size: ImageSize) {
		return `${comic.cover.path.replace('http:', 'https:')}/${size}.${comic.cover.ext}`;
	}

	function getCreatorText(creators: string[], max: number) {
		if (creators.length === 0) {
			return 'Unknown';
		}
		if (creators.length === 1) {
			return creators[0];
		}
		if (creators.length <= max) {
			return commaSeparate(creators);
		} else {
			const additionalCount = creators.length - max;
			const subset = creators.slice(0, max);
			subset.push(`${additionalCount} others`);
			return commaSeparate(subset);
		}
	}

	function commaSeparate(arr: string[]) {
		const last = arr.pop();
		return arr.join(', ') + ' and ' + last;
	}

	function toggleCreators() {
		showAllCreators = !showAllCreators;
	}
</script>

<div class="container">
	<a href="https://read.marvel.com/#/book/{comic.digitalId}">
		<picture>
			<source srcset={getImageSrc(comic, ImageSize.XXLarge)} media="(min-width: 450px)" />
			<img
				loading={lazyLoad ? 'lazy' : undefined}
				src={getImageSrc(comic, ImageSize.Large)}
				alt="{comic.title} cover"
			/>
		</picture>
		<span class="visually-hidden">Read {comic.title} on Marvel Unlimited</span>
	</a>
	<p><a href={comic.detailUrl}>{comic.title}</a></p>
	<div>
		<p>
			{onSaleDate}
		</p>
		{#if showUnlimitedDate}<p>MU: {unlimitedDate}</p>{/if}
	</div>
	<p>
		<span>By {creatorText}</span>
		{#if creatorCount > MAX_CREATORS}
			{#if showAllCreators}
				<IconButton altText="Show less" on:click={toggleCreators}>
					<Minus />
				</IconButton>
			{:else}
				<IconButton altText="Show more" on:click={toggleCreators}>
					<Plus />
				</IconButton>
			{/if}
		{/if}
	</p>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 100px 1fr;
		grid-template-rows: repeat(3, auto);
		gap: 0.5rem;
	}

	/* There might be a more elegant way, but this number was chosen to line up with the grid sizing */
	@media screen and (min-width: 450px) {
		.container {
			display: flex;
			flex-direction: column;
		}
	}

	.container > * {
		margin: 0;
	}
	img {
		width: 100%;
	}

	a {
		grid-row: 1 / -1;
	}

	p {
		margin: 0;
	}
</style>
