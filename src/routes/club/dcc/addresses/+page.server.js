import { createClerkClient } from '@clerk/backend';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ cookies, locals }) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	const auth = cookies.get('AuthorizationToken');
	if (!auth) {
		redirect(302, '/sign-in');
	}
	try {
		const response = await fetch(`${API_ADDRESS}addresses/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});

		//TODO: Write a function that finds the user name from the assignment

		const clubAssignments = await fetch(`${API_ADDRESS}assignments/?id=${locals.auth.userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth
			}
		});
		const userData = await clerkClient.users.getUser(locals.auth.userId);
		const data = await response.json();
		const clubUsers = await clerkClient.users.getUserList();

		if (data.error && data.error === 'Unauthorized') {
			redirect(302, '/sign-in');
		}
		return {
			auth,
			addresses: data.result,
			user: {
				firstName: userData?.firstName,
				lastName: userData?.lastName,
				id: response.headers.get('x-user-id')
			}
		};
	} catch (err) {
		console.log(err);
		return error(500, err);
	}
}

export const actions = {
	add: async ({ request, cookies, locals }) => {
		const auth = cookies.get('AuthorizationToken');
		try {
			const form = await request.formData();
			const address = form.get('address');
			const description = form.get('description');

			if (!address) {
				return fail(400, { address, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}addresses/`, {
				method: 'POST',
				headers: {
					'X-User-Id': locals.lhUserId,
					'Content-Type': 'application/json',
					Authorization: auth
				},
				body: JSON.stringify({
					number: address,
					description,
					in_use: true,
					user_id: locals.lhUserId.toString()
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
