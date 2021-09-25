<script lang="ts">
	import { goto } from '$app/navigation';
	import Select from '$lib/components/form/Select.svelte';
	import { decades } from '$lib/years';

	export let selected: string | number;

	const options = ['Select a decade', ...decades.map((d) => d.text)];
	const values = ['', ...decades.map((d) => d.startYear)];
	const action = '/comic/random';
	let form: HTMLFormElement;

	function submit() {
		const formData = new FormData(form);
		goto(`${action}?decade=${formData.get('decade')}`, { keepfocus: true });
	}

	function handleEnter(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			submit();
		}
	}
</script>

<form bind:this={form} {action} on:submit|preventDefault={submit} on:keydown={handleEnter}>
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
