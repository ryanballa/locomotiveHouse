<script>
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Form from '$lib/components/Form.svelte';
	import Input from '$lib/components/Input.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { Validators } from '$lib/validators';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();
	console.log(data.consists);

	let showAddConsistModal = $state(false);
	let actionModalIsShown = $state(false);
	let actionModalIsError = $state(false);
	let actionModalId = $state(0);
	let actionModalNumber = $state(0);
	let actionModalIsWorking = $state(false);

	async function handleDeletion({ id }) {
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
		let lastNumber = 0;
		for (let i = 0; i < data.length; i++) {
			const currentNumber = data[i].number;
			if (currentNumber === lastNumber + 1) {
				lastNumber = currentNumber;
			}
			if (currentNumber > lastNumber + 1) {
				lastNumber = lastNumber + 1;
			}
			if (data[i].number === 127) {
				//Invalid number used to trigger error in UI
				lastNumber = 999;
				break;
			}
		}
		return lastNumber;
	}

	function deleteConsist({ id, number }) {
		actionModalId = id;
		actionModalIsShown = true;
		actionModalNumber = number;
	}

	let formValidators = {
		number: {
			validators: [Validators.required]
		},
		owner: {
			validators: [Validators.required]
		}
	};
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
				<div>
					<Input label="Owner" name="owner" />
					<ErrorMessage fieldName="owner" errorKey="required" message="Owner is required" />
				</div>
				<div>
					<Input label="Add" type="submit" />
				</div>
			</Form>
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
						<td>{consist.owner}</td>
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
		font-size: var(--step--1);
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
