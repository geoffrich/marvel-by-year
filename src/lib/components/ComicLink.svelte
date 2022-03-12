<script lang="ts">
	export let id;
	export let title;
</script>

<a href="https://read.marvel.com/#/book/{id}">
	<slot />
	<span class="visually-hidden">Read {title} on Marvel Unlimited</span>
</a>

<style>
	a:focus {
		outline: var(--size-1) solid black; /* TODO: dark mode */
		outline-offset: var(--size-1);
		border-radius: var(--size-2);
	}

	a:focus:not(.focus-visible) {
		outline: none;
	}
</style>
