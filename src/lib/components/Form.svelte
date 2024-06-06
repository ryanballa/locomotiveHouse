<!-- Form.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import type { ValidatorFn, ValidatorResult } from '$lib/validators';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	export let action;
	export let method;

	export let form: {
		[inputName: string]: {
			validators: ValidatorFn[];
		};
	} = {};

	const dispatch = createEventDispatcher();
	let errors = writable({});

	function isFormValid(): boolean {
		return !Object.values($errors).some((field) =>
			Object.values(field).some((errorObject: ValidatorResult) => errorObject.error)
		);
	}

	function validateField(field, value) {
		form[field]?.validators &&
			form[field].validators.forEach((fn) => {
				const error = fn(value);
				errors.update((e) => {
					e[field] = { ...e[field], ...error };
					return e;
				});
			});
	}

	function validateForm(data: { [inputName: string]: any }): void {
		Object.keys(data).forEach((field) => validateField(field, data[field]));
	}

	function onSubmit(e) {
		const formData = new FormData(e.target);

		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(form?.unique);
		validateForm(data);

		return dispatch('submit', { valid: isFormValid(), data });
	}

	setContext('form', { errors });
</script>

<form on:submit|preventDefault={onSubmit} use:enhance {action} {method}>
	<slot />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 300px;
	}

	:global(form > div) {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	:global(form > div + *) {
		margin-top: 10px;
	}
</style>
