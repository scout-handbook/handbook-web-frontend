"use strict";

function showFieldListView(noHistory)
{
	if(screen.width < 700)
	{
		window.navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
		{
			renderFieldListView(noHistory);
		});
	refreshLogin();
}

function renderFieldListView(noHistory)
{
	var html = "<h1>" + CONFIG["site-name"] + "</h1>";
	html += renderFullFieldList();
	document.getElementById("content").innerHTML = html;

	var nodes = document.getElementById("content").getElementsByClassName("field-card");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = fieldListOnClick;
	}
	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function fieldListOnClick(event) {
	var el = event.target;
	while(!el.dataset.hasOwnProperty('id'))
	{
		el = el.parentElement;
	}
	showFieldView(el.dataset.id);
	return false;
}

function renderFullFieldList()
{
	var html = "";
	for(var i = 0; i < FULLFIELDS.length; i++)
	{
		html += "<div class=\"field-card\" data-id=\"" + FULLFIELDS[i].id + "\">"
		html += "<img class=\"field-card-image\" src=\"" + CONFIG.apiuri + "/image/" + FULLFIELDS[i].image + "\">";
		html += "<svg width=\"" + CONFIG['custom-properties']['--field-card-width'] + "\" height=\"" + CONFIG['custom-properties']['--field-card-height'] + "\" viewBox=\"0 " + (CONFIG['custom-properties']['--field-card-height'] - CONFIG['custom-properties']['--field-card-overlay-height']) + " " + CONFIG['custom-properties']['--field-card-width'] + " " + CONFIG['custom-properties']['--field-card-height'] + "\" class=\"field-card-svg\">";
		html += "<defs>";
		html += "<filter id=\"blur\">";
		html += "<feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"3\" />";
		html += "</filter>";
		html += "</defs>";
		html += "<image filter=\"url(#blur)\" xlink:href=\"" + CONFIG.apiuri + "/image/" + FULLFIELDS[i].image + "\" x=\"0\" y=\"0\" height=\"" + CONFIG['custom-properties']['--field-card-height'] + "px\" width=\"" + CONFIG['custom-properties']['--field-card-width'] + "px\" preserveAspectRatio=\"none\" />";
		html += "</svg>";
		html += "<div class=\"field-card-overlay\">";
		html += FULLFIELDS[i].name;
		html += "</div>";
		html += "</div>";
	}
	return html;
}
