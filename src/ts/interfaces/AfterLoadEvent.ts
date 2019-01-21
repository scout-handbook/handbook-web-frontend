interface AfterLoadEvent {
	addCallback: (callback: (response: string) => void) => void;
}
