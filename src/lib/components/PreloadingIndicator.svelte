<script>
	// borrowed from svelte.dev site
	import { onMount } from 'svelte';

	let p = 0;
	let visible = false;

	onMount(() => {
		function next() {
			visible = true;
			p += 0.1;

			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 500 / remaining);
		}

		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="progress-container">
		<div class="progress" style="width: {p * 100}%" />
	</div>
{/if}

{#if p >= 0.4}
	<div class="fade" />
{/if}

<style>
	.progress-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--size-1);
		z-index: var(--layer-important);
	}

	.progress {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background-color: var(--loading);
		transition: width 0.4s;
	}

	.fade {
		--fade-color: var(--gray-0-hsl);
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: hsl(var(--fade-color) / 20%);
		pointer-events: none;
		z-index: calc(var(--layer-important) - 1);
		animation: fade 0.4s;
		top: 0;
		left: 0;
	}

	@media (prefers-color-scheme: dark) {
		.fade {
			--fade-color: var(--gray-9-hsl);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
