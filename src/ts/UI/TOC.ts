/* exported TOCSetup */

function TOCFieldOnClick(event: MouseEvent): boolean
{
	showFieldView((event.target as HTMLElement).dataset.id!, false);
	return false;
}

function TOCLessonOnClick(event: MouseEvent): boolean
{
	showLessonView((event.target as HTMLElement).dataset.id!, false);
	return false;
}

function renderTOC(): void
{
	let html = "";
	for(let i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].name)
		{
			html += "<h1><a title=\"" + FIELDS[i].name + "\" href=\"enableJS.html\" data-id=\"" + FIELDS[i].id + "\">" + FIELDS[i].name + "</a></h1>";
			for(let j = 0; j < FIELDS[i].lessons.length; j++)
			{
				html += "<a class=\"secondLevel\" title=\"" + FIELDS[i].lessons[j].name + "\" href=\"enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a><br>";
			}
		}
		else
		{
			for(let k = 0; k < FIELDS[i].lessons.length; k++)
			{
				html += "<a title=\"" + FIELDS[i].lessons[k].name + "\" href=\"enableJS.html\" data-id=\"" + FIELDS[i].lessons[k].id + "\">" + FIELDS[i].lessons[k].name + "</a><br>";
			}
		}
	}
	document.getElementById("navigation")!.innerHTML = html;
	const nodes = document.getElementById("navigation")!.getElementsByTagName("a");
	for(let l = 0; l < nodes.length; l++)
	{
		if(nodes[l].parentElement!.tagName === "H1")
		{
			nodes[l].onclick = TOCFieldOnClick;
		}
		else
		{
			nodes[l].onclick = TOCLessonOnClick;
		}
	}
	document.getElementsByTagName("nav")[0].style.transition = "margin-left 0.3s ease";
}

function TOCSetup(): void
{
	metadataEvent.addCallback(renderTOC);
}
