/* exported cacheThenNetworkRequest */

function cacheThenNetworkRequest(
  url: string,
  query: string,
  callback: (response: RequestResponse, cacheDataReceived: boolean) => void,
): void {
  query = typeof query !== "undefined" ? query : "";
  let networkDataReceived = false;
  let cacheDataReceived = false;
  request(url, query, {}).addCallback((response): void => {
    networkDataReceived = true;
    callback(response, cacheDataReceived);
  });
  // eslint-disable-next-line @typescript-eslint/naming-convention -- A HTTP header should start with a capital letter
  request(url, query, { Accept: "x-cache/only" }).addCallback(
    (response): void => {
      if (!networkDataReceived) {
        cacheDataReceived = true;
        callback(response, false);
      }
    },
  );
}
