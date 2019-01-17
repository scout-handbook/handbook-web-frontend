"use strict";
/* exported metadataSetup */

var metadataEvent = new AfterLoadEvent(2);
var loginstateEvent = new AfterLoadEvent(1);

function metadataSetup(): void
{
	cacheThenNetworkRequest(CONFIG.apiuri + "/lesson", "", function(response, second): void
		{
			window.FIELDS = response;
			if(second)
			{
				metadataEvent.retrigger();
			}
			else
			{
				metadataEvent.trigger();
			}
		});
	cacheThenNetworkRequest(CONFIG.apiuri + "/competence", "", function(response, second): void
		{
			window.COMPETENCES = response;
			if(second)
			{
				metadataEvent.retrigger();
			}
			else
			{
				metadataEvent.trigger();
			}
		});
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(): void
		{
			if(this.readyState === 4)
			{
				var response = {status: undefined, response: undefined};
				if(this.responseText)
				{
					response = JSON.parse(this.responseText);
				}
				if(response.status === 200)
				{
					window.LOGINSTATE = response.response;
					loginstateEvent.trigger();
				}
				else if(response.status === 401)
				{
					window.LOGINSTATE = undefined;
					loginstateEvent.trigger();
				}
			}
		}
	xhttp.open("GET", CONFIG.apiuri + "/account", true);
	xhttp.send();
}
