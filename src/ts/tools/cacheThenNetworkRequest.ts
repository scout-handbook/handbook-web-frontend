/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(
  url: string,
  query: string,
  callback: (response: RequestResponse, cacheDataReceived: boolean) => void,
): void {
  let networkDataReceived = false;
  let cacheDataReceived = false;
  request(url, query, {}).addCallback((response): void => {
    networkDataReceived = true;
    callback(response, cacheDataReceived);
  });
  request(url, query, { Accept: "x-cache/only" }).addCallback(
    (response): void => {
      if (!networkDataReceived) {
        cacheDataReceived = true;
        callback(response, false);
      }
    },
  );
}
