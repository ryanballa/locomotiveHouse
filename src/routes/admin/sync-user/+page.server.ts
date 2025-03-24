import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { API_ADDRESS } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	const { session } = locals;
	console.log(session);

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
		if (!internalUsersData.result.find((user) => user.token === userDataJSON[0].id)) {
			const response = await fetch(`${API_ADDRESS}users/${userDataJSON[0].id}/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				}
			});
			const data = await response.json();
			redirect(302, '/');
		} else {
			redirect(302, '/');
		}
	} catch (err) {
		return error(500, err);
	}
}
