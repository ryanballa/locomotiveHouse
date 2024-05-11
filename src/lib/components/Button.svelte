<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type = 'regular';

	function handleClick() {
		dispatch('click');
	}
</script>

<button on:click={handleClick} class={type}><slot /></button>

<style lang="scss">
	@import 'src/lib/scss/_variables';

	button {
		border: none;
		border-radius: 10px;
		color: $btn-color;
		font-weight: bold;
		padding: var(--space-s) var(--space-xs);
		font-size: var(--step--1);
		&:hover {
			cursor: pointer;
		}
		&.regular {
			background-color: $btn-regular;
		}
		&.warning {
			background-color: $btn-warning;
		}
		&.positive {
			background-color: $btn-positive;
		}
	}
</style>
