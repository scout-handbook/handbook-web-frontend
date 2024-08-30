/* eslint-disable compat/compat -- Service worker isn't used in older browsers */

const CACHE = "handbook-" + ""; /*INJECTED-VERSION*/
const APIPATH = "/API/v1.0";
const cacheBlocking = [
  "/",
  "frontend-computer.min.css",
  "frontend-handheld.min.css",
  "frontend.min.css",
  "frontend.min.js",
  "index.html",
];
const cacheNonBlocking = [
  "font/fontello.woff",
  "showdown.min.js",
  "xss.min.js",
];

const cacheUpdating = [
  APIPATH + "/field",
  APIPATH + "/lesson",
  APIPATH + "/competence",
];

function startsWith(haystack: string, needle: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- String.startsWith isn't defined in older targets, but is safe to use here since a Service worker won't get executed in old browsers
  return haystack.startsWith(needle);
}

self.addEventListener("install", (event: Event): void => {
  (event as ExtendableEvent).waitUntil(
    caches.open(CACHE).then(async (cache): Promise<void> => {
      void cache.addAll(cacheNonBlocking);
      return cache.addAll(cacheBlocking);
    }),
  );
});

async function cacheClone(
  request: Request,
  response: Response,
): Promise<Response> {
  return caches.open(CACHE).then((cache): Response => {
    void cache.put(request, response.clone());
    return response;
  });
}

async function cacheUpdatingResponse(request: Request): Promise<Response> {
  if (request.headers.get("Accept") === "x-cache/only") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- Promise isn't defined in older targets, but is safe to use here since a Service worker won't get executed in old browsers
    return new Promise((resolve: (response: Response) => void): void => {
      void caches.match(request).then((response): void => {
        resolve(
          response ??
            new Response(new Blob(['{"status": 404}']), {
              status: 404,
              statusText: "Not Found",
            }),
        );
      });
    });
  }
  return fetch(request).then(
    async (response): Promise<Response> => cacheClone(request, response),
  );
}

async function cacheOnDemandResponse(request: Request): Promise<Response> {
  if (request.headers.get("Accept") === "x-cache/only") {
    return caches
      .open(CACHE)
      .then(
        async (cache): Promise<Response> =>
          cache.match(request) as Promise<Response>,
      );
  }
  return fetch(request).then(
    async (response): Promise<Response> =>
      caches
        .open(CACHE)
        .then(
          async (cache): Promise<Response> =>
            cache
              .match(request)
              .then((cachedResponse): Promise<Response> | Response =>
                cachedResponse === undefined
                  ? response
                  : cacheClone(request, response),
              ),
        ),
  );
}

async function genericResponse(request: Request): Promise<Response> {
  return caches
    .open(CACHE)
    .then(
      async (cache): Promise<Response> =>
        cache
          .match(request)
          .then(
            (response): Promise<Response> | Response =>
              response ?? fetch(request),
          ),
    );
}

self.addEventListener("fetch", (event: Event): void => {
  const url = new URL((event as FetchEvent).request.url);
  if (cacheUpdating.indexOf(url.pathname) !== -1) {
    void (event as FetchEvent).respondWith(
      cacheUpdatingResponse((event as FetchEvent).request),
    );
  } else if (startsWith(url.pathname, APIPATH + "/lesson")) {
    void (event as FetchEvent).respondWith(
      cacheOnDemandResponse((event as FetchEvent).request),
    );
  } else {
    void (event as FetchEvent).respondWith(
      genericResponse((event as FetchEvent).request),
    );
  }
});

/* eslint-enable */
