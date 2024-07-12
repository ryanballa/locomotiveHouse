import { createClerkClient } from '@clerk/clerk-sdk-node';
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
			const number = form.get('number');
			const owner = form.get('owner');

			if (!number) {
				return fail(400, { number, missing: true });
			}

			if (!owner) {
				return fail(400, { owner, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}consists/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					number,
					in_use: true,
					owner
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
