/* global COMPETENCES:true FULLFIELDS:true LOGINSTATE:true */
/* exported COMPETENCES, LOGINSTATE, metadataSetup */

var metadataEvent = new AfterLoadEvent(3);
var loginstateEvent = new AfterLoadEvent(1);

function metadataSetup(): void
{
	cacheThenNetworkRequest(CONFIG.apiuri + "/field", "", function(response, second): void
	{
		FULLFIELDS = new IDList<FullField>(response as IDListItems<FullField>);
		if(second)
		{
			metadataEvent.retrigger();
		}
		else
		{
			metadataEvent.trigger();
		}
	});
	cacheThenNetworkRequest(CONFIG.apiuri + "/lesson", "", function(response, second): void
	{
		LESSONS = new IDList<Lesson>(response as IDListItems<Lesson>);
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
		COMPETENCES = response as Array<Competence>;
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
			var response = {status: undefined, response: null};
			if(this.responseText)
			{
				response = JSON.parse(this.responseText);
			}
			if(response.status === 200)
			{
				LOGINSTATE = response.response;
				loginstateEvent.trigger();
			}
			else if(response.status === 401)
			{
				LOGINSTATE = null;
				loginstateEvent.trigger();
			}
		}
	}
	xhttp.open("GET", CONFIG.apiuri + "/account", true);
	xhttp.send();
}
