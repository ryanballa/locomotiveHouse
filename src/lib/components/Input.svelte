<script lang="ts">
	let { type = 'text', label = '', name = '', value = '' } = $props();
</script>

{#if type === 'submit'}
	<input type="submit" value={label} />
{:else if type === 'hidden'}
	<input type="hidden" {name} {value} />
{:else}
	<label for={name}
		><span>{label}</span>
		<input {name} {type} {value} />
	</label>
{/if}

<style lang="scss">
	@import 'src/lib/scss/_variables';
	label {
		display: flex;
		font-weight: bold;
		flex-flow: column;
		width: 100%;
	}
	input {
		border: 2px solid $border-color;
		border-radius: $border-radius;
		padding: var(--space-xs);
		font-size: var(--step--1);

		&[type='submit'] {
			background-color: $btn-regular;
			color: $btn-color;
			border: none;
		}

		&[type='submit']:hover {
			cursor: pointer;
		}
	}
</style>
