<script>
	import Navbar from '$lib/components/admin/Navbar.svelte';
</script>

<main class="container">
	<Navbar />
	<section class="layout_single_column">
		<slot />
	</section>
</main>
