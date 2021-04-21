/* global COMPETENCES:true FIELDS:true LESSONS:true LOGINSTATE:true */
/* exported COMPETENCES, FIELDS, LESSONS, LOGINSTATE, metadataSetup */

const metadataEvent = new AfterLoadEvent(3);
const loginstateEvent = new AfterLoadEvent(1);

function metadataSetup(): void
{
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v1.0/field", "", function(response, second): void
	{
		FIELDS = new IDList<Field>(response as Record<string, Field>);
		if(second)
		{
			metadataEvent.retrigger();
		}
		else
		{
			metadataEvent.trigger();
		}
	});
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v1.0/lesson", "", function(response, second): void
	{
		LESSONS = new IDList<Lesson>(response as Record<string, Lesson>);
		if(second)
		{
			metadataEvent.retrigger();
		}
		else
		{
			metadataEvent.trigger();
		}
	});
	cacheThenNetworkRequest(CONFIG["api-uri"] + "/v1.0/competence", "", function(response, second): void
	{
		COMPETENCES = new IDList<Competence>(response as Record<string, Competence>);
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
	xhttp.open("GET", CONFIG["api-uri"] + "/v1.0/account", true);
	xhttp.send();
}
