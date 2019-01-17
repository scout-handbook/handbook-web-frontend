"use strict";
/* exported authenticationSetup, refreshLogin */

function authenticationSetup(): void
{
	showAccountInfo();
}

function showAccountInfo(): void
{
	loginstateEvent.addCallback(function(): void
		{
			if(window.LOGINSTATE)
			{
				renderUserAccount();
			}
			else
			{
				renderLoginForm();
			}
		});
}

function renderUserAccount(): void
{
	document.getElementById("userName")!.innerHTML = LOGINSTATE.name;
	if(LOGINSTATE.role === "editor" || LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Odhlásit</a><a href=\"/admin\" id=\"adminLink\">Administrace</a>";
	}
	else
	{
		document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Odhlásit</a>";
	}
	(document.getElementById("logLink")!.firstChild as HTMLElement).onclick = logoutRedirect;
	if(LOGINSTATE.hasOwnProperty("avatar"))
	{
		(document.getElementById("userAvatar") as HTMLImageElement).src = "data:image/png;base64," + LOGINSTATE.avatar;
	}
	else
	{
		(document.getElementById("userAvatar") as HTMLImageElement).src = CONFIG['frontend-uri'] + "/avatar.png";
	}
}

function renderLoginForm(): void
{
	document.getElementById("userName")!.innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Přihlásit</a>";
	(document.getElementById("logLink")!.firstChild as HTMLElement).onclick = loginRedirect;
	(document.getElementById("userAvatar") as HTMLImageElement).src = CONFIG['frontend-uri'] + "/avatar.png";
}

function loginRedirect(): boolean
{
	window.location.href = CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location.href);
	return false;
}

function logoutRedirect(): boolean
{
	window.location.href = CONFIG.apiuri + "/logout";
	return false;
}

function refreshLogin(): void
{
	if(window.LOGINSTATE)
	{
		var allCookies = "; " + document.cookie;
		var parts = allCookies.split("; skautis_timeout=");
		if(parts.length === 2)
		{
			var timeout = parseInt(parts.pop()!.split(";").shift()!);
			if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
			{
				request(CONFIG.apiuri + "/refresh", "", {});
			}
		}
	}
}
