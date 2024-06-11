import { error, fail } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

function sortByNumber({ data }) {
	return data.sort((a, b) => a.number - b.number);
}

export async function load({ params }) {
	try {
		const response = await fetch(`${API_ADDRESS}consists/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		return {
			consists: sortByNumber({ data: data.result })
		};
	} catch (err) {
		return error(500, err);
	}
}

export const actions = {
	add: async ({ request }) => {
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
					'Content-Type': 'application/json'
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
	delete: async ({ request }) => {
		try {
			const data = await request.json();
			const apiRequest = await fetch(`${API_ADDRESS}consists/${data.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
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
