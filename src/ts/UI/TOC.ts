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
	var html = "";
	FIELDS.iterate(function(id, field)
	{
		if(field.name)
		{
			html += "<h1><a title=\"" + field.name + "\" href=\"enableJS.html\" data-id=\"" + id + "\">" + field.name + "</a></h1>";
			for(var i = 0; i < field.lessons.length; i++)
			{
				var lesson = LESSONS.get(field.lessons[i])
				html += "<a class=\"secondLevel\" title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[i] + "\">" + lesson.name + "</a><br>";
			}
		}
		else
		{
			for(var j = 0; j < field.lessons.length; j++)
			{
				lesson = LESSONS.get(field.lessons[j]);
				html += "<a title=\"" + lesson.name + "\" href=\"enableJS.html\" data-id=\"" + field.lessons[j] + "\">" + lesson.name + "</a><br>";
			}
		}
	});
	document.getElementById("navigation")!.innerHTML = html;
	var nodes = document.getElementById("navigation")!.getElementsByTagName("a");
	for(var l = 0; l < nodes.length; l++)
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
