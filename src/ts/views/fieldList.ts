/* global navigationOpen:true */
/* exported navigationOpen showFieldListView */

function renderFullFieldList(): string
{
	let html = "<div class=\"field-list-container\"><div id=\"field-list-col1\" class=\"field-list-col\">";
	for(let i = 0; i < FULLFIELDS.length; i++)
	{
		html += "<div class=\"field-card\" data-id=\"" + FULLFIELDS[i].id + "\">"
		html += "<img src=\"" + CONFIG.apiuri + "/image/" + FULLFIELDS[i].image + "\">";
		html += "<h2 class=\"field-card-heading\">";
		html += FULLFIELDS[i].name;
		html += "</h2><div class=\"field-card-lesson-count\">";
		for(let j = 0; j < FIELDS.length; j++)
		{
			if(FULLFIELDS[i].id === FIELDS[j].id)
			{
				const count = FIELDS[j].lessons.length;
				if(count > 0)
				{
					html += count.toString() + (count < 5 ? " lekce" : " lekcí");
				}
				break;
			}
		}
		html += "</div><div class=\"field-card-description\">";
		html += FULLFIELDS[i].description;
		html += "</div></div>";
	}
	html += "</div><div id=\"field-list-col2\" class=\"field-list-col\"></div></div>";
	return html;
}

function fieldListOnClick(event: MouseEvent): boolean
{
	let el = event.target as HTMLElement;
	while(!Object.prototype.hasOwnProperty.call(el.dataset, 'id'))
	{
		el = el.parentElement!;
	}
	showFieldView(el.dataset.id!, false);
	return false;
}

function renderFieldListView(noHistory: boolean): void
{
	let html = "<h1>" + CONFIG["site-name"] + "</h1>";
	html += renderFullFieldList();
	document.getElementById("content")!.innerHTML = html;
	const nodes = document.getElementById("content")!.getElementsByClassName("field-card");
	const height = nodes.length / 2;
	for(let l = nodes.length - 1; l >= 0; l--)
	{
		(nodes[l] as HTMLElement).onclick = fieldListOnClick;
		if(l > height) {
			const col = document.getElementById("field-list-col2")!;
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
