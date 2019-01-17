"use strict";
/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(url: string, query: string, callback: (response: any, cacheDataReceived: boolean) => void): void
{
	query = typeof query !== 'undefined' ? query : "";
	var networkDataReceived = false;
	var cacheDataReceived = false;
	request(url, query, {}).addCallback(function(response: any): void
		{
			networkDataReceived = true;
			callback(response, cacheDataReceived);
		});
	request(url, query, {"Accept": "x-cache/only"}).addCallback(function(response: any): void
		{
			if(!networkDataReceived)
			{
				cacheDataReceived = true;
				callback(response, false);
			}
		});
}
