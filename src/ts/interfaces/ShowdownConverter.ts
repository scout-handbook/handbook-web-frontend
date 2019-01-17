"use strict";

interface ShowdownConverter {
	setOption: (name: string, value: string) => void;
	makeHtml: (markdown: string) => string;
}
