"use strict";

interface Converter {
	makeHtml: (markdown: string) => string;
	setOption: (name: string, value: string) => void;
	new (options: {extensions: Array<string>}): Converter;
}
