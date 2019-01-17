"use strict";
/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(url: string, query: string, callback: (response: string, cacheDataReceived: boolean) => void)
{
	query = typeof query !== 'undefined' ? query : "";
	var networkDataReceived = false;
	var cacheDataReceived = false;
	request(url, query, {}).addCallback(function(response: string)
		{
			networkDataReceived = true;
			callback(response, cacheDataReceived);
		});
	request(url, query, {"Accept": "x-cache/only"}).addCallback(function(response: string)
		{
			if(!networkDataReceived)
			{
				cacheDataReceived = true;
				callback(response, false);
			}
		});
}
