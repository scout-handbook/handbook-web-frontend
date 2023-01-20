/* eslint-env serviceworker */

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
  return haystack.startsWith(needle);
}

self.addEventListener("install", function (event: Event): void {
  (event as ExtendableEvent).waitUntil(
    caches.open(CACHE).then(async function (cache): Promise<void> {
      void cache.addAll(cacheNonBlocking);
      return cache.addAll(cacheBlocking);
    })
  );
});

async function cacheClone(
  request: Request,
  response: Response
): Promise<Response> {
  return caches.open(CACHE).then(function (cache): Response {
    void cache.put(request, response.clone());
    return response;
  });
}

async function cacheUpdatingResponse(request: Request): Promise<Response> {
  if (request.headers.get("Accept") === "x-cache/only") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return new Promise(function (resolve): void {
      void caches.match(request).then(function (response): void {
        if (response) {
          resolve(response); // eslint-disable-line @typescript-eslint/no-unsafe-call
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          resolve(
            new Response(new Blob(['{"status": 404}']), {
              status: 404,
              statusText: "Not Found",
            })
          );
        }
      });
    });
  } else {
    return fetch(request).then(async function (response): Promise<Response> {
      return cacheClone(request, response);
    });
  }
}

async function cacheOnDemandResponse(request: Request): Promise<Response> {
  if (request.headers.get("Accept") === "x-cache/only") {
    return caches.open(CACHE).then(async function (cache): Promise<Response> {
      return cache.match(request) as Promise<Response>;
    });
  } else {
    return fetch(request).then(async function (response): Promise<Response> {
      return caches.open(CACHE).then(async function (cache): Promise<Response> {
        return cache
          .match(request)
          .then(function (cachedResponse): Promise<Response> | Response {
            if (cachedResponse === undefined) {
              return response;
            }
            return cacheClone(request, response);
          });
      });
    });
  }
}

async function genericResponse(request: Request): Promise<Response> {
  return caches.open(CACHE).then(async function (cache): Promise<Response> {
    return cache
      .match(request)
      .then(function (response): Promise<Response> | Response {
        if (response) {
          return response;
        }
        return fetch(request); // eslint-disable-line compat/compat
      });
  });
}

self.addEventListener("fetch", function (event: Event): void {
  const url = new URL((event as FetchEvent).request.url); // eslint-disable-line compat/compat
  if (cacheUpdating.indexOf(url.pathname) !== -1) {
    void (event as FetchEvent).respondWith(
      cacheUpdatingResponse((event as FetchEvent).request)
    );
  } else if (startsWith(url.pathname, APIPATH + "/lesson")) {
    void (event as FetchEvent).respondWith(
      cacheOnDemandResponse((event as FetchEvent).request)
    );
  } else {
    void (event as FetchEvent).respondWith(
      genericResponse((event as FetchEvent).request)
    );
  }
});
