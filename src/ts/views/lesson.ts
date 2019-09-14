/* global activeCompetence:true, navigationOpen:true */
/* exported activeCompetence, lessonViewSetup, navigationOpen, showLessonView */

const converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
let activeCompetence: HTMLElement | null = null;

function lessonViewSetup(): void
{
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	window.addEventListener("resize", reflowCompetenceBubbles)
}

function emptyFields(): boolean
{
	for(let i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].lessons.length > 0)
		{
			return false;
		}
	}
	return true;
}

function renderLessonView(id: string, markdown: string, noHistory: boolean, second: boolean): void
{
	const lesson = getLessonById(id)!;
	const competences = [];
	for(let k = 0; k < COMPETENCES.length; k++)
	{
		if(lesson.competences.indexOf(COMPETENCES[k].id) >=0)
		{
			competences.push(COMPETENCES[k]);
		}
	}
	let html = "<h1>" + lesson.name + "</h1>";
	activeCompetence = null;
	for(let l = 0; l < competences.length; l++)
	{
		html += "<span class=\"competenceBubble\"><span class=\"competenceBubbleNumber\"><p>" + competences[l].number + "</p></span><span class=\"competenceBubbleText\">" + competences[l].name + "</span><span class=\"competenceBubbleLessons\"><a title=\"Detail kompetence\" href=\"enableJS.html\" data-id=\"" + competences[l].id + "\">Detail kompetence</a></span></span>";
	}
	html += filterXSS(converter.makeHtml(markdown), xssOptions());
	document.getElementById("content")!.innerHTML = html;
	let nodes = document.getElementById("content")!.getElementsByClassName("competenceBubble");
	for(let m = 0; m < nodes.length; m++)
	{
		(nodes[m] as HTMLElement).onclick = toggleCompetenceBubble;
	}
	nodes = document.getElementById("content")!.getElementsByClassName("competenceBubbleLessons");
	for(let n = 0; n < nodes.length; n++)
	{
		(nodes[n].firstChild as HTMLElement).onclick = competenceBubbleDetailOnClick;
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
		const emptyFieldsCache = emptyFields();
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
		cacheThenNetworkRequest(CONFIG.apiuri + "/lesson/" + id, "", function(response: string|object, second: boolean): void
		{
			metadataEvent.addCallback(function(): void
			{
				renderLessonView(id, response as string, noHistory, second);
			});
		});
	}
	refreshLogin();
}
