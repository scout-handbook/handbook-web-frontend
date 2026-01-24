/* exported COMPETENCES, CONFIG, FIELDS, LESSONS, LOGINSTATE */

/* eslint-disable @typescript-eslint/init-declarations -- Probably should be fixed when moving to modules */
let COMPETENCES: IDList<Competence>;
let FIELDS: IDList<Field>;
let LESSONS: IDList<Lesson>;
let LOGINSTATE: Loginstate | null;
/* eslint-enable */

const CONFIG = JSON.parse(
  document.documentElement.dataset["config"] ?? "{}",
) as Config;

function main(): void {
  navigationSetup();
  headerSetup();
  historySetup();
  authenticationSetup();
  metadataSetup();
  lessonViewSetup();
  setupTOC();
  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register(
      `${CONFIG["frontend-uri"]}/${
        CONFIG["frontend-resources-path"]
      }/serviceworker.min.js`,
    );
  }
  WebFont.load({
    google: {
      families: ["Open Sans:400,400i,700,700i"],
    },
  });
}

window.onload = main;
