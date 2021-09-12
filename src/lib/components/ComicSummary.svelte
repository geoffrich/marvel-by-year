<script lang="ts">
	import type { Comic } from '$lib/types/marvel';
	import { default as dayjs } from 'dayjs';
	import { getComicDate } from '$lib/comics';

	// TODO: bring up more details on separate page

	export let comic: Comic;
	export let lazyLoad = true;

	// documented at https://developer.marvel.com/documentation/images
	enum ImageSize {
		Small = 'portrait_small', // 50x75
		Medium = 'portrait_medium', // 100x150
		Large = 'portrait_xlarge', // 150x225
		XLarge = 'portrait_fantastic', // 168x252
		XXLarge = 'portrait_incredible', // 216x324
		XXXLarge = 'portrait_uncanny' // 300x450
	}

	$: onSaleDate = dayjs(getComicDate(comic))
		.add(1, 'day') // TODO: days are off by one due to timezone issues, this is a hack
		.format('D MMM YYYY');

	$: detailUrl = comic.urls.find((u) => u.type === 'detail').url;

	$: creatorText = getCreatorText(comic.creators.items.map((c) => c.name));

	function getImageSrc(comic: Comic, size: ImageSize) {
		return `${comic.thumbnail.path.replace('http:', 'https:')}/${size}.${
			comic.thumbnail.extension
		}`;
	}

	function getCreatorText(creators: string[]) {
		if (creators.length === 0) {
			return 'Unknown';
		}
		if (creators.length === 1) {
			return creators[0];
		}
		if (creators.length <= 3) {
			return commaSeparate(creators);
		} else {
			const additionalCount = creators.length - 3;
			const subset = creators.slice(0, 3);
			subset.push(`${additionalCount} others`);
			return commaSeparate(subset);
		}
	}

	function commaSeparate(arr: string[]) {
		const last = arr.pop();
		return arr.join(', ') + ' and ' + last;
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
	<p><a href={detailUrl}>{comic.title}</a></p>
	<p>{onSaleDate}</p>
	<!-- TODO: click to expand? -->
	<p>By {creatorText}</p>
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
</style>
