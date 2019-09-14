/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceView */

function renderCompetenceLessonList(lessonList: Array<Lesson>): string
{
	let html = "";
	for(let n = 0; n < lessonList.length; n++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + lessonList[n].name + "\" href=\"enableJS.html\" data-id=\"" + lessonList[n].id + "\">" + lessonList[n].name + "</a></h3>";
		if(lessonList[n].competences.length > 0)
		{
			const competences = [];
			for(let o = 0; o < COMPETENCES.length; o++)
			{
				if(lessonList[n].competences.indexOf(COMPETENCES[o].id) >= 0)
				{
					competences.push(COMPETENCES[o]);
				}
			}
			html += "<span class=\"mainPage\">Kompetence: " + competences[0].number;
			for(let p = 1; p < competences.length; p++)
			{
				html += ", " + competences[p].number;
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
	for(let j = 0; j < FIELDS.length; j++)
	{
		for(let k = 0; k < FIELDS[j].lessons.length; k++)
		{
			for(let m = 0; m < FIELDS[j].lessons[k].competences.length; m++)
			{
				if(FIELDS[j].lessons[k].competences[m] === competence.id)
				{
					lessonList.push(FIELDS[j].lessons[k]);
					break;
				}
			}
		}
	}
	html += renderCompetenceLessonList(lessonList);
	document.getElementById("content")!.innerHTML = html;

	const nodes = document.getElementById("content")!.getElementsByTagName("h3");
	for(let l = 0; l < nodes.length; l++)
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
