<script lang="ts">
	export let options = [];
	export let values = [];
	$: if (options.length > 0 && values.length == 0) {
		values = [...options];
	}
	export let value;
	export let id: string;
	export let name: string = '';
</script>

<label for={id}><slot /></label>
<select {name} {id} bind:value>
	{#each options as opt, idx (opt)}
		<option value={values[idx]}>{opt}</option>
	{/each}
</select>
