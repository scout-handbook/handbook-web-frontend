"use strict";
/* exported configSetup */

var configEvent = new AfterLoadEvent(1);

function configSetup()
{
	CONFIG.cache = "odymaterialy-" + ""/*INJECTED-VERSION*/;
	configEvent.trigger();
}
