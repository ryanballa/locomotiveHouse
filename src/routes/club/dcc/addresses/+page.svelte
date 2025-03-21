<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Form from '$lib/components/Form.svelte';
	import Input from '$lib/components/Input.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { Validators } from '$lib/validators';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let showAddAddressModal = $state(false);

	let { data, form } = $props();

	let actionModalIsShown = $state(false);
	let actionModalIsError = $state(false);
	let actionModalId = $state(0);
	let actionModalAddress = $state(0);
	let actionModalStatus = $state('');
	let actionModalIsWorking = $state(false);

	let formValidators = {
		address: {
			validators: [Validators.required]
		},
		user_id: {
			validators: [Validators.required]
		}
	};

	async function handleActivation({ id, address, status }) {
		actionModalIsWorking = true;
		const response = await fetch('/club/dcc/addresses?/activation', {
			method: 'POST',
			body: JSON.stringify({
				id,
				address,
				in_use: status === 'deactivate' ? false : true
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			actionModalIsWorking = false;
			actionModalIsShown = false;
			actionModalIsShown = actionModalIsShown;
			await invalidateAll();
		}
		if (result.type === 'error' || result.type === 'failure') {
			actionModalIsError = true;
		}
		applyAction(result);
	}

	function toggleButton({ id, address, status }) {
		actionModalStatus = status === 'active' ? 'deactivate' : 'activate';
		actionModalIsShown = true;
		actionModalIsError = false;
		actionModalIsWorking = false;
		actionModalId = id;
		actionModalAddress = address;
	}

	function onSubmit(e) {
		if (e?.detail?.valid) {
			showAddAddressModal = false;
		} else {
			console.log('Invalid Form');
		}
	}
</script>

<section class="content">
	<Dialog header="Add Address" bind:showModal={showAddAddressModal}>
		<Form
			id="addAddress"
			{formValidators}
			on:submit={onSubmit}
			action="/club/dcc/addresses?/add"
			method="POST"
		>
			<div>
				<Input label="Address" name="address" />
				<ErrorMessage fieldName="address" errorKey="required" message="Address is required" />
				{#if form?.uniqueAddress === false}<ErrorMessage
						fieldName="address"
						errorKey="unique"
						message="Address is already in use"
					/>{/if}
			</div>
			<div>
				<Input label="Description" name="description" />
			</div>
			<div class="staticField">
				<strong>Owner</strong>
				<div class="fieldValue">{data.user.firstName}</div>
				<Input type="hidden" name="user_id" value={data.user.id} />
			</div>
			<div>
				<Input label="Add" type="submit" />
			</div>
		</Form>
	</Dialog>
	<Dialog header="Are you sure?" bind:showModal={actionModalIsShown}>
		{#if actionModalIsError}<p class="error">
				{actionModalAddress} is already active by another member.
			</p>
		{:else}
			<p>This is will {actionModalStatus} address {actionModalAddress}</p>
			<Button
				working={actionModalIsWorking}
				on:click={() =>
					handleActivation({
						id: actionModalId,
						address: actionModalAddress,
						status: actionModalStatus
					})}>Continue</Button
			>
		{/if}
	</Dialog>
	<header>
		<h1>Addresses</h1>
		<div class="addButtonWrapper">
			<Button on:click={() => (showAddAddressModal = true)}>Add New</Button>
		</div>
	</header>
	{#await data.addresses}
		Loading addreses...
	{:then addresses}
		<table>
			<thead>
				<tr>
					<th scope="col">Number</th>
					<th scope="col">In Use</th>
					<th scope="col">Last Used By</th>
					<th scope="col">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each addresses as address, index}
					<tr>
						<th scope="row">{address.number}</th>
						<td><span class={`in-use-flag ${address.in_use}`}>{address.in_use}</span></td>
						<td>{address.user_id}</td>
						<td>
							<Button
								on:click={() =>
									toggleButton({
										id: address.id,
										address: address.number,
										status: address.in_use ? 'active' : 'inactive'
									})}
								type={address.in_use ? 'warning' : 'positive'}
								>{#if address.in_use}Deactivate{:else}Activate{/if}</Button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/await}
</section>

<style lang="scss">
	@import 'src/lib/scss/_variables';
	.error {
		color: $error;
	}
	.addButtonWrapper {
		margin-bottom: var(--space-m);
	}
	.staticField {
		display: flex;
		flex-direction: column;
	}
	header {
		text-align: center;
	}
	table {
		border-collapse: collapse;
		border: none;
		border-width: 0;
		background-color: $table-background-color;
		& thead {
			background-color: $table-header-background;
			border: none;
			border-bottom: 1px solid $table-border-color;
			color: $table-header-color;
			font-weight: bold;
		}
		& td {
			border-bottom: 1px solid $table-border-color;
			padding: var(--space-m);
		}
		& tr {
			border: none;
		}
		& .in-use-flag {
			background-color: $stale;
			display: block;
			text-indent: -9000px;
			overflow: hidden;
			height: 20px;
			width: 20px;
			border-radius: 20px;

			&.true {
				background-color: $success;
			}
		}
	}
</style>
