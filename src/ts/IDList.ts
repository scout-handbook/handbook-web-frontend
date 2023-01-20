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

  public sort(comparator: (first: T, second: T) => number): void {
    this.list.sort(function (first, second): number {
      return comparator(first.v, second.v);
    });
  }

  public filter(filter: (key: string, value: T) => boolean): IDList<T> {
    const ret = new IDList<T>();
    this.iterate(function (key, value) {
      if (filter(key, value)) {
        ret.push(key, value);
      }
    });
    return ret;
  }

  public empty(): boolean {
    let ret = true;
    this.iterate(function () {
      ret = false;
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

  public push(key: string, value: T): void {
    this.list.push({ k: key, v: value });
  }
}
