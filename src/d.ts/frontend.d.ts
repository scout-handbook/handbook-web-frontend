/* eslint strict: "off", no-unused-vars: "off" */

declare var COMPETENCES: Array<Competence>;
declare var CONFIG: Config;
declare var FIELDS: Array<Field>;
declare var activeCompetence: HTMLElement | null;
declare var metadataEvent: AfterLoadEvent;
declare var navigationOpen: boolean;
declare function reflowNavigation(): void;
declare function refreshLogin(): void;
declare function TOCFieldOnClick(event: MouseEvent): boolean;
declare function TOCLessonOnClick(event: MouseEvent): boolean;
