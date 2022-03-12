<script lang="ts">
	export let oneColOnMobile = false;
</script>

<ul class="container" class:oneCol={oneColOnMobile}>
	<slot />
</ul>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.125rem, 1fr));
		justify-content: space-around;
		justify-items: center;

		gap: var(--size-3);
		padding: 0;
		list-style: none;
	}

	@media screen and (max-width: 449px) {
		.container.oneCol {
			grid-template-columns: 1fr;
			justify-content: initial;
			justify-items: initial;
		}
	}
</style>
