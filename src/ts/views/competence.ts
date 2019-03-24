/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceView */

function renderCompetenceLessonList(lessonList: IDList<Lesson>): string
{
	var html = "";
	lessonList.iterate(function(id, lesson)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + id + "\">" + lesson.name + "</a></h3>";
		if(lesson.competences.length > 0)
		{
			var competences = [];
			for(var o = 0; o < COMPETENCES.length; o++)
			{
				if(lesson.competences.indexOf(COMPETENCES[o].id) >= 0)
				{
					competences.push(COMPETENCES[o]);
				}
			}
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(var p = 1; p < competences.length; p++)
			{
				html += ", " + competences[p].number;
			}
			html += "</span>";
		}
	});
	return html;
}

function renderCompetenceView(id: string, noHistory: boolean): void
{
	var competence: Competence = {name: "", number: 0, description: "", id: ""};
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === id)
		{
			competence = COMPETENCES[i];
			break;
		}
	}
	var html = "<h1>" + competence.number + ": " + competence.name + "</h1>";
	html += competence.description;
	var lessonList = new IDList<Lesson>();
	LESSONS.iterate(function(id, lesson) {
		for(var i = 0; i < lesson.competences.length; i++)
		{
			if(lesson.competences[i] === competence.id)
			{
				lessonList.push(id, lesson);
				break;
			}
		}
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
