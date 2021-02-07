import test from 'ava';
import ColumnParser from './column';

test('parse A', (t) => {
  const source = '  1 2 3';

  const ast = ColumnParser.parse(source);

  t.deepEqual(
    ast,
    {
      firstColumn: 1,
      lastColumn: 3,
      numberOfColumns: 3,
      coordinates: {
        0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
      },
    },
  );
});

test('parse B', (t) => {
  const source = '  . . .';

  const ast = ColumnParser.parse(source);

  t.deepEqual(
    ast,
    {
      firstColumn: 1,
      lastColumn: 3,
      numberOfColumns: 3,
      coordinates: {
        0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
      },
    },
  );
});

test('parse C', (t) => {
  const source = '  . . 7 . . 14 .';

  const ast = ColumnParser.parse(source);

  t.deepEqual(
    ast,
    {
      firstColumn: 1,
      lastColumn: 15,
      numberOfColumns: 15,
      coordinates: {
        0: 1,
        1: 1,
        2: 1,
        3: 1,
        4: 2,
        5: 2,
        6: 7,
        7: 7,
        8: 8,
        9: 8,
        10: 9,
        11: 9,
        12: 14,
        13: 14,
        14: 14,
        15: 15,
      },
    },
  );
});

test('parse D', (t) => {
  const source = '  3.5 . 4.5';

  const ast = ColumnParser.parse(source);

  t.deepEqual(
    ast,
    {
      firstColumn: 3.5,
      lastColumn: 4.5,
      numberOfColumns: 5,
      coordinates: {
        0: 3.5,
        1: 3.5,
        2: 3.5,
        3: 3.5,
        4: 3.5,
        5: 3.5,
        6: 4,
        7: 4,
        8: 4.5,
        9: 4.5,
        10: 4.5,
      },
    },
  );
});
