/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonList(field: Field): string
{
	var html = "";
	for(var i = 0; i < field.lessons.length; i++)
	{
		var lesson = LESSONS.get(field.lessons[i]);
		html += "<h3 class=\"mainPage\"><a title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[i] + "\">" + lesson.name + "</a></h3>";
		var first = true;
		COMPETENCES.iterate(function(id, competence)
		{
			if(lesson.competences.indexOf(id) >= 0)
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
	}
	return html;
}

function renderFieldView(id: string, noHistory: boolean): void
{
	var field = FIELDS.get(id);
	var html = "<h1>" + field.name + "</h1>";
	html += field.description;
	html += renderFieldLessonList(field);
	document.getElementById("content")!.innerHTML = html;

	var nodes = document.getElementById("content")!.getElementsByTagName("h3");
	for(var l = 0; l < nodes.length; l++)
	{
		(nodes[l].firstChild as HTMLElement).onclick = TOCLessonOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)0
	{
		history.pushState({"id": id}, "title", "/field/" + id + "/" + urlEscape(field.name)); // eslint-disable-line compat/compat
	}
	document.getElementById("offlineSwitch")!.style.display = "none";
}

function showFieldView(id: string, noHistory: boolean): void
{
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function(): void
	{
		renderFieldView(id, noHistory);
	});
	refreshLogin();
}
