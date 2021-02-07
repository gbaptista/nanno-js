import test from 'ava';
import StageParser from './02-stage';

test('parse A', (t) => {
  const source = `  1 2 3
1
2  ↥b
3`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [{ token: '↥b', row: 2, column: 2 }],
      lastRow: 3,
      columnMap: {
        firstColumn: 1,
        lastColumn: 3,
        numberOfColumns: 3,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
        },
      },
    },
  );
});

test('parse B', (t) => {
  const source = `  . . .
.
.   b↥
.`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [{ token: 'b↥', row: 2, column: 2 }],
      lastRow: 3,
      columnMap: {
        firstColumn: 1,
        lastColumn: 3,
        numberOfColumns: 3,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
        },
      },
    },
  );
});

test('parse C', (t) => {
  const source = `  5 . .
7
.   a
.`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [{ token: 'a', row: 8, column: 6 }],
      lastRow: 9,
      columnMap: {
        firstColumn: 5,
        lastColumn: 7,
        numberOfColumns: 7,
        coordinates: {
          0: 5, 1: 5, 2: 5, 3: 5, 4: 6, 5: 6, 6: 7,
        },
      },
    },
  );
});

test('parse D', (t) => {
  const source = `    .      .
1  ↥c:1   ↥e:"lorem ipsum"
3  ↥d:1   ↥f:b`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [
        { token: '↥c:1', row: 1, column: 1 },
        { token: '↥e:"lorem ipsum"', row: 1, column: 2 },
        { token: '↥d:1', row: 3, column: 1 },
        { token: '↥f:b', row: 3, column: 2 },
      ],
      lastRow: 3,
      columnMap: {
        firstColumn: 1,
        lastColumn: 2,
        numberOfColumns: 2,
        coordinates: {
          0: 1,
          1: 1,
          2: 1,
          3: 1,
          4: 1,
          5: 1,
          6: 2,
          7: 2,
          8: 2,
          9: 2,
          10: 2,
          11: 2,
        },
      },
    },
  );
});

test('parse E', (t) => {
  const source = `    .      .
1  ↥c:1   ↥e:'lorem "ipsum"'
3  ↥d:1   ↥f:b`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [
        { token: '↥c:1', row: 1, column: 1 },
        { token: '↥e:\'lorem "ipsum"\'', row: 1, column: 2 },
        { token: '↥d:1', row: 3, column: 1 },
        { token: '↥f:b', row: 3, column: 2 },
      ],
      lastRow: 3,
      columnMap: {
        firstColumn: 1,
        lastColumn: 2,
        numberOfColumns: 2,
        coordinates: {
          0: 1,
          1: 1,
          2: 1,
          3: 1,
          4: 1,
          5: 1,
          6: 2,
          7: 2,
          8: 2,
          9: 2,
          10: 2,
          11: 2,
        },
      },
    },
  );
});

test('parse F', (t) => {
  const source = `    1
1 ↥a/"A"`;

  const ast = StageParser.parse(source);

  t.deepEqual(
    ast, {
      elements: [{ token: '↥a/"A"', row: 1, column: 1 }],
      lastRow: 1,
      columnMap: {
        firstColumn: 1,
        lastColumn: 1,
        numberOfColumns: 1,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 1,
        },
      },
    },
  );
});
