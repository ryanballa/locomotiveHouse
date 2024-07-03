import { createClerkClient } from '@clerk/clerk-sdk-node';
import { CLERK_SECRET_KEY } from '$env/static/private';

export async function load(event) {
	const clerkClient = await createClerkClient({ secretKey: CLERK_SECRET_KEY });
	if (event.locals.session) {
		const sessions = await clerkClient.sessions.getSessionList({
			userId: event.locals.session.userId,
			limit: 1
		});
		// console.log('Sessions');
		// console.log(sessions);

		const token = await clerkClient.sessions.getToken(sessions?.data[0].id, 'LocomotiveHouseAPI');

		// console.log('The token');
		// console.log(token);

		event.cookies.set('AuthorizationToken', `Bearer ${JSON.stringify(token)}`, {
			httpOnly: true,
			path: '/',
			secure: false,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 // 1 day
		});
	}
}
