/// <reference types="xss" />
declare const COMPETENCES: Array<Competence>;
declare const CONFIG: Config;
declare const FIELDS: Array<Field>;
declare let activeCompetence: HTMLElement | null;
declare const metadataEvent: AfterLoadEvent;
declare let navigationOpen: boolean;
declare function reflowNavigation(): void;
declare function refreshLogin(): void;
declare function TOCFieldOnClick(event: MouseEvent): boolean;
declare function TOCLessonOnClick(event: MouseEvent): boolean;
