import picocolors from 'picocolors';
import { readLinesFromFile } from '../../lib/files';

const NUMERALS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const NUMERAL_KEYS = Object.keys(NUMERALS)
const REGEX = new RegExp(`(?=([1-9]|${Object.keys(NUMERALS).join('|')}))`, 'gi');

export function stringToNumber(str: string): number {
  if (str in NUMERALS) return NUMERALS[str];

  return parseInt(str);
}

export function findCalibrationValue(input: string): number {
  const matches = [...input.matchAll(REGEX)].map(m => m[1]);

  if (matches.length ===0) {
    throw new Error('Invalid calibration value');
  }

  return stringToNumber(matches[0]) * 10 + stringToNumber(matches.at(-1)!);
}

export function getCalibrationValuesSum(lines: string[]): number {
  let sum = 0;
  for (const line of lines) {
    try {
      const value = findCalibrationValue(line.toLowerCase());
      sum += value;
    } catch (e) {
      console.warn(
        picocolors.yellow(`Could not read calibration value: "${line}"`),
      );
    }
  }

  return sum;
}

export async function readCalibrationValues(path: string): Promise<number> {
  const text = await readLinesFromFile(path);
  return getCalibrationValuesSum(text);
}

export async function main() {
  const path = process.argv[2];
  if (!path) {
    throw new Error(
      'Please provide a path to read your calibration values from',
    );
  }
  const sum = await readCalibrationValues(path);
  console.log(`Result: ${picocolors.green(sum)}`);
}
