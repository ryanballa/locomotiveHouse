import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { createClerkClient } from '@clerk/backend';
import { withClerkHandler } from 'svelte-clerk/server';
import { API_ADDRESS } from '$env/static/private';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://dbe0f009be9647e1878b4452adaa2694@o820586.ingest.us.sentry.io/5809225',
	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#sendDefaultPii
	sendDefaultPii: true
});

const myErrorHandler = ({ error, event }) => {
	console.error('An error occurred on the server side:', error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);

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
		const internalUsers = await fetch(`${API_ADDRESS}users/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${JSON.stringify(token)}`
			}
		});

		const internalUsersData = await internalUsers.json();
		const internalUserId = internalUsersData?.result?.find(
			(user) => user.token === event.locals.auth.userId
		);

		// Set additional session variables
		event.locals.lhUserId = internalUserId?.id;

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

export const handle: Handle = sequence(withClerkHandler(), refreshCookie, Sentry.sentryHandle());
