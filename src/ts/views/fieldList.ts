/* global navigationOpen:true */
/* exported navigationOpen showFieldListView */

function renderFieldList(): string {
  let html =
    '<div class="field-list-container"><div id="field-list-col1" class="field-list-col">';
  FIELDS.iterate(function (id, field) {
    html += '<div class="field-card" data-id="' + id + '">';
    html +=
      '<img src="' + CONFIG["api-uri"] + "/v1.0/image/" + field.image + '">';
    html += '<h2 class="field-card-heading">';
    html += field.name;
    html += '</h2><div class="field-card-lesson-count">';
    const count = field.lessons.length;
    if (count > 0) {
      html += count.toString() + (count < 5 ? " lekce" : " lekcí");
    }
    html += '</div><div class="field-card-description">';
    html += field.description;
    html += "</div></div>";
  });
  html += '</div><div id="field-list-col2" class="field-list-col"></div></div>';
  return html;
}

function fieldListOnClick(event: MouseEvent): boolean {
  let el = event.target as HTMLElement;
  while (!Object.prototype.hasOwnProperty.call(el.dataset, "id")) {
    el = el.parentElement!;
  }
  showFieldView(el.dataset.id!, false);
  return false;
}

function renderFieldListView(noHistory: boolean): void {
  let html = "<h1>" + CONFIG["site-name"] + "</h1>";
  html += renderFieldList();
  document.getElementById("content")!.innerHTML = html;
  const nodes = document
    .getElementById("content")!
    .getElementsByClassName("field-card");
  const height = nodes.length / 2;
  for (let i = nodes.length - 1; i >= 0; i--) {
    (nodes[i] as HTMLElement).onclick = fieldListOnClick;
    if (i > height) {
      const col = document.getElementById("field-list-col2")!;
      col.insertBefore(nodes[i], col.firstChild);
    }
  }
  document.getElementsByTagName("main")[0].scrollTop = 0;
  if (!noHistory) {
    history.pushState({}, "title", "/");
  }
  document.getElementById("offlineSwitch")!.style.display = "none";
}

function showFieldListView(noHistory: boolean): void {
  if (screen.width < 700) {
    navigationOpen = false;
    reflowNavigation();
  }
  metadataEvent.addCallback(function () {
    renderFieldListView(noHistory);
  });
  refreshLogin();
}
