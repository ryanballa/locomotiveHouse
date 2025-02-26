<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Input from '$lib/components/Input.svelte';
	import Form from '$lib/components/Form.svelte';

	let { data } = $props();

	let showConfirmDeleteUserModal = $state(false);
	let activeUser = $state(null);

	function onDeleteUserSubmit(e) {
		if (e?.detail?.valid) {
			showConfirmDeleteUserModal = false;
		} else {
			console.log('Invalid Form');
		}
	}
</script>

<section>
	<Dialog header="Delete User" bind:showModal={showConfirmDeleteUserModal}>
		<Form
			id="deleteUser"
			on:submit={onDeleteUserSubmit}
			action="/admin/users?/deleteUser"
			method="POST"
		>
			<Input type="hidden" name="id" value={activeUser} />
			<div>
				<Input label="Delete" type="submit" />
			</div>
		</Form>
	</Dialog>
	<header>
		<h2>Users</h2>
	</header>
	<ul>
		{#each data.users as user}
			<li>
				{user.firstName}
				{user.lastName} | <Button
					on:click={() => {
						showConfirmDeleteUserModal = true;
						activeUser = user.id;
					}}>Delete</Button
				>
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
