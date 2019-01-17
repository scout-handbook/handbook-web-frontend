"use strict";
/* exported toggleLessonOffline, toggleCompetenceBubble, competenceBubbleDetailOnClick */

function toggleLessonOffline()
{
	var checked = (document.getElementById("cacheOffline") as HTMLInputElement).checked;
	if (window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var id = window.location.pathname.substring(8).split("/")[0];
		caches.open(CONFIG.cache).then(function(cache)
			{
				if(checked)
				{
					cache.add(new Request(CONFIG.apiuri + "/lesson/" + id, {credentials: "same-origin"}));
				}
				else
				{
					cache.delete(CONFIG.apiuri + "/lesson/" + id);
				}
		});
	}
}

function toggleCompetenceBubble(event: MouseEvent)
{
	var element = event.target as HTMLElement;
	while(!element.classList.contains("competenceBubble") && (element = element.parentElement!)) { /* Empty */ }
	if(element.style.width !== "")
	{
		window.activeCompetence = null;
		(element.childNodes[1] as HTMLElement).style.width = "";
		element.style.width = "";
		element.style.height = "";
		(element.firstChild as HTMLElement).style.color = "";
		element.style.borderColor = "";
		element.style.backgroundColor = "";
	}
	else
	{
		var nodes = document.getElementById("content")!.getElementsByClassName("competenceBubble");
		for(var i = 0; i < nodes.length; i++)
		{
			(nodes[i].childNodes[1] as HTMLElement).style.width = "";
			(nodes[i] as HTMLElement).style.width = "";
			(nodes[i] as HTMLElement).style.height = "";
			(nodes[i].firstChild as HTMLElement).style.color = "";
			(nodes[i] as HTMLElement).style.borderColor = "";
			(nodes[i] as HTMLElement).style.backgroundColor = "";
		}
		window.activeCompetence = element;
		reflowCompetenceBubbles();
		(element.firstChild as HTMLElement).style.color = CONFIG['custom-properties']['--accent-color'];
		element.style.borderColor = CONFIG['custom-properties']['--accent-color'];
		element.style.backgroundColor = "#f5f5f5";
	}
}

function reflowCompetenceBubbles()
{
	if(window.activeCompetence)
	{
		var fontSize = parseFloat(window.getComputedStyle(activeCompetence).getPropertyValue("font-size"));
		activeCompetence.childNodes[1].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.childNodes[2].style.width = Math.min(403 - 1.3 * fontSize, activeCompetence.parentElement.clientWidth - 1.3 * fontSize + 3) + "px";
		activeCompetence.style.width = Math.min(400, activeCompetence.parentElement.clientWidth) + "px";
		activeCompetence.style.height = (activeCompetence.childNodes[1].offsetHeight + 1.4 * fontSize - 6) + "px";
	}
}

function competenceBubbleDetailOnClick(event: MouseEvent)
{
	showCompetenceView((event.target as HTMLElement).dataset.id!, false)
	return false;
}
