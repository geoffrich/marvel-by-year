<script lang="ts">
	import Select from '$lib/components/form/Select.svelte';
	import { decades } from '$lib/years';

	const options = ['Select a decade', ...decades.map((d) => d.text)];
	const values = ['', ...decades.map((d) => d.startYear)];
	export let selected: string | number;
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
