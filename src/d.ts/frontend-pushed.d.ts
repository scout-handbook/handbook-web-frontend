/// <reference types="xss" />
declare const CONFIG: Config;
declare function competenceBubbleDetailOnClick(event: MouseEvent): boolean;
declare function reflowCompetenceBubbles(): void;
declare function showCompetenceListView(noHistory: boolean): void;
declare function showCompetenceView(id: string, noHistory: boolean): void;
declare function showFieldListView(noHistory: boolean): void;
declare function showFieldView(id: string, noHistory: boolean): void;
declare function toggleCompetenceBubble(event: MouseEvent): void;
declare function toggleLessonOffline(): void;
declare function urlEscape(str: string): string;
declare function xssOptions(): XSS.IFilterXSSOptions;
