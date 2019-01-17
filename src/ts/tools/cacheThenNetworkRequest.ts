"use strict";
/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(url, query, callback)
{
	query = typeof query !== 'undefined' ? query : "";
	var networkDataReceived = false;
	var cacheDataReceived = false;
	request(url, query, undefined).addCallback(function(response)
		{
			networkDataReceived = true;
			callback(response, cacheDataReceived);
		});
	request(url, query, {"Accept": "x-cache/only"}).addCallback(function(response)
		{
			if(!networkDataReceived)
			{
				cacheDataReceived = true;
				callback(response, false);
			}
		});
}
