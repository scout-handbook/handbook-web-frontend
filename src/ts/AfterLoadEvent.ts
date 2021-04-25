/* exported AfterLoadEvent */

class AfterLoadEvent {
  private triggered: boolean;
  private threshold: number;
  private count: number;
  private callbacks: Array<(...args: Array<RequestResponse | string>) => void>;

  public constructor(threshold: number) {
    this.triggered = false;
    this.threshold = threshold;
    this.count = 0;
    this.callbacks = [];
  }

  public addCallback(
    callback: (...args: Array<RequestResponse | string>) => void
  ): void {
    this.callbacks.push(callback);
    if (this.triggered) {
      callback();
    }
  }
  public trigger(...args: Array<RequestResponse | string>): void {
    this.count++;
    this.retrigger(...args);
  }
  public retrigger(...args: Array<RequestResponse | string>): void {
    if (this.count >= this.threshold) {
      this.triggered = true;
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i].apply(null, args);
      }
    }
  }
}
