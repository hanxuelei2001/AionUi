/**
 * Global polyfills for Chrome 109 and older runtime environments.
 * Provides ES2023 Array/TypedArray copy-and-change methods:
 *   - Array.prototype.toReversed
 *   - Array.prototype.toSorted
 *   - Array.prototype.toSpliced
 *   - Array.prototype.with
 * Provides ES2024 additions:
 *   - Object.groupBy / Map.groupBy
 *   - Promise.withResolvers
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

if (typeof Array.prototype.toReversed !== 'function') {
  Array.prototype.toReversed = function <T>(this: T[]): T[] {
    return Array.from(this).toReversed();
  };
}

if (typeof Array.prototype.toSorted !== 'function') {
  Array.prototype.toSorted = function <T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
    return Array.from(this).toSorted(compareFn);
  };
}

if (typeof Array.prototype.toSpliced !== 'function') {
  Array.prototype.toSpliced = function <T>(this: T[], start: number, deleteCount?: number, ...items: T[]): T[] {
    const copy = Array.from(this);
    if (deleteCount === undefined) {
      copy.splice(start);
    } else {
      copy.splice(start, deleteCount, ...items);
    }
    return copy;
  };
}

if (typeof Array.prototype.with !== 'function') {
  Array.prototype.with = function <T>(this: T[], index: number, value: T): T[] {
    const copy = Array.from(this);
    const len = copy.length;
    const relativeIndex = Number(index);
    const actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
    if (actualIndex < 0 || actualIndex >= len || !Number.isInteger(actualIndex)) {
      throw new RangeError(`Invalid index: ${index}`);
    }
    copy[actualIndex] = value;
    return copy;
  };
}

// Polyfill TypedArray copy-and-change methods
const typedArrayConstructors = [
  typeof Int8Array !== 'undefined' ? Int8Array : null,
  typeof Uint8Array !== 'undefined' ? Uint8Array : null,
  typeof Uint8ClampedArray !== 'undefined' ? Uint8ClampedArray : null,
  typeof Int16Array !== 'undefined' ? Int16Array : null,
  typeof Uint16Array !== 'undefined' ? Uint16Array : null,
  typeof Int32Array !== 'undefined' ? Int32Array : null,
  typeof Uint32Array !== 'undefined' ? Uint32Array : null,
  typeof Float32Array !== 'undefined' ? Float32Array : null,
  typeof Float64Array !== 'undefined' ? Float64Array : null,
  typeof BigInt64Array !== 'undefined' ? BigInt64Array : null,
  typeof BigUint64Array !== 'undefined' ? BigUint64Array : null,
].filter((ctor): ctor is NonNullable<typeof ctor> => ctor !== null);

for (const TypedArray of typedArrayConstructors) {
  if (typeof TypedArray.prototype.toReversed !== 'function') {
    TypedArray.prototype.toReversed = function (this: any): any {
      const copy = new (this.constructor as any)(this);
      copy.reverse();
      return copy;
    };
  }

  if (typeof TypedArray.prototype.toSorted !== 'function') {
    TypedArray.prototype.toSorted = function (this: any, compareFn?: any): any {
      const copy = new (this.constructor as any)(this);
      copy.sort(compareFn);
      return copy;
    };
  }

  if (typeof TypedArray.prototype.with !== 'function') {
    TypedArray.prototype.with = function (this: any, index: number, value: any): any {
      const copy = new (this.constructor as any)(this);
      const len = copy.length;
      const relativeIndex = Number(index);
      const actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
      if (actualIndex < 0 || actualIndex >= len || !Number.isInteger(actualIndex)) {
        throw new RangeError(`Invalid index: ${index}`);
      }
      copy[actualIndex] = value;
      return copy;
    };
  }
}

// Polyfill Object.groupBy
if (typeof (Object as any).groupBy !== 'function') {
  (Object as any).groupBy = function <K extends PropertyKey, T>(
    items: Iterable<T>,
    callbackfn: (item: T, index: number) => K
  ): Record<K, T[]> {
    const result = Object.create(null);
    let i = 0;
    for (const item of items) {
      const key = callbackfn(item, i++);
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key].push(item);
      } else {
        result[key] = [item];
      }
    }
    return result;
  };
}

// Polyfill Map.groupBy
if (typeof (Map as any).groupBy !== 'function') {
  (Map as any).groupBy = function <K, T>(items: Iterable<T>, callbackfn: (item: T, index: number) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    let i = 0;
    for (const item of items) {
      const key = callbackfn(item, i++);
      const collection = map.get(key);
      if (collection) {
        collection.push(item);
      } else {
        map.set(key, [item]);
      }
    }
    return map;
  };
}

// Polyfill Promise.withResolvers
if (typeof (Promise as any).withResolvers !== 'function') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
