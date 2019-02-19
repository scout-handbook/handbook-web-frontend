/* global navigationOpen:true */
/* exported showFieldListView */

function renderFullFieldList(): string
{
	var html = "<div id=\"field-list-col1\" class=\"field-list-col\">";
	for(var i = 0; i < FULLFIELDS.length; i++)
	{
		html += "<div class=\"field-card\" data-id=\"" + FULLFIELDS[i].id + "\">"
		html += "<img class=\"field-card-image\" src=\"" + CONFIG.apiuri + "/image/" + FULLFIELDS[i].image + "\">";
		html += "<h2 class=\"field-card-heading\">";
		html += FULLFIELDS[i].name;
		html += "</h2><div class=\"field-card-description\">";
		html += "Lorem ipsum dolor sit amet consectetur adipiscing elit.";
		html += "</div></div>";
	}
	html += "</div><div id=\"field-list-col2\" class=\"field-list-col\"></div>";
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
	html += renderFullFieldList();
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
		history.pushState({}, "title", "/");
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
