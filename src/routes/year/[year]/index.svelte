<script context="module">
	export async function load({ page }) {
		return {
			redirect: `/year/${page.params.year}/0`,
			status: 301
		};
	}
</script>
