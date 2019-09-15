/* eslint-env serviceworker */

const CACHE = "handbook-" + ""/*INJECTED-VERSION*/;
const APIPATH = "/API/v0.9"
const cacheBlocking = [
	"/",
	"frontend-computer.min.css",
	"frontend-handheld.min.css",
	"frontend.min.css",
	"frontend.min.js",
	"frontend-pushed.min.css",
	"frontend-pushed.min.js",
	"index.html"
];
const cacheNonBlocking = [
	"font/fontello.woff",
	"showdown.min.js",
	"xss.min.js"
];

const cacheUpdating = [
	APIPATH + "/field",
	APIPATH + "/lesson",
	APIPATH + "/competence"
];

function startsWith(haystack: string, needle: string): boolean
{
	return haystack.substr(0, needle.length) === needle;
}

self.addEventListener("install", function(event: Event): void
{
	(event as ExtendableEvent).waitUntil(
		caches.open(CACHE).then(function(cache): Promise<void>
		{
			cache.addAll(cacheNonBlocking);
			return cache.addAll(cacheBlocking);
		})
	);
});

function cacheClone(request: Request, response: Response): Promise<Response>
{
	return caches.open(CACHE).then(function(cache): Response
	{
		cache.put(request, response.clone());
		return response;
	});
}

function cacheUpdatingResponse(request: Request): Promise<Response>
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return new Promise(function(resolve): void { // eslint-disable-line no-undef, compat/compat
			caches.match(request).then(function(response): void
			{
				if(response)
				{
					resolve(response);
				}
				else
				{
					resolve(new Response(new Blob(["{\"status\": 404}"]), {"status": 404, "statusText": "Not Found"})); // eslint-disable-line compat/compat
				}
			});
		});
	}
	else
	{
		return fetch(request).then(function(response): Promise<Response> // eslint-disable-line compat/compat
		{
			return cacheClone(request, response);
		});
	}
}

function cacheOnDemandResponse(request: Request): Promise<Response>
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return caches.open(CACHE).then(function(cache): Promise<Response>
		{
			return cache.match(request) as Promise<Response>;
		});
	}
	else
	{
		return fetch(request).then(function(response): Promise<Response> // eslint-disable-line compat/compat
		{
			return caches.open(CACHE).then(function(cache): Promise<Response>
			{
				return cache.match(request).then(function(cachedResponse): Promise<Response>|Response
				{
					if(cachedResponse === undefined)
					{
						return response
					}
					return cacheClone(request, response);
				});
			});
		});
	}
}

function genericResponse(request: Request): Promise<Response>
{
	return caches.open(CACHE).then(function(cache): Promise<Response>
	{
		return cache.match(request).then(function(response): Promise<Response>|Response
		{
			if(response)
			{
				return response;
			}
			return fetch(request); // eslint-disable-line compat/compat
		})
	});
}

self.addEventListener("fetch", function(event: Event): void
{
	const url = new URL((event as FetchEvent).request.url); // eslint-disable-line compat/compat
	if(cacheUpdating.indexOf(url.pathname) !== -1)
	{
		(event as FetchEvent).respondWith(cacheUpdatingResponse((event as FetchEvent).request));
	}
	else if(startsWith(url.pathname, APIPATH + "/lesson"))
	{
		(event as FetchEvent).respondWith(cacheOnDemandResponse((event as FetchEvent).request));
	}
	else
	{
		(event as FetchEvent).respondWith(genericResponse((event as FetchEvent).request));
	}
});
