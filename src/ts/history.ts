/* exported historySetup */

function historyPopback(): void {
  if (history.state) {
    const state = history.state as HistoryState;
    if (window.location.pathname === "/competence") {
      showCompetenceListView(true);
    } else if (window.location.pathname.startsWith("/competence/")) {
      showCompetenceView(state.id!, true);
    } else if (window.location.pathname.startsWith("/field/")) {
      showFieldView(state.id!, true);
    } else if (window.location.pathname.startsWith("/lesson/")) {
      showLessonView(state.id!, true);
    } else {
      showFieldListView(true);
    }
  }
}

function historySetup(): void {
  window.onpopstate = historyPopback;
  if (window.location.pathname === "/competence") {
    showCompetenceListView(false);
  } else if (window.location.pathname.startsWith("/competence/")) {
    const competenceId = window.location.pathname.substring(12).split("/")[0];
    showCompetenceView(competenceId, false);
  } else if (window.location.pathname.startsWith("/field/")) {
    const fieldId = window.location.pathname.substring(7).split("/")[0];
    showFieldView(fieldId, false);
  } else if (window.location.pathname.startsWith("/lesson/")) {
    const lessonId = window.location.pathname.substring(8).split("/")[0];
    metadataEvent.addCallback(function (): void {
      showLessonView(lessonId, false);
    });
  } else {
    showFieldListView(false);
  }
}
