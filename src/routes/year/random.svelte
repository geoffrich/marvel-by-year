<script context="module">
	import { getRandomYear } from '$lib/years';
	export async function load() {
		return {
			status: 303,
			redirect: `/year/${getRandomYear()}`
		};
	}
</script>
