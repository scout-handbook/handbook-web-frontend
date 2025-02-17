/* global navigationOpen:true */
/* exported navigationOpen, showFieldView */

function renderFieldLessonCompetences(lesson: Lesson): string {
  let first = true;
  let html = "";
  COMPETENCES.filter((id) => lesson.competences.indexOf(id) >= 0).iterate(
    (_, competence) => {
      if (first) {
        html += `<span class="main-page">Body: ${competence.number.toString()}`;
        first = false;
      } else {
        html += `, ${competence.number.toString()}`;
      }
    },
  );
  return html;
}

function renderFieldLessonList(field: Field): string {
  let html = "";
  for (const fieldLesson of field.lessons) {
    const lesson = LESSONS.get(fieldLesson)!;
    html += `<h3 class="main-page"><a title="${
      lesson.name
    }" href="enableJS.html" data-id="${fieldLesson}">${lesson.name}</a></h3>`;
    html += renderFieldLessonCompetences(lesson);
    html += "</span>";
  }
  return html;
}

function renderFieldView(id: string, noHistory: boolean): void {
  const field = FIELDS.get(id)!;
  let html = `<h1>${field.name}</h1>`;
  html += field.description;
  html += renderFieldLessonList(field);
  document.getElementById("content")!.innerHTML = html;

  const nodes = document.getElementById("content")!.getElementsByTagName("h3");
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- HTMLCollectionOf is not iterable in old browsers
  for (let i = 0; i < nodes.length; i++) {
    (nodes[i].firstChild as HTMLElement).onclick = lessonOnClick;
  }

  document.getElementsByTagName("main")[0].scrollTop = 0;
  if (!noHistory) {
    history.pushState({ id }, "title", `/field/${id}/${urlEscape(field.name)}`);
  }
  document.getElementById("offline-switch")!.style.display = "none";
}

function showFieldView(id: string, noHistory: boolean): void {
  if (screen.width < 700) {
    navigationOpen = false;
    reflowNavigation();
  }
  metadataEvent.addCallback((): void => {
    renderFieldView(id, noHistory);
  });
  refreshLogin();
}
