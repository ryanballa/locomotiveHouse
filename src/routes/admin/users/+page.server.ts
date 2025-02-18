import { createClerkClient } from '@clerk/clerk-sdk-node';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	try {
		const usersData = await clerkClient.users.getUserList();
		const userDataJSON = JSON.parse(JSON.stringify(usersData)).data;

		if (usersData.error && usersData.error === 'Unauthorized') {
			redirect(302, '/login');
		}

		const usersByName = userDataJSON.map((item) => {
			return {
				firstName: item.firstName,
				lastName: item.lastName,
				id: item.id
			};
		});

		return {
			auth,
			users: usersByName
		};
	} catch (err) {
		return error(500, err);
	}
}
