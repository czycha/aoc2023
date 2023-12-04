import { expect, test, describe } from 'bun:test';
import * as Suite from './lib';

describe('stringToNumber', () => {
  test('handles number case', () => {
    expect(Suite.stringToNumber('5')).toEqual(5);
  });

  test('handles written out case', () => {
    expect(Suite.stringToNumber('five')).toEqual(5);
  });
});

describe('findCalibrationValue', () => {
  test('finds invalid inputs', () => {
    expect(() => {
      Suite.findCalibrationValue('');
    }).toThrow();
    expect(() => {
      Suite.findCalibrationValue('abc');
    }).toThrow();
  });

  test('case 1: two values', () => {
    expect(Suite.findCalibrationValue('t6es9t')).toEqual(69);
    expect(Suite.findCalibrationValue('56')).toEqual(56);
  });

  test('case 2: one value', () => {
    expect(Suite.findCalibrationValue('t6est')).toEqual(66);
  });

  test('case 3: 3+ values', () => {
    expect(Suite.findCalibrationValue('t6e7st8')).toEqual(68);
    expect(Suite.findCalibrationValue('5456')).toEqual(56);
  });

  test('case 4: discrete string values', () => {
    expect(Suite.findCalibrationValue('tsixes1oneoneonesevenninet')).toEqual(
      69,
    );
  });

  test('case 5: overlapping string values', () => {
    expect(Suite.findCalibrationValue('five61oneightr')).toEqual(58);
  });
});

describe('getCalibrationValuesSum', () => {
  test('skips invalid inputs', () => {
    expect(Suite.getCalibrationValuesSum(['abc', 't3es6t'])).toEqual(36);
  });

  test('calculates correctly', () => {
    expect(
      Suite.getCalibrationValuesSum([
        't6es9t',
        't6est',
        't6e7st8',
        'tsixes1oneoneonesevenninet1',
      ]),
    ).toEqual(69 + 66 + 68 + 61);
  });
});
