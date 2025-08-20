<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Form from '$lib/components/Form.svelte';
	import Input from '$lib/components/Input.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { Validators } from '$lib/validators';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	interface DeletionArgs {
		id: number;
		number?: number;
	}

	let { data, form } = $props();

	let showAddConsistModal = $state(false);
	let actionModalIsShown = $state(false);
	let actionModalIsError = $state(false);
	let actionModalId = $state(0);
	let actionModalNumber = $state(0);
	let actionModalIsWorking = $state(false);

	async function handleDeletion({ id }: DeletionArgs) {
		actionModalIsWorking = true;
		const response = await fetch('/club/dcc/consists?/delete', {
			method: 'POST',
			body: JSON.stringify({
				id
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
	function onSubmit(e) {
		if (e?.detail?.valid) {
			showAddConsistModal = false;
		} else {
			console.log('Invalid Form');
		}
	}

	function getFirstUsableNumber({ data }) {
		if (!data || !data.length) {
			return 1;
		}

		const usedNumbers = new Set(data.map((item) => item.number));

		// Find first unused number starting from 1
		for (let i = 1; i <= 127; i++) {
			if (!usedNumbers.has(i)) {
				return i;
			}
		}

		return null; // All numbers 1-127 are used
	}

	function deleteConsist({ id, number }: DeletionArgs) {
		actionModalId = id;
		actionModalIsShown = true;
		actionModalNumber = number;
	}

	let formValidators = {};
</script>

<section class="content">
	<header>
		<h1>Consists</h1>
		<div class="addButtonWrapper">
			<Button on:click={() => (showAddConsistModal = true)}>Add New</Button>
		</div>
	</header>
	{#await data.consists}
		Loading consists...
	{:then consists}
		<Dialog header="Add Consist" bind:showModal={showAddConsistModal}>
			{#if getFirstUsableNumber({ data: consists }) && data.user.id}
				<Form
					id="addConsist"
					{formValidators}
					on:submit={onSubmit}
					action="/club/dcc/consists?/add"
					method="POST"
				>
					<div class="staticDisplay">
						<span class="labelLike">Number</span>
						<span class="valueLike">{getFirstUsableNumber({ data: consists })}</span>
						<Input type="hidden" name="number" value={getFirstUsableNumber({ data: consists })} />
					</div>
					<div class="staticDisplay">
						<span class="labelLike">Owner</span>
						<span class="valueLike">{data.user.firstName}</span>
					</div>
					<div>
						<Input label="Add" type="submit" />
					</div>
				</Form>
			{:else}
				<p>No available numbers or user information not loaded.</p>
			{/if}
		</Dialog>
		<Dialog header="Are you sure?" bind:showModal={actionModalIsShown}>
			<p>This is will delete consist {actionModalNumber}</p>
			<Button
				working={actionModalIsWorking}
				on:click={() =>
					handleDeletion({
						id: actionModalId
					})}>Delete</Button
			>
		</Dialog>
		<table>
			<thead>
				<tr>
					<th scope="col">Number</th>
					<th scope="col">In Use By</th>
					<th scope="col">Delete</th>
				</tr>
			</thead>
			<tbody>
				{#each consists as consist, index}
					<tr>
						<th scope="row">{consist.number}</th>
						<td>{consist.user_id}</td>
						<td>
							<Button
								on:click={() => deleteConsist({ number: consist.number, id: consist.id })}
								type="warning">Delete</Button
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
	header {
		text-align: center;
	}
	.staticDisplay {
		display: flex;
		flex-direction: column;
	}
	.labelLike {
		font-size: var(--step--0);
		font-weight: bold;
	}
	.addButtonWrapper {
		margin-bottom: var(--space-m);
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
