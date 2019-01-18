"use strict";
/* exported historySetup */

function historySetup(): void
{
	window.onpopstate = historyPopback;
	if(window.location.pathname === "/competence")
	{
		showCompetenceListView(false);
	}
	else if(window.location.pathname.substring(0, 12) === "/competence/")
	{
		var competenceId = window.location.pathname.substring(12).split("/")[0];
		showCompetenceView(competenceId, false);
	}
	else if(window.location.pathname.substring(0, 7) === "/field/")
	{
		var fieldId = window.location.pathname.substring(7).split("/")[0];
		showFieldView(fieldId, false);
	}
	else if(window.location.pathname.substring(0, 8) === "/lesson/")
	{
		var lessonId = window.location.pathname.substring(8).split("/")[0];
		metadataEvent.addCallback(function(): void
			{
				showLessonView(lessonId, false);
			});
	}
	else
	{
		showFieldListView(false);
	}
}

function historyPopback(): void
{
	if(history.state)
	{
		if(window.location.pathname === "/competence")
		{
			showCompetenceListView(true);
		}
		else if(window.location.pathname.substring(0, 12) === "/competence/")
		{
			showCompetenceView(history.state.id, true);
		}
		else if(window.location.pathname.substring(0, 7) === "/field/")
		{
			showFieldView(history.state.id, true);
		}
		else if(window.location.pathname.substring(0, 8) === "/lesson/")
		{
			showLessonView(history.state.id, true);
		}
		else
		{
			showFieldListView(true);
		}
	}
}
