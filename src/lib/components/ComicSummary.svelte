<script lang="ts">
	import type { Comic } from '$lib/types/marvel';
	import { default as dayjs } from 'dayjs';

	export let comic: Comic;

	$: onSaleDate = dayjs(comic.dates.find((d) => d.type === 'onsaleDate').date)
		.add(1, 'day') // TODO: days are off by one due to timezone issues, this is a hack
		.format('D MMM YYYY');
</script>

<img
	loading="lazy"
	src="{comic.thumbnail.path}.{comic.thumbnail.extension}"
	alt="{comic.title} cover"
/>
<p>{comic.title}</p>
<p>{onSaleDate}</p>

<style>
	img {
		width: 100%;
	}
</style>
