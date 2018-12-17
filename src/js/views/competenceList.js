"use strict";
/* exported showCompetenceListView */

function showCompetenceListView(noHistory)
{
	if(screen.width < 700)
	{
		window.navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
		{
			renderCompetenceListView(noHistory);
		});
	refreshLogin();
}

function renderCompetenceListView(noHistory)
{
	var html = "<h1>Přehled kompetencí</h1>";
	html += renderCompetenceList();
	document.getElementById("content").innerHTML = html;

	var nodes = document.getElementById("content").getElementsByTagName("a");
	for(var l = 0; l < nodes.length; l++)
	{
		nodes[l].onclick = competenceBubbleDetailOnClick;
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/competence");
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function renderCompetenceList()
{
	var html = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		html += "<h3 class=\"mainPage\"><a title=\"" + COMPETENCES[i].number + ": " + COMPETENCES[i].name + "\" href=\"/error/enableJS.html\" data-id=\"" + COMPETENCES[i].id + "\">" + COMPETENCES[i].number + ": " + COMPETENCES[i].name + "</a></h3>";
		html += "<span class=\"mainPage\">" + COMPETENCES[i].description;
	}
	return html;
}
