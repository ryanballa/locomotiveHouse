<script lang="ts">
	export let type = 'text';
	export let label;
	export let name;
</script>

<label for={name}
	>{label}
	<input {name} {type} />
</label>
