import picocolors from 'picocolors';
import { readLinesFromFile } from '../../lib/files';

export interface GameReveals {
  red: number;
  green: number;
  blue: number;
}

const COLORS = ['red', 'green', 'blue'] as const;

export class Game {
  constructor(
    public id: number,
    public reveals: GameReveals[],
  ) {}

  static fromString(line: string): Game {
    const startRegex = /^Game (\d+): /i;
    const colorRegex = /^(\d+) (red|green|blue)$/i;

    const gameID = parseInt(line.match(startRegex)?.[1] ?? '0');
    const reveals: Game['reveals'] = [];

    const revealSets = line
      .replace(startRegex, '')
      .split(';')
      .map((l) => l.trim());
    for (const set of revealSets) {
      const colors = set.split(',').map((c) => c.trim());
      const reveal: GameReveals = {
        red: 0,
        green: 0,
        blue: 0,
      };
      for (const c of colors) {
        const [, quantity, color] = c.match(colorRegex) ?? [];
        reveal[color as keyof GameReveals] = parseInt(quantity);
      }
      reveals.push(reveal);
    }

    return new Game(gameID, reveals);
  }

  isPossible(config: GameReveals): boolean {
    return this.reveals.every((reveal) =>
      COLORS.every((color) => {
        return config[color] >= reveal[color];
      }),
    );
  }
  
  minimum() {
    const min: GameReveals = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (const reveal of this.reveals) {
      for (const color of COLORS) {
        min[color] = Math.max(min[color], reveal[color]);
      }
    }

    return min;
  }

  power() {
    const min = this.minimum();
    let total = 1;
    for (const color of COLORS) {
      total *= min[color];
    }

    return total;
  }
}

export function sumPossibleGames(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible({ red: 12, green: 13, blue: 14 })) {
      sum += game.id;
    }
  }
  return sum;
}

export function minimumPossible(game: Game): GameReveals {
  const min: GameReveals = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const reveal of game.reveals) {
    for (const color of COLORS) {
      min[color] = Math.max(min[color], reveal[color]);
    }
  }

  return min;
}

export function calculatePowerSum(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.power();
  }

  return sum;
}

export async function main() {
  const path = process.argv[2];
  if (!path) {
    throw new Error('Please provide a path to read from');
  }
  const lines = await readLinesFromFile(path);
  const games = lines.map((line) => Game.fromString(line));

  const sum = sumPossibleGames(games);
  console.log(`Part 1: ${picocolors.green(sum)}`);

  const powerSum = calculatePowerSum(games);
  console.log(`Part 2: ${picocolors.green(powerSum)}`);
}
