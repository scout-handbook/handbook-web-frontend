/* global navigationOpen:true */
/* exported navigationSetup */

let navigationOpen = true;

function reflowNavigation(): void {
  const main = document.getElementsByTagName("main")[0];
  const navBar = document.getElementsByTagName("nav")[0];
  const overlay = document.getElementById("overlay")!.style;
  if (navigationOpen) {
    navBar.className = "";
    if (screen.width > 700) {
      main.className = "";
      overlay.display = "none";
    } else {
      overlay.display = "inline";
    }
  } else {
    main.className = "nav-closed";
    navBar.className = "nav-closed";
    overlay.display = "none";
  }
}

function toggleNavigation(): void {
  navigationOpen = !navigationOpen;
  reflowNavigation();
}

function navigationSetup(): void {
  window.addEventListener("resize", reflowNavigation);
  document.getElementById("nav-close-button")!.onclick = toggleNavigation;
  document.getElementById("overlay")!.onclick = toggleNavigation;
  document.getElementById("lessonOverview")!.onclick = function (): boolean {
    showFieldListView(false);
    return false;
  };
  document.getElementById("competenceOverview")!.onclick =
    function (): boolean {
      showCompetenceListView(false);
      return false;
    };
  reflowNavigation();
}
