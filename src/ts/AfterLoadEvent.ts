/* exported AfterLoadEvent */

class AfterLoadEvent {
  private readonly callbacks: Array<(...args: Array<RequestResponse>) => void>;
  private count: number;
  private readonly threshold: number;
  private triggered: boolean;

  public constructor(threshold: number) {
    this.triggered = false;
    this.threshold = threshold;
    this.count = 0;
    this.callbacks = [];
  }

  public addCallback(
    callback: (...args: Array<RequestResponse>) => void,
  ): void {
    this.callbacks.push(callback);
    if (this.triggered) {
      callback();
    }
  }

  public retrigger(...args: Array<RequestResponse>): void {
    if (this.count >= this.threshold) {
      this.triggered = true;
      for (const callback of this.callbacks) {
        callback(...args);
      }
    }
  }

  public trigger(...args: Array<RequestResponse>): void {
    this.count++;
    this.retrigger(...args);
  }
}
