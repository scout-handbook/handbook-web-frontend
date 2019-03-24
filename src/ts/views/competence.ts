/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceView */

function renderCompetenceLessonList(lessonList: IDList<Lesson>): string
{
	var html = "";
	lessonList.iterate(function(id, lesson)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + id + "\">" + lesson.name + "</a></h3>";
		var first = true;
		COMPETENCES.iterate(function(competenceId, competence)
		{
			if(lesson.competences.indexOf(competenceId) >= 0)
			{
				if(first)
				{
					html += "<span class=\"mainPage\">Kompetence: " + competence.number;
					first = false;
				}
				else
				{
					html += ", " + competence.number;
				}
			}
		});
		html += "</span>";
	});
	return html;
}

function renderCompetenceView(id: string, noHistory: boolean): void
{
	var competence = COMPETENCES.get(id);
	var html = "<h1>" + competence.number + ": " + competence.name + "</h1>";
	html += competence.description;
	var lessonList = LESSONS.filter(function(_, lesson)
	{
		return lesson.competences.indexOf(id) >= 0;
	});
	html += renderCompetenceLessonList(lessonList);
	document.getElementById("content")!.innerHTML = html;

	var nodes = document.getElementById("content")!.getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		(nodes[l].firstChild as HTMLElement).onclick = TOCLessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/competence/" + id + "/" + urlEscape(competence.number + "-" + competence.name)); // eslint-disable-line compat/compat
	}
	document.getElementById("offlineSwitch")!.style.display = "none";
}

function showCompetenceView(id: string, noHistory: boolean): void
{
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function(): void
	{
		renderCompetenceView(id, noHistory);
	});
	refreshLogin();
}
