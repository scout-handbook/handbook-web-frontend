"use strict";

interface Showdown {
	extension: (name: string, extension: () => Array<object>) => void;
	Converter: Converter;
}
