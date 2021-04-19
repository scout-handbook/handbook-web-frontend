declare class AfterLoadEvent
{
	public addCallback(callback: (...args: Array<RequestResponse|string>) => void): void;
	public trigger(...args: Array<RequestResponse|string>): void;
	public retrigger(...args: Array<RequestResponse|string>): void;
}
