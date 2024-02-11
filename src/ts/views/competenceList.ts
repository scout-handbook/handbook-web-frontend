/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceListView */

function renderCompetenceList(): string {
  let html = "";
  COMPETENCES.iterate((id, competence) => {
    html +=
      '<h3 class="main-page"><a title="' +
      competence.number.toString() +
      ": " +
      competence.name +
      '" href="enableJS.html" data-id="' +
      id +
      '">' +
      competence.number.toString() +
      ": " +
      competence.name +
      "</a></h3>";
    html += '<span class="main-page">' + competence.description;
  });
  return html;
}

function renderCompetenceListView(noHistory: boolean): void {
  let html = "<h1>Přehled bodů</h1>";
  html += renderCompetenceList();
  document.getElementById("content")!.innerHTML = html;

  const nodes = document.getElementById("content")!.getElementsByTagName("a");
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onclick = competenceBubbleDetailOnClick;
  }

  document.getElementsByTagName("main")[0].scrollTop = 0;
  if (!noHistory) {
    history.pushState({}, "title", "/competence");
  }
  document.getElementById("offline-switch")!.style.display = "none";
}

function showCompetenceListView(noHistory: boolean): void {
  if (screen.width < 700) {
    navigationOpen = false;
    reflowNavigation();
  }
  metadataEvent.addCallback((): void => {
    renderCompetenceListView(noHistory);
  });
  refreshLogin();
}
