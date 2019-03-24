/* exported IDList */

class IDList<T>
{
	private list: IDListItems<T>;

	public constructor(list: IDListItems<T> = {})
	{
		this.list = list
	}

	public iterate(iterator: (key: string, value: T) => void): void
	{
		for (var key in this.list) {
			if (this.list.hasOwnProperty(key)) {
				iterator(key, this.list[key]);
			}
		}
	}

	public filter(filter: (key: string, value: T) => boolean): IDList<T>
	{
		var ret = new IDList<T>();
		this.iterate(function(key, value)
		{
			if(filter(key, value))
			{
				ret.push(key, value);
			}
		});
		return ret;
	}

	public empty(): boolean
	{
		var ret = true;
		this.iterate(function()
		{
			ret = false;
		});
		return ret;
	}

	public get(key: string): T
	{
		return this.list[key];
	}

	public push(key: string, value: T): void
	{
		this.list[key] = value;
	}
}
