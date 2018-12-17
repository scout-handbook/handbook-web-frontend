"use strict";
/* exported showLessonListView */

function showLessonListView(noHistory)
{
	if(screen.width < 700)
	{
		window.navigationOpen = false;
		reflowNavigation();
	}
	metadataEvent.addCallback(function()
		{
			renderLessonListView(noHistory);
		});
	refreshLogin();
}

function renderLessonListView(noHistory)
{
	var html = "<h1>OdyMateriály</h1>";
	html += renderFieldList();
	document.getElementById("content").innerHTML = html;

	var nodes = document.getElementById("content").getElementsByTagName("a");
	for(var l = 0; l < nodes.length; l++)
	{
		if(nodes[l].parentElement.tagName === "H2")
		{
			nodes[l].onclick = TOCFieldOnClick;
		}
		else
		{
			nodes[l].onclick = TOCLessonOnClick;
		}
	}

	document.getElementsByTagName("main")[0].scrollTop = 0;
	if(!noHistory)
	{
		history.pushState({}, "title", "/");
	}
	document.getElementById("offlineSwitch").style.display = "none";
}

function renderFieldList()
{
	var html = "";
	for(var i = 0; i < FIELDS.length; i++)
	{
		var secondLevel = "";
		if(FIELDS[i].name)
		{
			secondLevel = " secondLevel";
			html += "<h2 class=\"mainPage\"><a title=\"" + FIELDS[i].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].id + "\">" + FIELDS[i].name + "</a></h2>";
		}
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			html += "<h3 class=\"mainPage" + secondLevel + "\"><a title=\"" + FIELDS[i].lessons[j].name + "\" href=\"/error/enableJS.html\" data-id=\"" + FIELDS[i].lessons[j].id + "\">" + FIELDS[i].lessons[j].name + "</a></h3>";
			html += renderLessonCompetences(FIELDS[i].lessons[j], secondLevel);
		}
	}
	return html;
}

function renderLessonCompetences(lesson, secondLevel)
{
	var html = "";
	if(lesson.competences.length > 0)
	{
		var competences = [];
		for(var k = 0; k < COMPETENCES.length; k++)
		{
			if(lesson.competences.indexOf(COMPETENCES[k].id) >= 0)
			{
				competences.push(COMPETENCES[k]);
			}
		}
		html += "<span class=\"mainPage" + secondLevel + "\">Kompetence: " + competences[0].number;
		for(var m = 1; m < competences.length; m++)
		{
			html += ", " + competences[m].number;
		}
		html += "</span>";
	}
	return html;
}
