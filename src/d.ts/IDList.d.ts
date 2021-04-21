declare class IDList<T>
{
	public iterate(iterator: (key: string, value: T) => void): void;
	public map(transform: (value: T) => T): void;
	public sort(comparator: (first: T, second: T) => number): void;
	public filter(filter: (key: string, value: T) => boolean): IDList<T>;
	public empty(): boolean;
	public get(key: string): T;
	public push(key: string, value: T): void;
}
