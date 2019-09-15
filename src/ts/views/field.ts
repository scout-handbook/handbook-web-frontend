/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonList(field: Field): string
{
	let html = "";
	for(let i = 0; i < field.lessons.length; i++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + field.lessons[i].name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[i].id + "\">" + field.lessons[i].name + "</a></h3>";
		if(field.lessons[i].competences.length > 0)
		{
			const competences = [];
			for(let j = 0; j < COMPETENCES.length; j++)
			{
				if(field.lessons[i].competences.indexOf(COMPETENCES[j].id) >= 0)
				{
					competences.push(COMPETENCES[j]);
				}
			}
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(let j = 1; j < competences.length; j++)
			{
				html += ", " + competences[j].number;
			}
			html += "</span>";
		}
	}
	return html;
}

function renderFieldView(id: string, noHistory: boolean): void
{
	let field: Field = {id: "", name: "", lessons: []};
	for(let i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === id)
		{
			field = FIELDS[i];
			break;
		}
	}
	let html = "<h1>" + field.name + "</h1>";
	for(let j = 0; j < FULLFIELDS.length; j++)
	{
		if(FULLFIELDS[j].id === id)
		{
			html += FULLFIELDS[j].description;
			break;
		}
	}
	html += renderFieldLessonList(field);
	document.getElementById("content")!.innerHTML = html;

	const nodes = document.getElementById("content")!.getElementsByTagName("h3");
	for(let i = 0; i < nodes.length; i++)
	{
		(nodes[i].firstChild as HTMLElement).onclick = TOCLessonOnClick;
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
