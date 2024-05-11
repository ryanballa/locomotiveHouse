<script>
	import addresses from '$lib/assets/addresses.svg';
	import consists from '$lib/assets/consists.svg';
</script>

<section>
	<header>
		<h1>Club Locomotives Dashboard</h1>
	</header>
	<nav class="dashboard-nav">
		<ul>
			<li>
				<a href="/club/dcc/addresses/">
					<img alt="Addresses Logo" src={addresses} />
					<span>Addresses</span>
				</a>
			</li>
			<li>
				<a href="/club/dcc/consists/">
					<img alt="Consists Logo" src={consists} />
					<span>Consists</span>
				</a>
			</li>
		</ul>
	</nav>
</section>

<style lang="scss">
	@import 'src/lib/scss/_variables';
	.dashboard-nav {
		& ul {
			& li {
				list-style: none;
				align-items: center;
				justify-content: center;
				display: flex;
			}
			display: flex;
			justify-content: center;
		}

		& a:link,
		a:visited {
			align-items: center;
			border-radius: $border-radius;
			justify-content: center;
			flex-direction: column;
			border: 1px solid $border-color;
			color: $primary_color;
			display: flex;
			margin: var(--space-m);
			padding: var(--space-s);
			text-decoration: none;
		}

		& span {
			display: block;
			padding-top: var(--space-s);
		}
	}
</style>
