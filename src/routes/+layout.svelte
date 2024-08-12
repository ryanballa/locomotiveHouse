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
</main>
<Footer />

<style lang="scss">
	main {
		flex-grow: 1;
	}
	.layout_single_column {
		padding: var(--space-s);
		display: flex;
		justify-content: center;
	}
</style>
