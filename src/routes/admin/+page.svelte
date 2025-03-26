<script lang="ts">
	import { SignedIn } from 'svelte-clerk';
</script>

<SignedIn let:user>
	<p>Welcome, {user?.fullName ?? 'buddy'}!</p>
	<p>You can view <a href="/admin/profile">your profile</a>.</p>
</SignedIn>

<style>
	p {
		margin: 0.5rem auto;
	}
</style>
