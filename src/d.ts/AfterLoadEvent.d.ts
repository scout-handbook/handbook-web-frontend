declare class AfterLoadEvent {
  public addCallback(callback: (...args: Array<RequestResponse>) => void): void;
  public trigger(...args: Array<RequestResponse>): void;
  public retrigger(...args: Array<RequestResponse>): void;
}
