import { expect, test, describe } from 'bun:test';
import { Game } from './lib';
import type { GameReveals } from './lib';

describe('Game.fromString', () => {
  test('case 1: single revelation set', () => {
    expect(Game.fromString('Game 10: 2 red, 3 green, 12 blue')).toEqual(
      new Game(10, [
        {
          red: 2,
          green: 3,
          blue: 12,
        },
      ]),
    );
  });

  test('case 2: single revelation set missing a color', () => {
    expect(Game.fromString('Game 10: 2 red, 3 green')).toEqual(
      new Game(10, [
        {
          red: 2,
          green: 3,
          blue: 0,
        },
      ]),
    );
  });

  test('case 2: multiple revelations', () => {
    expect(
      Game.fromString('Game 10: 2 red, 3 green; 4 blue; 3 blue, 2 red'),
    ).toEqual(
      new Game(10, [
        {
          red: 2,
          green: 3,
          blue: 0,
        },
        {
          red: 0,
          green: 0,
          blue: 4,
        },
        {
          red: 2,
          green: 0,
          blue: 3,
        },
      ]),
    );
  });
});

describe('Game.possible', () => {
  test('invalid case 1: single reveal', () => {
    expect(
      new Game(0, [
        {
          red: 200,
          green: 0,
          blue: 0,
        },
      ]).isPossible({
        red: 1,
        green: 1,
        blue: 1,
      }),
    );
  });

  test('invalid case 2: many reveals', () => {
    expect(
      new Game(0, [
        {
          red: 1,
          green: 0,
          blue: 0,
        },
        {
          red: 2,
          green: 0,
          blue: 0,
        },
      ]).isPossible({
        red: 1,
        green: 1,
        blue: 1,
      }),
    );
  });

  test('valid case 1: single reveal', () => {
    expect(
      new Game(0, [
        {
          red: 1,
          green: 0,
          blue: 0,
        },
      ]).isPossible({
        red: 1,
        green: 1,
        blue: 1,
      }),
    );
  });

  test('valid case 2: many reveals', () => {
    expect(
      new Game(0, [
        {
          red: 1,
          green: 0,
          blue: 0,
        },
        {
          red: 1,
          green: 0,
          blue: 1,
        },
      ]).isPossible({
        red: 1,
        green: 1,
        blue: 1,
      }),
    );
  });
});

describe('Game.minimum', () => {
  test('case 1: one reveal', () => {
    const reveal: GameReveals = {
      red: 20,
      green: 1,
      blue: 0,
    };

    expect(new Game(0, [reveal]).minimum()).toEqual(reveal);
  });

  test('case 2: multiple reveals', () => {
    expect(
      new Game(0, [
        {
          red: 20,
          green: 1,
          blue: 0,
        },
        {
          red: 5,
          green: 10,
          blue: 0,
        },
        {
          red: 0,
          green: 0,
          blue: 5,
        },
      ]).minimum(),
    ).toEqual({
      red: 20,
      green: 10,
      blue: 5,
    });
  });
});

describe('Game.power', () => {
  test('calculates', () => {
    expect(
      new Game(0, [
        {
          red: 20,
          green: 1,
          blue: 0,
        },
        {
          red: 5,
          green: 10,
          blue: 0,
        },
        {
          red: 0,
          green: 0,
          blue: 5,
        },
      ]).power(),
    ).toBe(20 * 10 * 5);
  });
});
