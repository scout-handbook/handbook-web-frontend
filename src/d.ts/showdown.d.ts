declare namespace showdown {
	const extension: (name: string, extension: () => Array<object>) => void;
	export class Converter{
		public makeHtml: (markdown: string) => string;
		public setOption: (name: string, value: string) => void;
		public constructor (options: {extensions: Array<string>});
	}
}
