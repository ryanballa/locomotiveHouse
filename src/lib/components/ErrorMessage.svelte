<script>
	import { getContext } from 'svelte';
	const { errors } = getContext('form');
	export let message;
	export let fieldName;
	export let errorKey;
</script>

{#if $errors?.[fieldName]?.[errorKey]?.error}
	<p class="error-message">{message || $errors[fieldName][errorKey].message}</p>
{/if}

<style lang="scss">
	@import 'src/lib/scss/_variables';
	p {
		color: $error;
	}
</style>
