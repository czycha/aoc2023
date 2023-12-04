import { expect, test, describe } from 'bun:test';
import { Scratchcard, ScratchcardSet } from './lib';

describe('Scratchcard.fromString', () => {
  test('example', () => {
    expect(
      Scratchcard.fromString(
        'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
      ),
    ).toEqual(
      new Scratchcard(
        3,
        new Set([69, 82, 63, 72, 16, 21, 14, 1]),
        new Set([1, 21, 53, 59, 44]),
      ),
    );
  });
});

describe('Scratchcard.winners', () => {
  test('case 1: no winners', () => {
    expect(
      Scratchcard.fromString(
        'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
      ).winners(),
    ).toBeArrayOfSize(0);
  })

  test('case 2: winners', () => {
    expect(
      Scratchcard.fromString(
        'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
      ).winners().sort(),
    ).toEqual([48, 83, 17, 86].sort())
  });
})

describe('Scratchcard.points', () => {
  test('case 1: no winners', () => {
    expect(
      Scratchcard.fromString(
        'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
      ).points(),
    ).toBe(0);
  });

  test('case 2: winners', () => {
    expect(
      Scratchcard.fromString('Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53')
        .points()
    ).toBe(8);

    expect(
      Scratchcard.fromString(
        'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
      ).points(),
    ).toBe(1);
  });
})

describe('ScratchcardSet.play', () => {
  test('example', () => {
    const cards = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n').map(Scratchcard.fromString);
    const set = new ScratchcardSet(cards);

    expect(set.play()).toBe(30);
  })
})