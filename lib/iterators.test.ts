import { describe, test, expect } from 'bun:test';
import { sum } from './iterators';

describe('sum', () => {
  test('case 1: numbers, no transform', () => {
    expect(sum([5, 10, 3])).toBe(5 + 10 + 3);
  })
  test('case 2: numbers, with transform', () => {
    expect(sum([5, 10, 3], (i) => i - 1)).toBe(5 + 10 + 3 - 3);
  });
  test('case 3: other, with transform', () => {
    expect(sum(['5', '10', '3'], parseInt)).toBe(5 + 10 + 3);
  });
})