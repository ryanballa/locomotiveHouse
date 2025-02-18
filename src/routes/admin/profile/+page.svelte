<script lang="ts">
	import UserProfile from 'clerk-sveltekit/client/UserProfile.svelte';

	let { data } = $props();

	console.log(data.clubAssociations);
	console.log(data.user);
</script>

<section>
	<header>
		<h2>Membership</h2>
	</header>
	<p>You are part of the following clubs:</p>
	<ul>
		{#each data.clubs as club}
			<li>{club.name}</li>
		{/each}
	</ul>
</section>
<section><UserProfile /></section>

<style lang="scss">
	@import 'src/lib/scss/_variables';

	section {
		display: block;
	}
</style>
