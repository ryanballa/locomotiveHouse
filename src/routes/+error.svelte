<script>
	import { page } from '$app/stores';
</script>

<section>
	<header>
		<h1>Error {$page.status}</h1>
	</header>
	<p>
		We are sorry, an internal error has occurred. Here are some details you can supply us: {$page
			.error.message}
	</p>
</section>
