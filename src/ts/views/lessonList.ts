/* global navigationOpen:true */
/* exported showLessonListView */

function renderLessonCompetences(lesson: Lesson, secondLevel: string): string
{
	var html = "";
	if(lesson.competences.length > 0)
	{
		var competences = [];
		for(var k = 0; k < COMPETENCES.length; k++)
		{
			if(lesson.competences.indexOf(COMPETENCES[k].id) >= 0)
			{
				competences.push(COMPETENCES[k]);
			}
		}
		html += "<span class=\"mainPage" + secondLevel + "\">Kompetence: " + competences[0].number;
		for(var m = 1; m < competences.length; m++)
		{
			html += ", " + competences[m].number;
		}
		html += "</span>";
	}
	return html;
}

function renderFieldList(): string
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var secondLevel = "";
		if(FIELDS[i].name)
		{
			secondLevel = " secondLevel";
			html += "<h2 class=\"mainPage\"><a title=\"" + FIELDS[i].name + "\" href=\"enableJS.html\" data-id=\"" + FIELDS[i].id + "\">" + FIELDS[i].name + "</a></h2>";
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += "<h3 class=\"mainPage" + secondLevel + "\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
			html += renderLessonCompetences(FIELDS[i].lessons[j], secondLevel);
		}
	}
	return html;
}

function renderLessonListView(noHistory: boolean): void
{
	var html = "<h1>" + CONFIG["site-name"] + "</h1>";
	html += renderFieldList();
	document.getElementById("content")!.innerHTML = html;

	var nodes = document.getElementById("content")!.getElementsByTagName("a");
	for(var l = 0; l < nodes.length; l++)
	{
		if(nodes[l].parentElement!.tagName === "H2")
		{
			nodes[l].onclick = TOCFieldOnClick;
		}
		else
		{
			nodes[l].onclick = TOCLessonOnClick;
		}
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
	document.getElementById("offlineSwitch")!.style.display = "none";
}

function showLessonListView(noHistory: boolean): void
{
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function(): void
	{
		renderLessonListView(noHistory);
	});
	refreshLogin();
}
