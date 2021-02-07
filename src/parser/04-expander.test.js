import test from 'ava';
import Expander from './04-expander';

test('parse A', (t) => {
  const source = `
  1 2 3
1
2   b
3

movie
#stage
  height 20

scene 1
b
  text-content red

scene 2
b
  text-content white

----

scene
b
  text-content green

movie

#stage
  width 100
`;

  const ast = Expander.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        { scene: 1, markup: { b: { 'text-content': 'red' } } },
        { scene: 2, markup: { b: { 'text-content': 'white' } } },
        { scene: 3, markup: { b: { 'text-content': 'green' } } },
      ],
      stages: [
        {
          elements: [{
            id: 'b', markup: {}, row: 2, column: 2,
          }],
          scene: 1,
        },
      ],
      meta: { lastScene: 3, lastColumn: 3, lastRow: 3 },
      markup: { '#stage': { height: 20, width: 100 } },
    },
  );
});

test('parse B', (t) => {
  const source = `
  1 2 3
1
2   b
3

movie
#stage
  height 20

scene 1
b
  text-content red

*
  width 10

scene 2
b
  text-content white

----

scene
b
  text-content green

movie

#stage
  width 100

*
  height 20

b
  font-size 9
`;

  const ast = Expander.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        {
          scene: 1,
          markup: { b: { 'text-content': 'red' }, '*': { width: 10 } },
        },
        { scene: 2, markup: { b: { 'text-content': 'white' } } },
        { scene: 3, markup: { b: { 'text-content': 'green' } } },
      ],
      stages: [
        {
          elements: [{
            id: 'b', markup: {}, row: 2, column: 2,
          }],
          scene: 1,
        },
      ],
      meta: { lastScene: 3, lastColumn: 3, lastRow: 3 },
      markup: {
        '#stage': { height: 20, width: 100 },
        '*': { height: 20 },
        b: { 'font-size': '9' },
      },
    },
  );
});

test('parse C', (t) => {
  const source = `
  1 2 3
1 b
-
2   b
>
b
  text-content "lorem"

*
  text-color red
-
3 a  ↧b
-
^

b
  text-color #fff

*
  text-color Blue
  background-color IndianRed

#stage
  background-color Black
`;

  const ast = Expander.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        {
          scene: 2,
          markup: {
            b: { 'text-content': 'lorem' },
            '*': { 'text-color': 16711680 },
          },
        },
      ],
      stages: [
        {
          elements: [{
            id: 'b', markup: {}, row: 1, column: 1,
          }],
          scene: 1,
        },
        {
          elements: [{
            id: 'b', markup: {}, row: 2, column: 2,
          }],
          scene: 2,
        },
        {
          elements: [
            {
              id: 'a', markup: {}, row: 3, column: 1,
            },
            {
              id: 'b', markup: { motion: 'hide' }, row: 3, column: 3,
            },
          ],
          scene: 3,
        },
      ],
      meta: { lastScene: 3, lastColumn: 3, lastRow: 3 },
      markup: {
        b: { 'text-color': 16777215 },
        '*': { 'text-color': 255, 'background-color': 13458524 },
        '#stage': { 'background-color': 0 },
      },
    },

  );
});

test('parse D', (t) => {
  const source = `
>
a
  flow [
    > 2/2 background-color yellow
    > 3/4 text-color blue
  ]

^
b
  content "c"
  flow [
    > 1/2 background-color white
    > 6/7 text-color red
  ]
`;

  const ast = Expander.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        {
          scene: 1,
          markup: {
            a: { 'background-color': 'yellow', column: 2, row: 2 },
            b: { 'background-color': 'white', column: 1, row: 2 },
          },
        },
        {
          scene: 2,
          markup: {
            a: { 'text-color': 'blue', column: 3, row: 4 },
            b: { 'text-color': 'red', column: 6, row: 7 },
          },
        },
      ],
      stages: [],
      meta: { lastScene: 2, lastColumn: 6, lastRow: 7 },
      markup: { b: { content: '"c"' } },
    },
  );
});

test('parse E', (t) => {
  const source = `
  . . .
.
.     c/C
.
scene

b
  text-content B
  position 1/2

movie

#stage
  width 1000 height 600
  rows 5 columns 5
  show-grid? yes

#player
  repeat? yes rewind? yes

a
  text-content A
  column 3 row 4
`;

  const ast = Expander.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        {
          scene: 1,
          markup: {
            b: { 'text-content': 'B', column: 1, row: 2 },
            a: { 'text-content': 'A', column: 3, row: 4 },
          },
        },
      ],
      stages: [
        {
          elements: [
            {
              id: 'c', markup: { 'text-content': 'C' }, row: 2, column: 3,
            },
          ],
          scene: 1,
        },
      ],
      meta: { lastScene: 1, lastColumn: 3, lastRow: 3 },
      markup: {
        '#stage': {
          width: 1000,
          height: 600,
          rows: 5,
          columns: 5,
          'show-grid?': true,
        },
        '#player': { 'repeat?': true, 'rewind?': true },
      },
    },
  );
});
