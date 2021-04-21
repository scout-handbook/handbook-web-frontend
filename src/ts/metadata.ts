/* global COMPETENCES:true FIELDS:true FULLFIELDS:true LOGINSTATE:true */
/* exported COMPETENCES, FIELDS, FULLFIELDS, LOGINSTATE, metadataSetup */

const metadataEvent = new AfterLoadEvent(3);
const loginstateEvent = new AfterLoadEvent(1);

function metadataSetup(): void
{
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v0.9/field", "", function(response, second): void
	{
		FULLFIELDS = response as Array<FullField>;
		if(second)
		{
			metadataEvent.retrigger();
		}
		else
		{
			metadataEvent.trigger();
		}
	});
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v0.9/lesson", "", function(response, second): void
	{
		FIELDS = response as Array<Field>;
		if(second)
		{
			metadataEvent.retrigger();
		}
		else
		{
			metadataEvent.trigger();
		}
	});
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v0.9/competence", "", function(response, second): void
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
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(): void
	{
		if(this.readyState === 4)
		{
			if(!this.responseText)
			{
				return;
			}
			const response = JSON.parse(this.responseText) as APIResponse;
			if(response.status === 200)
			{
				LOGINSTATE = response.response! as Loginstate;
				loginstateEvent.trigger();
			}
			else if(response.status === 401)
			{
				LOGINSTATE = null;
				loginstateEvent.trigger();
			}
		}
	}
	xhttp.open("GET", CONFIG["api-uri"] + "/v0.9/account", true);
	xhttp.send();
}
