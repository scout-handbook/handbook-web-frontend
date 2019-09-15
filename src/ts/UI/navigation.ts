/* global navigationOpen:true */
/* exported navigationSetup */

let navigationOpen = true;

function reflowNavigation(): void
{
	const main = document.getElementsByTagName("main")[0].style;
	const navBar = document.getElementsByTagName("nav")[0].style;
	const overlay = document.getElementById("overlay")!.style;
	if(navigationOpen)
	{
		navBar.marginLeft = "0px"
		if(screen.width > 700)
		{
			main.marginLeft = CONFIG['custom-properties']['--nav-width'];
			overlay.display = "none";
		}
		else
		{
			main.marginLeft = "0px"
			overlay.display = "inline";
		}
	}
	else
	{
		navBar.marginLeft = "-" + CONFIG['custom-properties']['--nav-width'];
		main.marginLeft = "0px"
		overlay.display = "none";
	}
}

function toggleNavigation(): void
{
	navigationOpen = !navigationOpen;
	reflowNavigation();
}

function navigationSetup(): void
{
	window.addEventListener("resize", reflowNavigation)
	document.getElementById("navCloseButton")!.onclick = toggleNavigation;
	document.getElementById("overlay")!.onclick = toggleNavigation;
	document.getElementById("lessonOverview")!.onclick = function(): boolean
	{
		showFieldListView(false);
		return false;
	}
	document.getElementById("competenceOverview")!.onclick = function(): boolean
	{
		showCompetenceListView(false);
		return false;
	}
	reflowNavigation();
}
