import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
	cookies.set('AuthorizationToken', '', {
		path: '/',
		maxAge: 0
	});
	redirect(302, '/');
}
