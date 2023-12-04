import picocolors from 'picocolors';
import { readLinesFromFile } from '../../lib/files';
import { sum } from '../../lib/iterators';

export function isSymbol(char: string): boolean {
  if (char === '.') return false;
  return /[^0-9]/.test(char);
}

export function isGear(char: string): boolean {
  return char === '*';
}

const ADJACENCY_COORDINATES: [row: number, col: number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export function getPartNumbers(schematic: string[]): number[] {
  const adjacent = new Array<number>();
  for (let row = 0; row < schematic.length; row += 1) {
    let currNum = '';
    let isAdjacent = false;
    for (let col = 0; col < schematic[row].length; col += 1) {
      const char = schematic[row][col];
      if (/[^0-9]/.test(char)) {
        if (isAdjacent && currNum.length > 0) {
          adjacent.push(parseInt(currNum));
        }
        currNum = '';
        isAdjacent = false;
        continue;
      }

      if (!isAdjacent) {
        isAdjacent = ADJACENCY_COORDINATES.some(([r, c]) => {
          const char = schematic[row + r]?.[col + c] ?? '.';
          return isSymbol(char);
        });
      }

      currNum += char;
    }

    if (isAdjacent && currNum.length > 0) {
      adjacent.push(parseInt(currNum));
    }
  }

  return adjacent;
}

export function getGearRatios(schematic: string[]): number[] {
  const gears = new Map<number, number[]>();
  for (let row = 0; row < schematic.length; row += 1) {
    let currNum = '';
    const adjacentGears = new Set<number>();
    const addToGears = () => {
      if (adjacentGears.size > 0 && currNum.length > 0) {
        const int = parseInt(currNum);
        adjacentGears.forEach(gear => {
          if (!gears.has(gear)) {
            gears.set(gear, []);
          }
          gears.get(gear)!.push(int)
        })
      }
    }
    for (let col = 0; col < schematic[row].length; col += 1) {
      const char = schematic[row][col];
      if (/[^0-9]/.test(char)) {
        addToGears();
        currNum = '';
        adjacentGears.clear();
        continue;
      }

      for (const [r, c] of ADJACENCY_COORDINATES) {
        const char = schematic[row + r]?.[col + c] ?? '.';
        if (isGear(char)) {
          adjacentGears.add((row + r) * schematic[0].length + col + c);
        }
      }

      currNum += char;
    }

    addToGears();
  }

  const ratios: number[] = []
  for (const parts of gears.values()) {
    if (parts.length === 2) {
      ratios.push(parts[0] * parts[1])
    }
  }

  return ratios;
}

export async function main() {
  const path = process.argv[2];
  if (!path) {
    throw new Error('Please provide a path to read from');
  }
  const schematic = await readLinesFromFile(path);

  const partNumbers = getPartNumbers(schematic);
  const partNumberSum = sum(partNumbers);
  console.log(`Part 1: ${picocolors.green(partNumberSum)}`);

  const gearRatios = getGearRatios(schematic);
  const gearRatiosSum = sum(gearRatios);
  console.log(`Part 2: ${picocolors.green(gearRatiosSum)}`);
}
