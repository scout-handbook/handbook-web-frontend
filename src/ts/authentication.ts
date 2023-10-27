/* exported authenticationSetup, refreshLogin */

function logoutRedirect(): boolean {
  window.location.href = CONFIG["api-uri"] + "/v1.0/logout";
  return false;
}

function renderUserAccount(): void {
  document.getElementById("user-name")!.innerHTML = LOGINSTATE!.name;
  if (
    LOGINSTATE!.role === "editor" ||
    LOGINSTATE!.role === "administrator" ||
    LOGINSTATE!.role === "superuser"
  ) {
    document.getElementById("log-link")!.innerHTML =
      '<a href="enableJS.html">Odhlásit</a><a href="/admin" id="admin-link">Administrace</a>';
  } else {
    document.getElementById("log-link")!.innerHTML =
      '<a href="enableJS.html">Odhlásit</a>';
  }
  (document.getElementById("log-link")!.firstChild as HTMLElement).onclick =
    logoutRedirect;
  if (Object.prototype.hasOwnProperty.call(LOGINSTATE, "avatar")) {
    (document.getElementById("user-avatar") as HTMLImageElement).src =
      "data:image/png;base64," + LOGINSTATE!.avatar;
  } else {
    (document.getElementById("user-avatar") as HTMLImageElement).src =
      CONFIG["frontend-uri"] +
      "/" +
      CONFIG["frontend-resources-path"] +
      "/avatar.png";
  }
}

function loginRedirect(): boolean {
  window.location.href =
    CONFIG["api-uri"] +
    "/v1.0/login?return-uri=" +
    encodeURIComponent(window.location.href);
  return false;
}

function renderLoginForm(): void {
  document.getElementById("user-name")!.innerHTML = "Uživatel nepřihlášen";
  document.getElementById("log-link")!.innerHTML =
    '<a href="enableJS.html">Přihlásit</a>';
  (document.getElementById("log-link")!.firstChild as HTMLElement).onclick =
    loginRedirect;
  (document.getElementById("user-avatar") as HTMLImageElement).src =
    CONFIG["frontend-uri"] +
    "/" +
    CONFIG["frontend-resources-path"] +
    "/avatar.png";
}

function showAccountInfo(): void {
  loginstateEvent.addCallback((): void => {
    if (LOGINSTATE) {
      renderUserAccount();
    } else {
      renderLoginForm();
    }
  });
}

function authenticationSetup(): void {
  showAccountInfo();
}

function refreshLogin(): void {
  if (LOGINSTATE) {
    const allCookies = "; " + document.cookie;
    const parts = allCookies.split("; skautis_timeout=");
    if (parts.length === 2) {
      const timeout = parseInt(parts.pop()!.split(";").shift()!);
      if (timeout - Math.round(new Date().getTime() / 1000) < 1500) {
        request(CONFIG["api-uri"] + "/v1.0/refresh", "", {});
      }
    }
  }
}
