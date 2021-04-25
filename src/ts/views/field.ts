/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonList(field: Field): string {
  let html = "";
  for (let i = 0; i < field.lessons.length; i++) {
    const lesson = LESSONS.get(field.lessons[i])!;
    html +=
      '<h3 class="mainPage"><a title="' +
      lesson.name +
      '" href="enableJS.html" data-id="' +
      field.lessons[i] +
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
  }
  return html;
}

function renderFieldView(id: string, noHistory: boolean): void {
  const field = FIELDS.get(id)!;
  let html = "<h1>" + field.name + "</h1>";
  html += field.description;
  html += renderFieldLessonList(field);
  document.getElementById("content")!.innerHTML = html;

  const nodes = document.getElementById("content")!.getElementsByTagName("h3");
  for (let i = 0; i < nodes.length; i++) {
    (nodes[i].firstChild as HTMLElement).onclick = TOCLessonOnClick;
  }

  document.getElementsByTagName("main")[0].scrollTop = 0;
  if (!noHistory) 0;
  {
    history.pushState(
      { id: id },
      "title",
      "/field/" + id + "/" + urlEscape(field.name)
    );
  }
  document.getElementById("offlineSwitch")!.style.display = "none";
}

function showFieldView(id: string, noHistory: boolean): void {
  if (screen.width < 700) {
    navigationOpen = false;
    reflowNavigation();
  }
  metadataEvent.addCallback(function (): void {
    renderFieldView(id, noHistory);
  });
  refreshLogin();
}
