interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<Response | void>): void;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}
