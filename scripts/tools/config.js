"use strict";

var CONFIG;
var configEvent = new AfterLoadEvent(1);

function configSetup()
{
	var configRequest = new XMLHttpRequest();
	configRequest.overrideMimeType("application/json");
	configRequest.open('GET', '/client-config.json', true);
	configRequest.onreadystatechange = function ()
		{
			if(this.readyState === 4 && this.status === 200)
			{
				CONFIG = JSON.parse(this.responseText);
				configEvent.trigger();
			}
		};
	configRequest.send();
}
