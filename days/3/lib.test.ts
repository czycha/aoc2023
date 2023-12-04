import { describe, test, expect } from 'bun:test';
import { getGearRatios, getPartNumbers, isSymbol } from './lib';

describe('isSymbol', () => {
  test('numbers are not symbols', () => {
    expect(isSymbol('1')).toBeFalse();
  });

  test('periods are not symbols', () => {
    expect(isSymbol('.')).toBeFalse();
  });

  test('everything else are symbols', () => {
    expect(isSymbol('^')).toBeTrue();
  });
});

describe('getPartNumbers', () => {
  test('case provided by question', () => {
    const schematic = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
    expect(getPartNumbers(schematic.split('\n'))).toEqual([
      467, 35, 633, 617, 592, 755, 664, 598,
    ]);
  });
});

describe('getGearRatios', () => {
  test('case provided by question', () => {
    const schematic = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
    expect(getGearRatios(schematic.split('\n'))).toEqual([16345, 451490]);
  });
});