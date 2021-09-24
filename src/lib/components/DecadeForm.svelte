<script lang="ts">
	import Select from '$lib/components/form/Select.svelte';
	import { decades } from '$lib/years';

	const options = ['Select a decade', ...decades];
	const values = ['', ...decades.map(mapDecade)];
	export let selected: string | number;

	function mapDecade(decade: string): number {
		if (decade.includes('pre')) {
			return 1940;
		} else {
			return parseInt(decade.slice(0, 4));
		}
	}
</script>

<!-- TODO: submit client-side if JS available -->
<form action="/comic/random">
	<div>
		<Select {options} {values} id="decade" name="decade" value={selected ? selected : ''}
			>Decade</Select
		>
	</div>
	<button>Submit</button>
</form>

<style>
	form {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
</style>
