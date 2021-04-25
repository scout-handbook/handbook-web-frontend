/* global navigationOpen:true */
/* exported navigationOpen, showCompetenceView */

function renderCompetenceLessonList(lessonList: IDList<Lesson>): string {
  let html = "";
  lessonList.iterate(function (id, lesson) {
    html +=
      '<h3 class="mainPage"><a title="' +
      lesson.name +
      '" href="enableJS.html" data-id="' +
      id +
      '">' +
      lesson.name +
      "</a></h3>";
    let first = true;
    COMPETENCES.filter(function (id) {
      return lesson.competences.indexOf(id) >= 0;
    }).iterate(function (_, competence) {
      if (first) {
        html +=
          '<span class="mainPage">Kompetence: ' + competence.number.toString();
        first = false;
      } else {
        html += ", " + competence.number.toString();
      }
    });
    html += "</span>";
  });
  return html;
}

function renderCompetenceView(id: string, noHistory: boolean): void {
  const competence = COMPETENCES.get(id)!;
  let html =
    "<h1>" + competence.number.toString() + ": " + competence.name + "</h1>";
  html += competence.description;
  const lessonList = LESSONS.filter(function (_, lesson) {
    return lesson.competences.indexOf(id) >= 0;
  });
  html += renderCompetenceLessonList(lessonList);
  document.getElementById("content")!.innerHTML = html;

  const nodes = document.getElementById("content")!.getElementsByTagName("h3");
  for (let i = 0; i < nodes.length; i++) {
    (nodes[i].firstChild as HTMLElement).onclick = TOCLessonOnClick;
  }

  document.getElementsByTagName("main")[0].scrollTop = 0;
  if (!noHistory) {
    history.pushState(
      { id: id },
      "title",
      "/competence/" +
        id +
        "/" +
        urlEscape(competence.number.toString() + "-" + competence.name)
    ); // eslint-disable-line compat/compat
  }
  document.getElementById("offlineSwitch")!.style.display = "none";
}

function showCompetenceView(id: string, noHistory: boolean): void {
  if (screen.width < 700) {
    navigationOpen = false;
    reflowNavigation();
  }
  metadataEvent.addCallback(function (): void {
    renderCompetenceView(id, noHistory);
  });
  refreshLogin();
}
