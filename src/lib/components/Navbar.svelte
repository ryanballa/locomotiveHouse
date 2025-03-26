<script>
	import { UserButton, SignedIn, SignedOut } from 'svelte-clerk';
</script>

<header>
	<div class="left_wrapper">
		<a class="fs1" id="primary_logo" href="/">Locomotive House</a>
		<nav aria-label="Primary navigation">
			<ul>
				<li><a href="/club/dcc/addresses">Addresses</a></li>
				<li><a href="/club/dcc/consists">Consists</a></li>
			</ul>
		</nav>
	</div>
	<nav aria-label="Account navigation">
		<ul>
			<li>
				<SignedIn>
					<UserButton afterSignOutUrl="/session/terminate" />
				</SignedIn>
				<SignedOut>
					<a href="/sign-in?redirectUrl=/admin/sync-user">Sign in</a> <span>or</span>
					<a href="/sign-up?redirectUrl=/admin/sync-user">Sign up</a>
				</SignedOut>
			</li>
		</ul>
	</nav>
</header>

<style lang="scss">
	.left_wrapper {
		display: flex;
		justify-content: space-between;
		margin-left: var(--space-m);
	}
	#primary_logo {
		align-items: center;
		justify-content: center;
		display: flex;
		font-weight: bold;
		vertical-align: middle;
	}

	header {
		background-color: #273238;
		color: #feffff;
		display: flex;
		justify-content: space-between;

		& nav {
			ul {
				display: flex;
			}
			li {
				list-style: none;
				padding: 0 var(--space-s);
			}
		}

		a:link,
		a:visited {
			color: #feffff;
			text-decoration: none;
		}
	}
</style>
