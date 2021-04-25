/* global activeCompetence:true */
/* exported toggleLessonOffline, toggleCompetenceBubble, competenceBubbleDetailOnClick */

function toggleLessonOffline(): void {
  const checked = (document.getElementById("cacheOffline") as HTMLInputElement)
    .checked;
  if (window.location.pathname.substring(0, 8) === "/lesson/") {
    const id = window.location.pathname.substring(8).split("/")[0];
    void caches.open(CONFIG.cache).then(function (cache): void {
      if (checked) {
        void cache.add(
          new Request(CONFIG["api-uri"] + "/v1.0/lesson/" + id, {
            credentials: "same-origin",
          })
        );
      } else {
        void cache.delete(CONFIG["api-uri"] + "/v1.0/lesson/" + id);
      }
    });
  }
}

function reflowCompetenceBubbles(): void {
  if (activeCompetence) {
    const fontSize = parseFloat(
      window.getComputedStyle(activeCompetence).getPropertyValue("font-size")
    );
    const parent = activeCompetence.parentElement as HTMLElement;
    (activeCompetence.childNodes[1] as HTMLElement).style.width =
      Math.min(
        403 - 1.3 * fontSize,
        (activeCompetence.parentElement as HTMLElement).clientWidth -
          1.3 * fontSize +
          3
      ).toString() + "px";
    (activeCompetence.childNodes[2] as HTMLElement).style.width =
      Math.min(
        403 - 1.3 * fontSize,
        parent.clientWidth - 1.3 * fontSize + 3
      ).toString() + "px";
    activeCompetence.style.width =
      Math.min(400, parent.clientWidth).toString() + "px";
    activeCompetence.style.height =
      (
        (activeCompetence.childNodes[1] as HTMLElement).offsetHeight +
        1.4 * fontSize -
        6
      ).toString() + "px";
  }
}

function toggleCompetenceBubble(event: MouseEvent): void {
  let element = event.target as HTMLElement;
  while (
    !element.classList.contains("competenceBubble") &&
    (element = element.parentElement!)
  ) {
    /* Empty */
  }
  if (element.style.width !== "") {
    activeCompetence = null;
    (element.childNodes[1] as HTMLElement).style.width = "";
    element.style.width = "";
    element.style.height = "";
    (element.firstChild as HTMLElement).style.color = "";
    element.style.borderColor = "";
    element.style.backgroundColor = "";
  } else {
    const nodes = document
      .getElementById("content")!
      .getElementsByClassName("competenceBubble");
    for (let i = 0; i < nodes.length; i++) {
      (nodes[i].childNodes[1] as HTMLElement).style.width = "";
      (nodes[i] as HTMLElement).style.width = "";
      (nodes[i] as HTMLElement).style.height = "";
      (nodes[i].firstChild as HTMLElement).style.color = "";
      (nodes[i] as HTMLElement).style.borderColor = "";
      (nodes[i] as HTMLElement).style.backgroundColor = "";
    }
    activeCompetence = element;
    reflowCompetenceBubbles();
    (element.firstChild as HTMLElement).style.color =
      CONFIG["custom-properties"]["--accent-color"];
    element.style.borderColor = CONFIG["custom-properties"]["--accent-color"];
    element.style.backgroundColor = "#f5f5f5";
  }
}

function competenceBubbleDetailOnClick(event: MouseEvent): boolean {
  showCompetenceView((event.target as HTMLElement).dataset.id!, false);
  return false;
}
