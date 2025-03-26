<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ClerkProvider } from 'svelte-clerk';
	import '$lib/scss/_main.scss';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	const { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
	<main class="container">
		<Navbar />
		<section class="layout_single_column">
			{@render children()}
		</section>
	</main>
	<Footer />
</ClerkProvider>

<style lang="scss">
	main {
		flex-grow: 1;
	}
	.layout_single_column {
		padding: var(--space-s);
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-around;
	}
</style>
