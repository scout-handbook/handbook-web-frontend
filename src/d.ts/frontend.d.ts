/// <reference types="xss" />
declare var COMPETENCES: Array<Competence>;
declare var CONFIG: Config;
declare var FULLFIELDS: IDList<FullField>;
declare var LESSONS: IDList<Lesson>;
declare var activeCompetence: HTMLElement | null;
declare var metadataEvent: AfterLoadEvent;
declare var navigationOpen: boolean;
declare function reflowNavigation(): void;
declare function refreshLogin(): void;
declare function TOCFieldOnClick(event: MouseEvent): boolean;
declare function TOCLessonOnClick(event: MouseEvent): boolean;
