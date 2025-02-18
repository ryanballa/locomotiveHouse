<script lang="ts">
	let { label = '', name = '', options = [] } = $props();
</script>

<label for={name}
	><span>{label}</span>
	<select {name} id={name} class="dropdown-{name}">
		<option value="">--- Select ----</option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>

<style lang="scss">
	@import 'src/lib/scss/_variables';
</style>
