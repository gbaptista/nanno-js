import test from 'ava';
import MarkupParser from './markup';

test('parse A', (t) => {
  const ast = MarkupParser.parse(`

#stage
  width 100

*
  text-color indian-red

a
  background-color white
`);

  t.deepEqual(
    ast,
    {
      '#stage': { width: 100 },
      '*': { 'text-color': 13458524 },
      a: { 'background-color': 16777215 },
    },
  );
});

test('parse B', (t) => {
  const ast = MarkupParser.parse('a\nb\n  text-content 1\n\nc d\n  text-color #fff');

  t.deepEqual(
    ast,
    {
      a: { 'text-content': '1' },
      b: { 'text-content': '1' },
      c: { 'text-color': 16777215 },
      d: { 'text-color': 16777215 },
    },
  );
});

test('parseSource', (t) => {
  const ast = MarkupParser.parseSource('a\nb\n  text-content 1\n\nc d\n  text-color #fff');

  t.deepEqual(
    ast,
    ['a\nb\n  text-content 1', 'c d\n  text-color #fff'],
  );
});

test('parseSection A', (t) => {
  const ast = MarkupParser.parseSection('a\nb\n  text-content 1');

  t.deepEqual(
    ast,
    { objects: ['a', 'b'], properties: { 'text-content': '1' } },
  );
});

test('parseSection B', (t) => {
  const ast = MarkupParser.parseSection('c d\n  text-color #fff');

  t.deepEqual(
    ast,
    { objects: ['c', 'd'], properties: { 'text-color': '#fff' } },
  );
});

test('parseSection C', (t) => {
  const ast = MarkupParser.parseSection(`#stage a
b #player
  background-color dark-red
  width 1100 content "Lorem ipsum" value 100 a "c b" text-color dark-red
  height 400
  show-grid? no`);

  t.deepEqual(
    ast,
    {
      objects: ['#stage', 'a', 'b', '#player'],
      properties: {
        'background-color': 'dark-red',
        content: '"Lorem ipsum"',
        a: '"c b"',
        width: '1100',
        value: '100',
        'text-color': 'dark-red',
        height: '400',
        'show-grid?': 'no',
      },
    },
  );
});

test('parse C', (t) => {
  const ast = MarkupParser.parse(`
a
  row 2 column 3

b
  position 7/8
`);

  t.deepEqual(
    ast,
    { a: { row: 2, column: 3 }, b: { column: 7, row: 8 } },
  );
});

test('parseSection D', (t) => {
  const ast = MarkupParser.parseSection(`
a
  flow [
    > 1 10/3 text-color lime-green
    > 2  4/5 background-color black
  ]
`);

  t.deepEqual(
    ast,
    {
      objects: ['a'],
      properties: {
        flow: '[\n'
      + '    > 1 10/3 text-color lime-green\n'
      + '    > 2  4/5 background-color black\n'
      + '  ]',
      },
    },
  );
});

test('parse D', (t) => {
  const ast = MarkupParser.parse(`
a
  flow [
    > 1 10/3 text-color lime-green
    > 2  4/5 background-color black
  ]

b
  flow [
    > 3 1/2 background-color white
    > 4 6/7 text-color red
  ]
`);

  t.deepEqual(
    ast,
    {
      a: {
        flow: '[\n'
      + '    > 1 10/3 text-color lime-green\n'
      + '    > 2  4/5 background-color black\n'
      + '  ]',
      },
      b: {
        flow: '[\n    > 3 1/2 background-color white\n    > 4 6/7 text-color red\n  ]',
      },
    },

  );
});

test('parse E', (t) => {
  const ast = MarkupParser.parse(`
welcome
  text-content "Welcome!"
  flow [ > 3/2 motion show ]
  text-font FrederickaTheGreat
`);

  t.deepEqual(
    ast,
    {
      welcome: {
        'text-content': 'Welcome!',
        flow: '[ > 3/2 motion show ]',
        'text-font': 'FrederickaTheGreat',
      },
    },
  );
});
