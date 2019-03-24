/* global navigationOpen:true */
/* exported navigationOpen showFieldListView */

function renderFieldList(): string
{
	var html = "<div class=\"field-list-container\"><div id=\"field-list-col1\" class=\"field-list-col\">";
	FIELDS.iterate(function(id, field)
	{
		html += "<div class=\"field-card\" data-id=\"" + id + "\">"
		html += "<img src=\"" + CONFIG.apiuri + "/image/" + field.image + "\">";
		html += "<h2 class=\"field-card-heading\">";
		html += field.name;
		html += "</h2><div class=\"field-card-lesson-count\">";
		var count = field.lessons.length;
		if(count > 0)
		{
			html += count + (count < 5 ? " lekce" : " lekcí");
		}
		html += "</div><div class=\"field-card-description\">";
		html += field.description;
		html += "</div></div>";
	});
	html += "</div><div id=\"field-list-col2\" class=\"field-list-col\"></div></div>";
	return html;
}

function fieldListOnClick(event: MouseEvent): boolean
{
	var el = event.target as HTMLElement;
	while(!el.dataset.hasOwnProperty('id'))
	{
		el = el.parentElement!;
	}
	showFieldView(el.dataset.id!, false);
	return false;
}

function renderFieldListView(noHistory: boolean): void
{
	var html = "<h1>" + CONFIG["site-name"] + "</h1>";
	html += renderFieldList();
	document.getElementById("content")!.innerHTML = html;
	var nodes = document.getElementById("content")!.getElementsByClassName("field-card");
	var height = nodes.length / 2;
	for(var l = nodes.length - 1; l >= 0; l--)
	{
		(nodes[l] as HTMLElement).onclick = fieldListOnClick;
		if(l > height) {
			var col = document.getElementById("field-list-col2")!;
			col.insertBefore(nodes[l], col.firstChild);
		}
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/"); // eslint-disable-line compat/compat
	}
	document.getElementById("offlineSwitch")!.style.display = "none";
}

function showFieldListView(noHistory: boolean): void
{
	if(screen.width < 700)
	{
		navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
	{
		renderFieldListView(noHistory);
	});
	refreshLogin();
}
