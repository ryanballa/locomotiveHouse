import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	try {
		const clubsResponse = await fetch(`${API_ADDRESS}clubs/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});

		const clubAssociations = await fetch(`${API_ADDRESS}clubs/assignments/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});
		const clubAssociationsData = await clubAssociations.json();
		const userData = await clerkClient.users.getUser(locals.session.userId);
		const clubsData = await clubsResponse.json();

		if (clubsData.error && clubsData.error === 'Unauthorized') {
			redirect(302, '/login');
		}

		return {
			auth,
			clubs: clubsData.result,
			clubAssociations: clubAssociationsData.result,
			user: {
				firstName: userData?.firstName,
				lastName: userData?.lastName
			}
		};
	} catch (err) {
		return error(500, err);
	}
}
