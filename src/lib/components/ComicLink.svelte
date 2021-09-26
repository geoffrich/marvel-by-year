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
		outline: 0.25rem solid black;
		outline-offset: 0.25rem;
		border-radius: 0.5rem;
	}

	a:focus:not(.focus-visible) {
		outline: none;
	}
</style>
