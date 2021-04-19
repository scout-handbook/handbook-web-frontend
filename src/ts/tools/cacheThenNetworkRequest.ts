/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(url: string, query: string, callback: (response: RequestResponse|string, cacheDataReceived: boolean) => void): void
{
	query = typeof query !== 'undefined' ? query : "";
	let networkDataReceived = false;
	let cacheDataReceived = false;
	request(url, query, {}).addCallback(function(response): void
	{
		networkDataReceived = true;
		callback(response, cacheDataReceived);
	});
	request(url, query, {"Accept": "x-cache/only"}).addCallback(function(response): void
	{
		if(!networkDataReceived)
		{
			cacheDataReceived = true;
			callback(response, false);
		}
	});
}
