"use strict";

interface AfterLoadEvent {
	addCallback: (callback: (response: string) => void) => void;
}
