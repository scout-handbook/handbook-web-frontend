/* eslint strict: "off", no-unused-vars: "off" */

declare var CONFIG: Config;
declare var showdown: Showdown;
declare var WebFont: WebFont;
declare function competenceBubbleDetailOnClick(event: MouseEvent): boolean;
declare function filterXSS(html: string, options: XSSOptions): string;
declare function getLessonById(id: string): Lesson | null;
declare function reflowCompetenceBubbles(): void;
declare function showCompetenceListView(noHistory: boolean): void;
declare function showCompetenceView(id: string, noHistory: boolean): void;
declare function showFieldView(id: string, noHistory: boolean): void;
declare function showLessonListView(noHistory: boolean): void;
declare function toggleCompetenceBubble(event: MouseEvent): void;
declare function toggleLessonOffline(): void;
declare function urlEscape(str: string): string;
declare function xssOptions(): XSSOptions;