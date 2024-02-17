/* exported setupTOC */

function fieldOnClick(event: MouseEvent): boolean {
  showFieldView((event.target as HTMLElement).dataset.id!, false);
  return false;
}

function lessonOnClick(event: MouseEvent): boolean {
  showLessonView((event.target as HTMLElement).dataset.id!, false);
  return false;
}

function renderTOC(): void {
  let html = "";
  LESSONS.iterate((id, lesson) => {
    let inField = false;
    FIELDS.iterate((_, field) => {
      if (field.lessons.indexOf(id) >= 0) {
        inField = true;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TypeScript doesn't infer the changing value in a loop
    if (!inField) {
      html +=
        '<a title="' +
        lesson.name +
        '" href="enableJS.html" data-id="' +
        id +
        '">' +
        lesson.name +
        "</a><br>";
    }
  });
  FIELDS.iterate((id, field) => {
    html +=
      '<h1><a title="' +
      field.name +
      '" href="enableJS.html" data-id="' +
      id +
      '">' +
      field.name +
      "</a></h1>";
    for (const fieldLesson of field.lessons) {
      const lesson = LESSONS.get(fieldLesson)!;
      html +=
        '<a class="second-level" title="' +
        lesson.name +
        '" href="enableJS.html" data-id="' +
        fieldLesson +
        '">' +
        lesson.name +
        "</a><br>";
    }
  });
  document.getElementById("navigation")!.innerHTML = html;
  const nodes = document
    .getElementById("navigation")!
    .getElementsByTagName("a");
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- HTMLCollectionOf is not iterable in old browsers
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].parentElement!.tagName === "H1") {
      nodes[i].onclick = fieldOnClick;
    } else {
      nodes[i].onclick = lessonOnClick;
    }
  }
  document.getElementsByTagName("nav")[0].style.transition =
    "margin-left 0.3s ease";
}

function setupTOC(): void {
  metadataEvent.addCallback(renderTOC);
}
