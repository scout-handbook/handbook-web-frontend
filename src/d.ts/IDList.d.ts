declare class IDList<T>
{
	public iterate(iterator: (key: string, value: T) => void): void;
	public filter(filter: (key: string, value: T) => boolean): IDList<T>;
	public get(key: string): T;
	public push(key: string, value: T): void;
}
