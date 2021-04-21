/* global activeCompetence:true, navigationOpen:true */
/* exported activeCompetence, lessonViewSetup, navigationOpen, showLessonView */

let converter: showdown.Converter;
let activeCompetence: HTMLElement | null = null;

function lessonViewSetup(): void
{
	converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	window.addEventListener("resize", reflowCompetenceBubbles)
}

function renderLessonView(id: string, markdown: string, noHistory: boolean, second: boolean): void
{
	const lesson = LESSONS.get(id)!;
	let html = "<h1>" + lesson.name + "</h1>";
	activeCompetence = null;
	COMPETENCES.filter(function(id) {
		return lesson.competences.indexOf(id) >= 0;
	}).iterate(function(competenceId, competence)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><p>" + competence.number.toString() + "</p></span><span class=\"competenceBubbleText\">" + competence.name + "</span><span class=\"competenceBubbleLessons\"><a title=\"Detail kompetence\" href=\"enableJS.html\" data-id=\"" + competenceId + "\">Detail kompetence</a></span></span>";
	});
	html += filterXSS(converter.makeHtml(markdown), xssOptions());
	document.getElementById("content")!.innerHTML = html;
	let nodes = document.getElementById("content")!.getElementsByClassName("competenceBubble");
	for(let i = 0; i < nodes.length; i++)
	{
		(nodes[i] as HTMLElement).onclick = toggleCompetenceBubble;
	}
	nodes = document.getElementById("content")!.getElementsByClassName("competenceBubbleLessons");
	for(let i = 0; i < nodes.length; i++)
	{
		(nodes[i].firstChild as HTMLElement).onclick = competenceBubbleDetailOnClick;
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!second)
	{
		if(!noHistory)
		{
			history.pushState({"id": id}, "title", "/lesson/" + id + "/" + urlEscape(lesson.name)); // eslint-disable-line compat/compat

		}
	}
	if("serviceWorker" in navigator)
	{
		void caches.open(CONFIG.cache).then(function(cache): void
		{
			void cache.match(CONFIG["api-uri"] + "/v1.0/lesson/" + id).then(function(response): void
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

function showLessonView(id: string, noHistory: boolean): void
{
	document.getElementById("content")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	if(!LESSONS.get(id))
	{
		const emptyFieldsCache = FIELDS.empty();
		loginstateEvent.addCallback(function(): void
		{
			if(LOGINSTATE)
			{
				if(!emptyFieldsCache)
				{
					window.location.href = CONFIG['frontend-uri'] + "/404.html";
				}
			}
			else
			{
				loginRedirect();
			}
		});
	}
	else
	{
		cacheThenNetworkRequest(CONFIG["api-uri"] + "/v1.0/lesson/" + id, "", function(response, second: boolean): void
		{
			metadataEvent.addCallback(function(): void
			{
				renderLessonView(id, response as string, noHistory, second);
			});
		});
	}
	refreshLogin();
}
