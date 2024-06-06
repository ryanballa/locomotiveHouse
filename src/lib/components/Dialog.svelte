<script>
	import close from '$lib/assets/close.svg';

	let { header, showModal = $bindable() } = $props();

	let dialog = $state();

	$effect(() => {
		if (dialog && showModal) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		showModal = false;
	}}
	on:click|self={() => dialog.close()}
>
	<header>
		<h2>{header}</h2>
		<button on:click|self={() => dialog.close()}
			><img on:click|self={() => dialog.close()} src={close} alt="Close" /></button
		>
	</header>
	<section>
		<slot />
	</section>
</dialog>

<style lang="scss">
	dialog {
		& button {
			background: none;
			border: none;

			&:focus {
				outline: none;
			}
			&:hover {
				cursor: pointer;
			}
		}
		& header {
			display: flex;
			justify-content: space-between;
		}
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
