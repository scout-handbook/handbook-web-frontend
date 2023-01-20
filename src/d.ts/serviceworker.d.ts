interface ExtendableEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  waitUntil(fn: Promise<Response | void>): void;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}
