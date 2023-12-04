import picocolors from 'picocolors';
import { readLinesFromFile } from '../../lib/files';
import { sum } from '../../lib/iterators';

export class Scratchcard {
  constructor(
    public id: number,
    public numbers: Set<number>,
    public winningNumbers: Set<number>,
  ) {}

  static fromString(line: string): Scratchcard {
    const startRegex = /^Card +(\d+): /i;
    const cardID = parseInt(line.match(startRegex)?.[1] ?? '0');

    const [winningNumbersString, numbersString] = line
      .replace(startRegex, '')
      .split('|')
      .map((l) => l.trim());

    const numbers = new Set(numbersString.match(/(\d)+/g)?.map((i) => parseInt(i)));
    const winningNumbers = new Set(
      winningNumbersString.match(/(\d)+/g)?.map((i) => parseInt(i)),
    );

    return new Scratchcard(cardID, numbers!, winningNumbers!);
  }

  winners(): number[] {
    return [...this.numbers].filter((n) => this.winningNumbers.has(n));
  }

  points(): number {
    const count = this.winners().length;
    if (count === 0) return 0;
    return 2 ** (count - 1);
  }
}

export class ScratchcardSet {
  public cards: Map<number, Scratchcard>;

  constructor(cards: Scratchcard[]) {
    const m = new Map<number, Scratchcard>();
    for (const card of cards) {
      m.set(card.id, card);
    }
    this.cards = m;
  }

  play() {
    const queue = [...this.cards.values()];
    let counter = 0;
    while (queue.length > 0) {
      counter += 1;
      const card = queue.shift()!;
      const winners = card.winners();
      for (let i = 1; i <= winners.length; i++) {
        queue.push(this.cards.get(card.id + i)!);
      }
    }
    return counter;
  }
}

export async function main() {
  const path = process.argv[2];
  if (!path) {
    throw new Error('Please provide a path to read from');
  }
  const lines = await readLinesFromFile(path);
  const cards = lines.map(Scratchcard.fromString);

  const cardPoints = cards.map((c) => c.points());
  console.log(`Part 1: ${picocolors.green(sum(cardPoints))}`);

  const set = new ScratchcardSet(cards);
  console.log(`Part 2: ${picocolors.green(set.play())}`);
}
