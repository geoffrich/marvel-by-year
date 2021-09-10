<script lang="ts">
	import type { Comic } from '$lib/types/marvel';
	import { default as dayjs } from 'dayjs';

	export let comic: Comic;

	$: onSaleDate = dayjs(comic.dates.find((d) => d.type === 'onsaleDate').date)
		.add(1, 'day') // TODO: days are off by one due to timezone issues, this is a hack
		.format('D MMM YYYY');

	$: detailUrl = comic.urls.find((u) => u.type === 'detail').url;

	$: creatorText = getCreatorText(comic.creators.items.map((c) => c.name));

	function getCreatorText(creators: string[]) {
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
		<img
			loading="lazy"
			src="{comic.thumbnail.path}.{comic.thumbnail.extension}"
			alt="{comic.title} cover"
		/>
	</a>
	<p><a href={detailUrl}>{comic.title}</a></p>
	<p>{onSaleDate}</p>
	<p>By {creatorText}</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.container > * {
		margin: 0;
	}
	img {
		width: 100%;
	}
</style>
