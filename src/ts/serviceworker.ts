"use strict";
/* eslint-env serviceworker */

var CACHE = "handbook-" + ""/*INJECTED-VERSION*/;
var APIPATH = "/API/v0.9"
var cacheBlocking = [
	"/",
	"frontend-computer.min.css",
	"frontend-handheld.min.css",
	"frontend.min.css",
	"frontend.min.js",
	"frontend-pushed.min.css",
	"frontend-pushed.min.js",
	"index.html"
];
var cacheNonBlocking = [
	"font/fontello.woff",
	"showdown.min.js",
	"xss.min.js"
];

var cacheUpdating = [
	APIPATH + "/lesson",
	APIPATH + "/competence"
];

function startsWith(haystack: string, needle: string)
{
	return haystack.substr(0, needle.length) === needle;
}

self.addEventListener("install", function(event: Event)
	{
		(event as ExtendableEvent).waitUntil(
			caches.open(CACHE).then(function(cache)
				{
					cache.addAll(cacheNonBlocking);
					return cache.addAll(cacheBlocking);
				})
		);
	});

self.addEventListener("fetch", function(event: Event)
	{
		var url = new URL((event as FetchEvent).request.url); // eslint-disable-line compat/compat
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

function cacheUpdatingResponse(request: Request) : Promise<Response>
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return new Promise(function(resolve) { // eslint-disable-line no-undef, compat/compat
				caches.match(request).then(function(response)
					{
						if(response)
						{
							resolve(response);
						}
						else
						{
							resolve(new Response(new Blob(["{\"status\": 404}"]), {"status": 404, "statusText": "Not Found"}));
						}
					});
			});
	}
	else
	{
		return fetch(request).then(function(response) // eslint-disable-line compat/compat
			{
				return cacheClone(request, response);
			});
	}
}

function cacheOnDemandResponse(request: Request)
{
	if(request.headers.get("Accept") === "x-cache/only")
	{
		return caches.open(CACHE).then(function(cache)
			{
				return cache.match(request) as Promise<Response>;
			});
	}
	else
	{
		return fetch(request).then(function(response) // eslint-disable-line compat/compat
			{
				return caches.open(CACHE).then(function(cache)
					{
						return cache.match(request).then(function(cachedResponse)
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

function genericResponse(request: Request)
{
	return caches.open(CACHE).then(function(cache)
		{
			return cache.match(request).then(function(response)
				{
					if(response)
					{
						return response;
					}
					return fetch(request); // eslint-disable-line compat/compat
				})
		});
}

function cacheClone(request: Request, response: Response)
{
	return caches.open(CACHE).then(function(cache)
		{
			cache.put(request, response.clone());
			return response;
		});
}
