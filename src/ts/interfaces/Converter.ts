"use strict";

interface Converter {
	new (options: {extensions: Array<string>}): Converter;
	setOption: (name: string, value: string) => void;
	makeHtml: (markdown: string) => string;
}
