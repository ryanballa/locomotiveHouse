import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://dbe0f009be9647e1878b4452adaa2694@o820586.ingest.us.sentry.io/5809225',
	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
	integrations: []
});
const myErrorHandler = ({ error, event }) => {
	console.error('An error occurred on the client side:', error, event);
};
export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
