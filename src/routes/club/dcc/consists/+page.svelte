<script>
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';

	let showModal = false;
	let action = '';
	let actionConsistNum = 0;

	function toggleButton({ num, status }) {
		showModal = true;
		actionConsistNum = num;
		action = status === 'active' ? 'deactivate' : 'activate';
	}
</script>

<section class="content">
	<Dialog header="Are you sure?" bind:showModal>
		<p>This is will {action} consist {actionConsistNum}</p>
	</Dialog>
	<header>
		<h1>Consists</h1>
	</header>
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
			<tr>
				<th scope="row">1</th>
				<td><span class="in-use-flag true">true</span></td>
				<td>Bob</td>
				<td>
					<Button on:click={() => toggleButton({ num: 1, status: 'active' })} type="warning"
						>Deactivate</Button
					>
				</td>
			</tr>
			<tr>
				<th scope="row">127</th>
				<td><span class="in-use-flag true">true</span></td>
				<td>Ryan</td>
				<td
					><Button on:click={() => toggleButton({ num: 127, status: 'active' })} type="warning"
						>Deactivate</Button
					></td
				>
			</tr>
			<tr>
				<th scope="row">126</th>
				<td><span class="in-use-flag false">false</span></td>
				<td>Scott</td>
				<td
					><Button on:click={() => toggleButton({ num: 126, status: 'inactive' })} type="positive"
						>Activate</Button
					></td
				>
			</tr>
		</tbody>
	</table>
</section>

<style lang="scss">
	@import 'src/lib/scss/_variables';
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
