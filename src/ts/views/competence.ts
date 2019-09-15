/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceView */

function renderCompetenceLessonList(lessonList: Array<Lesson>): string
{
	let html = "";
	for(let i = 0; i < lessonList.length; i++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + lessonList[i].name + "\" href=\"enableJS.html\" data-id=\"" + lessonList[i].id + "\">" + lessonList[i].name + "</a></h3>";
		if(lessonList[i].competences.length > 0)
		{
			const competences = [];
			for(let j = 0; j < COMPETENCES.length; j++)
			{
				if(lessonList[i].competences.indexOf(COMPETENCES[j].id) >= 0)
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

function renderCompetenceView(id: string, noHistory: boolean): void
{
	let competence: Competence = {name: "", number: 0, description: "", id: ""};
	for(let i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === id)
		{
			competence = COMPETENCES[i];
			break;
		}
	}
	let html = "<h1>" + competence.number + ": " + competence.name + "</h1>";
	html += competence.description;
	const lessonList = [];
	for(let i = 0; i < FIELDS.length; i++)
	{
		for(let j = 0; j < FIELDS[i].lessons.length; j++)
		{
			for(let k = 0; k < FIELDS[i].lessons[j].competences.length; k++)
			{
				if(FIELDS[i].lessons[j].competences[k] === competence.id)
				{
					lessonList.push(FIELDS[i].lessons[j]);
					break;
				}
			}
		}
	}
	html += renderCompetenceLessonList(lessonList);
	document.getElementById("content")!.innerHTML = html;

	const nodes = document.getElementById("content")!.getElementsByTagName("h3");
	for(let i = 0; i < nodes.length; i++)
	{
		(nodes[i].firstChild as HTMLElement).onclick = TOCLessonOnClick;
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
