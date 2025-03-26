<script lang="ts">
	import { SignIn } from 'svelte-clerk';
</script>

<div>
	<SignIn redirectUrl="/admin/sync-user" />
</div>
