<script>
	import '$lib/scss/_main.scss';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<main class="container">
	<Navbar />
	<section class="layout_single_column">
		<slot />
	</section>
	<Footer />
</main>

<style lang="scss">
	.layout_single_column {
		padding: var(--space-s);
		display: flex;
		justify-content: center;
	}
</style>
