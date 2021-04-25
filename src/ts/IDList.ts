/* exported IDList */

class IDList<T> {
  private list: Array<{ k: string; v: T }>;

  public constructor(list: Record<string, T> = {}) {
    this.list = [];
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.push(key, list[key]);
      }
    }
  }

  public iterate(iterator: (key: string, value: T) => void): void {
    for (let i = 0; i < this.list.length; i++) {
      iterator(this.list[i].k, this.list[i].v);
    }
  }

  public map(transform: (value: T) => T): void {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].v = transform(this.list[i].v);
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
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].k === key) {
        return this.list[i].v;
      }
    }
    return undefined;
  }

  public push(key: string, value: T): void {
    this.list.push({ k: key, v: value });
  }
}
