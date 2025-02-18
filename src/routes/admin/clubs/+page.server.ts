import { createClerkClient } from '@clerk/clerk-sdk-node';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';
import type { Actions } from './$types';

export const actions = {
	add: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const name = form.get('name');

			if (!name) {
				return fail(400, { name, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}clubs/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					name: name
				})
			});
			const data = await response.json();
			return data;
		} catch (err) {
			return error(500, err);
		}
	},
	editClub: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const name = form.get('name');

			if (!name) {
				return fail(400, { name, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}clubs/${form.get('id')}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					name: name
				})
			});
			const data = await response.json();
			return data;
		} catch (err) {
			return error(500, err);
		}
	},
	assignUser: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const clubId = form.get('clubId');
			const userId = form.get('userId');

			if (!userId || userId === '') {
				return fail(400, { userId, missing: true });
			}

			if (!clubId || clubId === '') {
				return fail(400, { clubId, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}clubs/assignments/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					user_id: parseInt(userId, 10),
					club_id: parseInt(clubId, 10)
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

		const internalUsers = await fetch(`${API_ADDRESS}users/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});

		const clubAssociationsData = await clubAssociations.json();
		const internalUsersData = await internalUsers.json();
		const userData = await clerkClient.users.getUser(locals.session.userId);
		const usersData = await clerkClient.users.getUserList();
		const userDataJSON = JSON.parse(JSON.stringify(usersData)).data;
		const clubsData = await clubsResponse.json();

		if (clubsData.error && clubsData.error === 'Unauthorized') {
			redirect(302, '/login');
		}

		const usersByName = userDataJSON.map((item) => {
			return {
				firstName: item.firstName,
				lastName: item.lastName,
				token: item.id,
				id: internalUsersData.result.find((u) => u.token === item.id).id
			};
		});
		console.log(clubAssociations);
		return {
			auth,
			clubs: clubsData.result,
			clubAssociations: clubAssociationsData.result,
			user: {
				firstName: userData?.firstName,
				lastName: userData?.lastName
			},
			users: usersByName
		};
	} catch (err) {
		return error(500, err);
	}
}
