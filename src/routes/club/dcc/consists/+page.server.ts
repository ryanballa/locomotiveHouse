import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

function sortByNumber({ data }) {
	return data.sort((a: { number: number }, b: { number: number }) => a.number - b.number);
}

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	try {
		const response = await fetch(`${API_ADDRESS}consists/`, {
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
			consists: sortByNumber({ data: data?.result }),
			user: {
				firstName: userData?.firstName,
				lastName: userData?.lastName,
				id: response.headers.get('x-user-id')
			}
		};
	} catch (err) {
		return error(500, err);
	}
}

export const actions = {
	add: async ({ request, cookies, locals }) => {
		console.log(locals);
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const number = form.get('number');
			const user_id = form.get('user_id');

			if (!number) {
				return fail(400, { number, missing: true });
			}

			if (!user_id) {
				return fail(400, { user_id, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}consists/`, {
				method: 'POST',
				headers: {
					'X-User-Id': 1,
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					number,
					in_use: true,
					user_id
				})
			});
			const data = await response.json();
			if (data.error) {
				return fail(400, { number, uniqueNumber: false });
			}
			return data;
		} catch (err) {
			return error(500, err);
		}
	},
	delete: async ({ request, cookies }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const data = await request.json();
			const apiRequest = await fetch(`${API_ADDRESS}consists/${data.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				}
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
