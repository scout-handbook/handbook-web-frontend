"use strict";

interface XSSOptions {
	onIgnoreTagAttr: (tag: string, name: string, value: string, isWhiteAttr: boolean) => string;
}
