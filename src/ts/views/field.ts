/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonList(field: Field): string
{
	var html = "";
	for(var i = 0; i < field.lessons.length; i++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + field.lessons[i].name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[i].id + "\">" + field.lessons[i].name + "</a></h3>";
		if(field.lessons[i].competences.length > 0)
		{
			var competences = [];
			for(var k = 0; k < COMPETENCES.length; k++)
			{
				if(field.lessons[i].competences.indexOf(COMPETENCES[k].id) >= 0)
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
	var field: Field = {id: "", name: "", lessons: []};
	for(var i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === id)
		{
			field = FIELDS[i];
			break;
		}
	}
	var html = "<h1>" + field.name + "</h1>";
	for(var j = 0; j < FULLFIELDS.length; j++)
	{
		if(FULLFIELDS[j].id === id)
		{
			html += FULLFIELDS[j].description;
			break;
		}
	}
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
