/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import '@/common/polyfills';

describe('Chrome 109 Polyfills', () => {
  describe('Array.prototype.toReversed', () => {
    it('returns a reversed copy without mutating original array', () => {
      const original = [1, 2, 3, 4];
      const reversed = original.toReversed();

      expect(reversed).toEqual([4, 3, 2, 1]);
      expect(original).toEqual([1, 2, 3, 4]);
      expect(reversed).not.toBe(original);
    });
  });

  describe('Array.prototype.toSorted', () => {
    it('returns a sorted copy without mutating original array', () => {
      const original = [3, 1, 4, 2];
      const sorted = original.toSorted();

      expect(sorted).toEqual([1, 2, 3, 4]);
      expect(original).toEqual([3, 1, 4, 2]);
      expect(sorted).not.toBe(original);
    });

    it('accepts a custom compare function', () => {
      const original = [10, 5, 20];
      const sorted = original.toSorted((a, b) => b - a);

      expect(sorted).toEqual([20, 10, 5]);
    });
  });

  describe('Array.prototype.toSpliced', () => {
    it('returns a spliced copy without mutating original array', () => {
      const original = ['a', 'b', 'c', 'd'];
      const spliced = original.toSpliced(1, 2, 'x', 'y');

      expect(spliced).toEqual(['a', 'x', 'y', 'd']);
      expect(original).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('Array.prototype.with', () => {
    it('returns a modified copy at positive index', () => {
      const original = [10, 20, 30];
      const updated = original.with(1, 99);

      expect(updated).toEqual([10, 99, 30]);
      expect(original).toEqual([10, 20, 30]);
    });

    it('handles negative index correctly', () => {
      const original = [10, 20, 30];
      const updated = original.with(-1, 99);

      expect(updated).toEqual([10, 20, 99]);
    });

    it('throws RangeError on invalid or out-of-bound index', () => {
      const original = [1, 2, 3];
      expect(() => original.with(5, 10)).toThrow(RangeError);
      expect(() => original.with(-5, 10)).toThrow(RangeError);
    });
  });

  describe('TypedArray Polyfills', () => {
    it('supports toReversed, toSorted and with on Uint8Array', () => {
      const arr = new Uint8Array([3, 1, 2]);
      expect(Array.from(arr.toReversed())).toEqual([2, 1, 3]);
      expect(Array.from(arr.toSorted())).toEqual([1, 2, 3]);
      expect(Array.from(arr.with(0, 9))).toEqual([9, 1, 2]);
      expect(Array.from(arr)).toEqual([3, 1, 2]);
    });
  });

  describe('Object.groupBy & Map.groupBy', () => {
    it('groups elements by key using Object.groupBy', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];

      const grouped = (Object as any).groupBy(items, (item: any) => item.type);
      expect(grouped.fruit).toEqual([
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
      ]);
      expect(grouped.vegetable).toEqual([{ type: 'vegetable', name: 'carrot' }]);
    });

    it('groups elements by key using Map.groupBy', () => {
      const items = [1, 2, 3, 4, 5];
      const isEven = (n: number) => n % 2 === 0;

      const grouped = (Map as any).groupBy(items, isEven);
      expect(grouped.get(true)).toEqual([2, 4]);
      expect(grouped.get(false)).toEqual([1, 3, 5]);
    });
  });

  describe('Promise.withResolvers', () => {
    it('returns a promise with external resolve/reject handles', async () => {
      const { promise, resolve } = (Promise as any).withResolvers<string>();
      resolve('success');
      const result = await promise;
      expect(result).toBe('success');
    });
  });

  describe('Chrome 109 simulated environment (missing native methods)', () => {
    it('toReversed polyfill does not cause Maximum call stack size exceeded', () => {
      const origToReversed = Array.prototype.toReversed;
      delete (Array.prototype as any).toReversed;

      // Manually apply polyfill logic as in polyfills.ts
      if (typeof Array.prototype.toReversed !== 'function') {
        Array.prototype.toReversed = function <T>(this: T[]): T[] {
          return Array.from(this).reverse();
        };
      }

      const arr = [1, 2, 3, 4];
      expect(arr.toReversed()).toEqual([4, 3, 2, 1]);

      Array.prototype.toReversed = origToReversed;
    });

    it('toSorted polyfill does not cause Maximum call stack size exceeded', () => {
      const origToSorted = Array.prototype.toSorted;
      delete (Array.prototype as any).toSorted;

      // Manually apply polyfill logic as in polyfills.ts
      if (typeof Array.prototype.toSorted !== 'function') {
        Array.prototype.toSorted = function <T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
          return Array.from(this).sort(compareFn);
        };
      }

      const arr = [3, 1, 4, 2];
      expect(arr.toSorted()).toEqual([1, 2, 3, 4]);

      Array.prototype.toSorted = origToSorted;
    });
  });
});
