/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonList(field: FullField): string
{
	var html = "";
	for(var i = 0; i < field.lessons.length; i++)
	{
		var lesson = LESSONS.get(field.lessons[i]);
		html += "<h3 class=\"mainPage\"><a title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[i] + "\">" + lesson.name + "</a></h3>";
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
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(var m = 1; m < competences.length; m++)
			{
				html += ", " + competences[m].number;
			}
			html += "</span>";
		}
	}
	return html;
}

function renderFieldView(id: string, noHistory: boolean): void
{
	var field = FULLFIELDS.get(id);
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
