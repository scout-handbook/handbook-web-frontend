"use strict";

interface WebFont {
	load: (font: {google: {families: Array<string>}}) => void;
}
