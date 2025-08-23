import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { API_ADDRESS } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';

export async function load({ cookies }) {
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
		if (
			!internalUsersData?.result?.find((user) => user.token === userDataJSON[0].id) ||
			!internalUsersData
		) {
			const response = await fetch(`${API_ADDRESS}users/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					token: userDataJSON[0].id,
					permission: 2 // Regular
				})
			});
			const lhUserData = await response.json();
			await clerkClient.users.updateUserMetadata(userDataJSON[0].id, {
				privateMetadata: {
					lhUserId: lhUserData.id
				}
			});
		}
	} catch (err) {
		return error(500, err);
	}
	throw redirect(302, '/');
}
