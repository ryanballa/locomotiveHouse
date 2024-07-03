import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
	const auth = cookies.get('AuthorizationToken');
	cookies.set('AuthorizationToken', '', {
		path: '/',
		maxAge: 0
	});
	redirect(302, '/');
}
