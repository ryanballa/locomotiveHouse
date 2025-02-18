<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();
</script>

<section>
	<header>
		<h2>Users</h2>
	</header>
	<ul>
		{#each data.users as user}
			<li>
				{user.firstName}
				{user.lastName} | <Button on:click={() => console.log('delete' + user.id)}>Delete</Button>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@import 'src/lib/scss/_variables';

	section {
		display: block;
	}
</style>
