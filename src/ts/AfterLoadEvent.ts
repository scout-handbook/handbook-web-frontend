"use strict";
/* exported AfterLoadEvent */

class AfterLoadEvent {
	triggered: boolean;
	threshold: number;
	count: number;
	callbacks: Array<(...args: Array<string>) => void>;

	constructor(threshold: number)
	{
		this.triggered = false;
		this.threshold = threshold;
		this.count = 0;
		this.callbacks = [];
	}

	addCallback(callback: (...args: Array<any>) => void): void
		{
			this.callbacks.push(callback);
			if(this.triggered)
			{
				callback();
			}
		}
	trigger(...args: Array<string>): void
		{
			this.count++;
			this.retrigger.apply(this, args);
		}
	retrigger(...args: Array<string>): void
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
