"use strict";

interface AfterLoadEvent {
	addCallback: (callback: () => void) => void;
}
