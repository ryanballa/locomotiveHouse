import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';
import type { Actions } from './$types';

export const actions = {
	deleteUser: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const id = form.get('id');

			if (!id) {
				return fail(400, { id, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}users/${id}/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					id: id
				})
			});
			const data = await response.json();
			return data;
		} catch (err) {
			return error(500, err);
		}
	}
} satisfies Actions;
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
