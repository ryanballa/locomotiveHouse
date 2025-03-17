<script lang="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div>
	<SignIn redirectUrl="/admin/sync-user" />
</div>
