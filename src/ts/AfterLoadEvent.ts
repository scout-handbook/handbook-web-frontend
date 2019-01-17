"use strict";
/* exported AfterLoadEvent */

class AfterLoadEvent {
	private triggered: boolean;
	private threshold: number;
	private count: number;
	private callbacks: Array<(...args: Array<string>) => void>;

	public constructor(threshold: number)
	{
		this.triggered = false;
		this.threshold = threshold;
		this.count = 0;
		this.callbacks = [];
	}

	public addCallback(callback: (...args: Array<string>) => void): void
		{
			this.callbacks.push(callback);
			if(this.triggered)
			{
				callback();
			}
		}
	public trigger(...args: Array<string>): void
		{
			this.count++;
			this.retrigger.apply(this, args);
		}
	public retrigger(...args: Array<string>): void
		{
			if(this.count >= this.threshold)
			{
				this.triggered = true;
				for(var i = 0; i < this.callbacks.length; i++)
				{
					this.callbacks[i].apply(null, args);
				}
			}
		}
}
