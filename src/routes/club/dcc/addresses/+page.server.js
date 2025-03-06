import { createClerkClient } from '@clerk/clerk-sdk-node';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	try {
		const response = await fetch(`${API_ADDRESS}addresses/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});
		const userData = await clerkClient.users.getUser(locals.session.userId);
		const data = await response.json();

		if (data.error && data.error === 'Unauthorized') {
			redirect(302, '/login');
		}
		return {
			auth,
			addresses: data.result,
			user: {
				firstName: userData?.firstName,
				lastName: userData?.lastName
			}
		};
	} catch (err) {
		return error(500, err);
	}
}

export const actions = {
	add: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const address = form.get('address');
			const description = form.get('description');
			const user_id = form.get('user_id');

			if (!address) {
				return fail(400, { address, missing: true });
			}

			if (!user_id) {
				return fail(400, { user_id, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}addresses/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					number: address,
					description,
					in_use: true,
					user_id
				})
			});
			const data = await response.json();
			if (data.error) {
				return fail(400, { address, uniqueAddress: false });
			}
			return data;
		} catch (err) {
			return error(500, err);
		}
	},
	activation: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const data = await request.json();
			const apiRequest = await fetch(`${API_ADDRESS}addresses/${data.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					number: data.address,
					in_use: data.in_use
				})
			});
			const apiResponse = await apiRequest.json();
			if (apiResponse.error) {
				return fail(400, { data, unique: false });
			}
			return apiResponse;
		} catch (err) {
			console.log(err);
			return error(500, err);
		}
	}
};
