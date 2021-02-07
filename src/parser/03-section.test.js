import test from 'ava';
import SectionParser from './03-section';

test('parse A', (t) => {
  const source = {
    stage: '  1 2 3\n1\n2   b\n3',
    markup: 'scene 1\nb\n  color red\nscene 2\nb\n  color white',
    position: 1,
  };

  const ast = SectionParser.parse(source);

  t.deepEqual(
    ast, {
      scenes: [
        { scene: 1, markup: { b: { color: 16711680 } } },
        { scene: 2, markup: { b: { color: 16777215 } } },
      ],
      stage: {
        elements: [{
          id: 'b', markup: {}, row: 2, column: 2,
        }],
        scene: 1,
      },
      columnMap: {
        firstColumn: 1,
        lastColumn: 3,
        numberOfColumns: 3,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
        },
      },
      leakedBaseMarkup: {},
      lastRow: 3,
      firstScene: 1,
      lastScene: 2,
    },
  );
});

test('parse B', (t) => {
  const source = {
    stage: '  1 2 3\n1\n2   b\n3',
    markup: 'scene\nb\n  color red\nscene\nb\n  color white',
    position: 1,
  };

  const ast = SectionParser.parse(source);

  t.deepEqual(
    ast, {
      scenes: [
        { scene: 1, markup: { b: { color: 16711680 } } },
        { scene: 2, markup: { b: { color: 16777215 } } },
      ],
      stage: {
        elements: [{
          id: 'b', markup: {}, row: 2, column: 2,
        }],
        scene: 1,
      },
      lastRow: 3,
      columnMap: {
        firstColumn: 1,
        lastColumn: 3,
        numberOfColumns: 3,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
        },
      },
      leakedBaseMarkup: {},
      firstScene: 1,
      lastScene: 2,
    },
  );
});

test('parse C', (t) => {
  const source = {
    stage: '  1 2 3\n1\n2   b\n3',
    markup: 'scene 3\nb\n  color red\nscene\nb\n  color white',
    position: 1,
  };

  const ast = SectionParser.parse(source);

  t.deepEqual(
    ast, {
      scenes: [
        { scene: 3, markup: { b: { color: 16711680 } } },
        { scene: 4, markup: { b: { color: 16777215 } } },
      ],
      stage: {
        elements: [{
          id: 'b', markup: {}, row: 2, column: 2,
        }],
        scene: 3,
      },
      columnMap: {
        firstColumn: 1,
        lastColumn: 3,
        numberOfColumns: 3,
        coordinates: {
          0: 1, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3,
        },
      },
      leakedBaseMarkup: {},
      lastRow: 3,
      firstScene: 3,
      lastScene: 4,
    },
  );
});

test('parse D', (t) => {
  const source = {
    markup: 'scene\n'
      + 'welcome\n'
      + '  text-content "Welcome!"\n'
      + '  flow [ > 3/2 motion show ]\n'
      + '  text-font FrederickaTheGreat\n'
      + 'scene\n'
      + 'hello\n'
      + '  text-content "Hello, World!"\n'
      + '  text-font Pacifico\n'
      + '  flow [ > 3/4 motion show ]',
    position: 1,
  };

  const ast = SectionParser.parse(source, 0, undefined);

  t.deepEqual(
    ast, {
      scenes: [
        {
          scene: 1,
          markup: {
            welcome: {
              'text-content': 'Welcome!',
              flow: '[ > 3/2 motion show ]',
              'text-font': 'FrederickaTheGreat',
            },
          },
        },
        {
          scene: 2,
          markup: {
            hello: {
              'text-content': 'Hello, World!',
              'text-font': 'Pacifico',
              flow: '[ > 3/4 motion show ]',
            },
          },
        },
      ],
      stage: undefined,
      columnMap: undefined,
      firstScene: 1,
      lastScene: 2,
      leakedBaseMarkup: {},
    },
  );
});
