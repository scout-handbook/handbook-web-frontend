/* exported IDList */

class IDList<T> {
  private readonly list: Array<{ k: string; v: T }>;

  public constructor(list: Record<string, T> = {}) {
    this.list = [];
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.push(key, list[key]);
      }
    }
  }

  public empty(): boolean {
    let ret = true;
    this.iterate(() => {
      ret = false;
    });
    return ret;
  }

  public filter(filter: (key: string, value: T) => boolean): IDList<T> {
    const ret = new IDList<T>();
    this.iterate((key, value) => {
      if (filter(key, value)) {
        ret.push(key, value);
      }
    });
    return ret;
  }

  public get(key: string): T | undefined {
    for (const item of this.list) {
      if (item.k === key) {
        return item.v;
      }
    }
    return undefined;
  }

  public iterate(iterator: (key: string, value: T) => void): void {
    for (const item of this.list) {
      iterator(item.k, item.v);
    }
  }

  public map(transform: (value: T) => T): void {
    for (const item of this.list) {
      item.v = transform(item.v);
    }
  }

  public push(key: string, value: T): void {
    this.list.push({ k: key, v: value });
  }

  public sort(comparator: (first: T, second: T) => number): void {
    this.list.sort((first, second): number => comparator(first.v, second.v));
  }
}
