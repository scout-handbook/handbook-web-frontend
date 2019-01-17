"use strict";
/* global activeCompetence:true */
/* exported activeCompetence, lessonViewSetup, showLessonView */

var converter: Converter;
var activeCompetence: HTMLElement | null = null;

function lessonViewSetup(): void
{
	converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	window.addEventListener("resize", reflowCompetenceBubbles)
}

function showLessonView(id: string, noHistory: boolean): void
{
	document.getElementById("content")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	if(!getLessonById(id))
	{
		loginstateEvent.addCallback(function(): void
			{
				if(LOGINSTATE)
				{
					window.location.href = CONFIG['frontend-uri'] + "/404.html";
				}
				else
				{
					loginRedirect();
				}
			});
	}
	else
	{
		cacheThenNetworkRequest(CONFIG.apiuri + "/lesson/" + id, "", function(response: string, second: boolean): void
			{
				metadataEvent.addCallback(function(): void
					{
						renderLessonView(id, response, noHistory, second);
					});
			});
	}
	refreshLogin();
}

function renderLessonView(id: string, markdown: string, noHistory: boolean, second: boolean): void
{
	var lesson = getLessonById(id)!;
	var competences = [];
	for(var k = 0; k < COMPETENCES.length; k++)
	{
		if(lesson.competences.indexOf(COMPETENCES[k].id) >=0)
		{
			competences.push(COMPETENCES[k]);
		}
	}
	var html = "<h1>" + lesson.name + "</h1>";
	activeCompetence = null;
	for(var l = 0; l < competences.length; l++)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><p>" + competences[l].number + "</p></span><span class=\"competenceBubbleText\">" + competences[l].name + "</span><span class=\"competenceBubbleLessons\"><a title=\"Detail kompetence\" href=\"enableJS.html\" data-id=\"" + competences[l].id + "\">Detail kompetence</a></span></span>";
	}
	html += filterXSS(converter.makeHtml(markdown), xssOptions());
	document.getElementById("content")!.innerHTML = html;
	var nodes = document.getElementById("content")!.getElementsByClassName("competenceBubble");
	for(var m = 0; m < nodes.length; m++)
	{
		(nodes[m] as HTMLElement).onclick = toggleCompetenceBubble;
	}
	nodes = document.getElementById("content")!.getElementsByClassName("competenceBubbleLessons");
	for(var n = 0; n < nodes.length; n++)
	{
		(nodes[n].firstChild as HTMLElement).onclick = competenceBubbleDetailOnClick;
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!second)
	{
		if(!noHistory)
		{
			history.pushState({"id": id}, "title", "/lesson/" + id + "/" + urlEscape(lesson.name));

		}
	}
	if("serviceWorker" in navigator)
	{
		caches.open(CONFIG.cache).then(function(cache): void
			{
				cache.match(CONFIG.apiuri + "/lesson/" + id).then(function(response): void
					{
						if(response === undefined)
						{
							(document.getElementById("cacheOffline") as HTMLInputElement).checked = false;
						}
						else
						{
							(document.getElementById("cacheOffline") as HTMLInputElement).checked = true;
						}
					});
			});
		document.getElementById("offlineSwitch")!.style.display = "block";
	}
}
