/* exported request */

function request(url: string, query: string, headers: RequestHeaders): AfterLoadEvent
{
	var ret = new AfterLoadEvent(1);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(): void
	{
		if(this.readyState === 4)
		{
			var body = JSON.parse(this.responseText);
			if(this.status === 200)
			{
				ret.trigger(body.response);
			}
			else if(this.status === 403 && body.type === "RoleException")
			{
				loginRedirect();
			}
		}
	}
	if(query !== undefined && query !== "")
	{
		url += "?" + query;
	}
	xhttp.open("GET", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	for(var key in headers)
	{
		if(Object.prototype.hasOwnProperty.call(headers, key))
		{
			xhttp.setRequestHeader(key, headers[key]);
		}
	}
	xhttp.send();
	return ret;
}
