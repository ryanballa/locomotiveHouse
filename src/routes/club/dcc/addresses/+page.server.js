import { error, fail } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ params }) {
	try {
		const response = await fetch(`${API_ADDRESS}addresses/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		return {
			addresses: data.result
		};
	} catch (err) {
		return error(500, err);
	}
}

export const actions = {
	add: async ({ request }) => {
		try {
			const form = await request.formData();
			const address = form.get('address');
			const description = form.get('description');
			const owner = form.get('owner');

			if (!address) {
				return fail(400, { address, missing: true });
			}

			if (!owner) {
				return fail(400, { owner, missing: true });
			}

			const response = await fetch(`${API_ADDRESS}addresses/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					number: address,
					description,
					in_use: true,
					owner
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
	activation: async ({ request }) => {
		try {
			const data = await request.json();
			const apiRequest = await fetch(`${API_ADDRESS}addresses/${data.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
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
