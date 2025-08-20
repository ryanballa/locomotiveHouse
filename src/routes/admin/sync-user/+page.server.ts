import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { API_ADDRESS } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');

	try {
		const usersData = await clerkClient.users.getUserList();
		const userDataJSON = JSON.parse(JSON.stringify(usersData)).data;
		const internalUsers = await fetch(`${API_ADDRESS}users/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});
		const internalUsersData = await internalUsers.json();
		console.log('internalUsersData:', internalUsersData);
		if (
			!internalUsersData?.result?.find((user) => user.token === userDataJSON[0].id) ||
			!internalUsersData
		) {
			const response = await fetch(`${API_ADDRESS}users/${userDataJSON[0].id}/`, {
				method: 'POST',
				headers: {
					'X-User-Id': locals.lhUserId,
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					token: userDataJSON[0].id,
					permission_id: 2 // Regular
				})
			});
			const data = await response.json();
		}
	} catch (err) {
		return error(500, err);
	}
	throw redirect(302, '/');
}
