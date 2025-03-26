import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { createClerkClient } from '@clerk/backend';
import { withClerkHandler } from 'svelte-clerk/server';

const refreshCookie = async function ({ event, resolve }) {
	const isTerminate = event.url.href.includes('session/terminate');
	if (isTerminate) {
		return resolve(event);
	}
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	if (event.locals.auth.sessionId) {
		const sessions = await clerkClient.sessions.getSessionList({
			userId: event.locals.auth.userId,
			limit: 1
		});

		const token = await clerkClient.sessions.getToken(sessions?.data[0].id, 'LocomotiveHouseAPI');

		event.cookies.set('AuthorizationToken', `Bearer ${JSON.stringify(token)}`, {
			httpOnly: true,
			path: '/',
			secure: false,
			sameSite: 'lax',
			maxAge: 1800 // 30 minutes
		});
	}

	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(withClerkHandler(), refreshCookie);
