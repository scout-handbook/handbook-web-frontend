/* exported authenticationSetup, refreshLogin */

function logoutRedirect(): boolean
{
	window.location.href = CONFIG.apiuri + "/logout";
	return false;
}

function renderUserAccount(): void
{
	document.getElementById("userName")!.innerHTML = LOGINSTATE!.name;
	if(LOGINSTATE!.role === "editor" || LOGINSTATE!.role === "administrator" || LOGINSTATE!.role === "superuser")
	{
		document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Odhlásit</a><a href=\"/admin\" id=\"adminLink\">Administrace</a>";
	}
	else
	{
		document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Odhlásit</a>";
	}
	(document.getElementById("logLink")!.firstChild as HTMLElement).onclick = logoutRedirect;
	if(Object.prototype.hasOwnProperty.call(LOGINSTATE, "avatar"))
	{
		(document.getElementById("userAvatar") as HTMLImageElement).src = "data:image/png;base64," + LOGINSTATE!.avatar;
	}
	else
	{
		(document.getElementById("userAvatar") as HTMLImageElement).src = CONFIG['frontend-uri'] + "/avatar.png";
	}
}

function loginRedirect(): boolean
{
	window.location.href = CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location.href);
	return false;
}

function renderLoginForm(): void
{
	document.getElementById("userName")!.innerHTML = "Uživatel nepřihlášen";
	document.getElementById("logLink")!.innerHTML = "<a href=\"enableJS.html\">Přihlásit</a>";
	(document.getElementById("logLink")!.firstChild as HTMLElement).onclick = loginRedirect;
	(document.getElementById("userAvatar") as HTMLImageElement).src = CONFIG['frontend-uri'] + "/avatar.png";
}

function showAccountInfo(): void
{
	loginstateEvent.addCallback(function(): void
	{
		if(LOGINSTATE)
		{
			renderUserAccount();
		}
		else
		{
			renderLoginForm();
		}
	});
}

function authenticationSetup(): void
{
	showAccountInfo();
}

function refreshLogin(): void
{
	if(LOGINSTATE)
	{
		const allCookies = "; " + document.cookie;
		const parts = allCookies.split("; skautis_timeout=");
		if(parts.length === 2)
		{
			const timeout = parseInt(parts.pop()!.split(";").shift()!);
			if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
			{
				request(CONFIG.apiuri + "/refresh", "", {});
			}
		}
	}
}
