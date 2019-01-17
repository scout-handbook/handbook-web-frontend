/* eslint strict: "off", no-unused-vars: "off" */

interface ExtendableEvent extends Event {
	waitUntil(fn: Promise<void|Response>): void;
}

interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}
