<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Form from '$lib/components/Form.svelte';
	import Input from '$lib/components/Input.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { Validators } from '$lib/validators';

	let showAddClubModal = $state(false);
	let showEditClubModal = $state(false);
	let showAssignUserModal = $state(false);
	let selectedClubId = $state(null);

	let { data } = $props();

	// const usersPerClub = data?.clubs?.map((club) => {
	// 	const members = data.clubAssociations?.filter((ca) => ca.clubId === club.id);
	// 	const augmentedMembers = data?.users?.map((u) => {
	// 		members?.find((m) => m.token === u.id);
	// 	});

	// 	return {
	// 		...club,
	// 		augmentedMembers
	// 	};
	// });

	let addClubFormValidators = {
		name: {
			validators: [Validators.required]
		}
	};

	let editClubFormValidators = {
		name: {
			validators: [Validators.required]
		}
	};

	let assignUserformValidators = {
		userId: {
			validators: [Validators.required]
		},
		clubId: {
			validators: [Validators.required]
		}
	};

	function onClubSubmit(e) {
		if (e?.detail?.valid) {
			showAddClubModal = false;
		} else {
			console.log('Invalid Form');
		}
	}

	function onClubEditSubmit(e) {
		if (e?.detail?.valid) {
			showEditClubModal = false;
		} else {
			console.log('Invalid Form');
		}
	}

	function onAssignUserSubmit(e) {
		if (e?.detail?.valid) {
			showAssignUserModal = false;
		} else {
			console.log('Invalid Form');
		}
	}
</script>

<section>
	<Dialog header="Add Club" bind:showModal={showAddClubModal}>
		<Form
			id="addClub"
			{addClubFormValidators}
			on:submit={onClubSubmit}
			action="/admin/clubs?/add"
			method="POST"
		>
			<div>
				<Input label="Name" name="name" />
				<ErrorMessage fieldName="name" errorKey="required" message="Name is required" />
			</div>
			<div>
				<Input label="Add" type="submit" />
			</div>
		</Form>
	</Dialog>
	<Dialog header="Edit Club" bind:showModal={showEditClubModal}>
		<Form
			id="editClub"
			{editClubFormValidators}
			on:submit={onClubEditSubmit}
			action="/admin/clubs?/editClub"
			method="POST"
		>
			<div>
				<Input type="hidden" name="id" value={selectedClubId} />
				<Input
					label="Name"
					name="name"
					value={data.clubs.find((c) => c.id === selectedClubId)?.name}
				/>
				<ErrorMessage fieldName="name" errorKey="required" message="Name is required" />
			</div>
			<div>
				<Input label="Edit" type="submit" />
			</div>
		</Form>
	</Dialog>
	<Dialog header="Assign User" bind:showModal={showAssignUserModal}>
		<Form
			id="assignUser"
			{assignUserformValidators}
			on:submit={onAssignUserSubmit}
			action="/admin/clubs?/assignUser"
			method="POST"
		>
			<div>
				<Dropdown
					label="User"
					name="userId"
					options={data.usersByName.map((u) => ({
						label: `${u.firstName} ${u.lastName}`,
						value: u.id
					}))}
				/>
				<ErrorMessage fieldName="userId" errorKey="required" message="User is required" />
			</div>
			<div>
				<Input type="hidden" name="clubId" value={selectedClubId} />
			</div>
			<div>
				<Input label="Assign" type="submit" />
			</div>
		</Form>
	</Dialog>
	<header>
		<h2>Clubs</h2>
	</header>
	<p>Add or remove clubs and user assignments.</p>
	<Button on:click={() => (showAddClubModal = true)}>Add Club</Button>
	<ul>
		{#if (data.clubs && data.clubs.length === 0) || !data.clubs}
			<li>No clubs</li>
		{/if}
		{#if data.clubs && data.clubs.length > 0}
			{#each data.clubs as club}
				<li>
					<h3>
						{club.name}
						<button
							onclick={() => {
								showEditClubModal = true;
								selectedClubId = club.id;
							}}>Edit</button
						>
					</h3>
					<h4>Members</h4>
					<ul>
						{#each data.clubAssociations as association}
							{#if association.club_id === club.id && data.usersByName[0]}
								<li>
									{data.usersByName.find((u) => u.id === association.user_id).firstName}
									{data.usersByName.find((u) => u.id === association.user_id).lastName}
								</li>
							{/if}
						{/each}
						<li>
							<Button
								on:click={() => {
									selectedClubId = club.id;
									showAssignUserModal = true;
								}}>Assign User</Button
							>
						</li>
					</ul>
				</li>
			{/each}
		{/if}
	</ul>
</section>

<style lang="scss">
	@import 'src/lib/scss/_variables';

	section {
		display: block;
	}
</style>
