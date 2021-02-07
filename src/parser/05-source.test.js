import test from 'ava';
import SourceParser from './05-source';

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

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 2,
              column: 2,
              'text-content': 'red',
            },
            id: 'b',
          },
        ],
        [{ markup: { 'text-content': 'white' }, id: 'b' }],
        [{ markup: { 'text-content': 'green' }, id: 'b' }],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 100,
          height: 20,
          'show-grid?': false,
          columns: 3,
          rows: 3,
        },
        '#player': { 'repeat?': false, 'rewind?': false },
      },
    },
  );
});

test('parse B', (t) => {
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

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 16777215,
              'background-color': 13458524,
              row: 1,
              column: 1,
            },
            id: 'b',
          },
        ],
        [
          {
            markup: {
              row: 2,
              column: 2,
              'text-color': 16711680,
              'text-content': 'lorem',
            },
            id: 'b',
          },
        ],
        [
          {
            markup: {
              'text-color': 255,
              'background-color': 13458524,
              row: 3,
              column: 1,
            },
            id: 'a',
          },
          { markup: { row: 3, column: 3, motion: 'hide' }, id: 'b' },
        ],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 600,
          height: 400,
          'show-grid?': false,
          columns: 3,
          rows: 3,
        },
        '#player': { 'repeat?': false, 'rewind?': false },
      },
    },
  );
});

test('parse C', (t) => {
  const source = `
--------
    1
1 ↥a/"A"
--------
   2
2 a/"B"
--------
  1
3 a
--------
  3
1 a
>
a
  text-color red
--------
   3
3 a/"C"
>
a
  background-color dark-blue
  text-color white
--------
   3
3 ↧a
   1
1 ↥b
--------
1 ↧b
--------

^

#stage
  background-color #333
  width 1100 height 400
  show-grid? yes

#player
  repeat? yes rewind? yes

*
  text-color indian-red
  background-color white
  text-content Z

a
  background-color black
  text-color yellow
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 16776960,
              'background-color': 0,
              'text-content': 'A',
              row: 1,
              column: 1,
              motion: 'show',
            },
            id: 'a',
          },
        ],
        [{ markup: { row: 2, column: 2, 'text-content': 'B' }, id: 'a' }],
        [{ markup: { row: 3, column: 1 }, id: 'a' }],
        [
          {
            markup: { row: 1, column: 3, 'text-color': 16711680 },
            id: 'a',
          },
        ],
        [
          {
            markup: {
              row: 3,
              column: 3,
              'text-content': 'C',
              'background-color': 139,
              'text-color': 16777215,
            },
            id: 'a',
          },
        ],
        [
          { markup: { row: 3, column: 3, motion: 'hide' }, id: 'a' },
          {
            markup: {
              'text-color': 13458524,
              'background-color': 16777215,
              'text-content': 'Z',
              row: 1,
              column: 1,
              motion: 'show',
            },
            id: 'b',
          },
        ],
        [{ markup: { row: 1, column: 1, motion: 'hide' }, id: 'b' }],
      ],
      markup: {
        '#stage': {
          'background-color': 3355443,
          width: 1100,
          height: 400,
          'show-grid?': true,
          columns: 3,
          rows: 3,
        },
        '#player': { 'repeat?': true, 'rewind?': true },
      },
    },
  );
});

test('parse D', (t) => {
  const source = `
--------
    1
1 ↥a/A
--------
   2
2 a/B
--------
  1
3 a
--------
  3
1 a
--------
   3
3 a/C
--------
   3
3 ↧a

   1
1 ↥b
--------

>
#stage
  background-color Black
  width 1100
  height 400
  show-grid? yes

#player
  repeat? yes
  rewind? yes

*
  text-color white
  background-color red
  text-content Z

a
  background-color #123
  text-color indian-red
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 1,
              column: 1,
              'text-content': 'A',
              motion: 'show',
            },
            id: 'a',
          },
        ],
        [{ markup: { row: 2, column: 2, 'text-content': 'B' }, id: 'a' }],
        [{ markup: { row: 3, column: 1 }, id: 'a' }],
        [{ markup: { row: 1, column: 3 }, id: 'a' }],
        [{ markup: { row: 3, column: 3, 'text-content': 'C' }, id: 'a' }],
        [
          { markup: { row: 3, column: 3, motion: 'hide' }, id: 'a' },
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 1,
              column: 1,
              motion: 'show',
            },
            id: 'b',
          },
        ],
        [
          {
            markup: {
              'text-color': 13458524,
              'background-color': 1192755,
              'text-content': 'Z',
            },
            id: 'a',
          },
        ],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 1100,
          height: 400,
          'show-grid?': true,
          columns: 3,
          rows: 3,
        },
        '#player': { 'repeat?': true, 'rewind?': true },
      },
    },
  );
});

test('parse E', (t) => {
  const source = `
--------
  1
1 a
>
#stage
  width 1234
--------
  1
1 b
^
#stage
  height 4321
--------
  1
1 c
-------
>
#player
  repeat? true
-------
>
#stage
  show-grid? true
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 1,
              column: 1,
            },
            id: 'a',
          },
        ],
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 1,
              column: 1,
            },
            id: 'b',
          },
        ],
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              row: 1,
              column: 1,
            },
            id: 'c',
          },
        ],
        [],
        [],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 1234,
          height: 4321,
          'show-grid?': true,
          columns: 1,
          rows: 1,
        },
        '#player': { 'repeat?': true, 'rewind?': false },
      },
    },
  );
});

test('parse F', (t) => {
  const source = `

>
a
  flow [
    > 2/2 background-color yellow
    > 3/4 text-color blue
  ]

^
b
  flow [
    > 1/2 background-color white
    > 6/7 text-color red
  ]
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      resources: { fonts: [] },
      scenes: [
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 'yellow',
              column: 2,
              row: 2,
            },
            id: 'a',
          },
          {
            markup: {
              'text-color': 0,
              'background-color': 'white',
              column: 1,
              row: 2,
            },
            id: 'b',
          },
        ],
        [
          { markup: { 'text-color': 'blue', column: 3, row: 4 }, id: 'a' },
          { markup: { 'text-color': 'red', column: 6, row: 7 }, id: 'b' },
        ],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 600,
          height: 400,
          'show-grid?': false,
          columns: 6,
          rows: 7,
        },
        '#player': { 'repeat?': false, 'rewind?': false },
      },
    },
  );
});

test('parse G', (t) => {
  const source = `
scene

b
  text-font BFont
  flow [ > 3 text-font CFont ]

movie

#stage
  width 1000 height 600
  rows 5 columns 5
  show-grid? yes

a
  text-content "Hello, World!"
  text-color white
  text-font AFont
  flow [ > 3/3 motion show > text-font DFont ]

c
  text-font AFont
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        [
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              'text-font': 'BFont',
            },
            id: 'b',
          },
          {
            markup: {
              'text-color': 16777215,
              'background-color': 16777215,
              'text-content': 'Hello, World!',
              'text-font': 'AFont',
              motion: 'show',
              column: 3,
              row: 3,
            },
            id: 'a',
          },
          {
            markup: {
              'text-color': 0,
              'background-color': 16777215,
              'text-font': 'AFont',
            },
            id: 'c',
          },
        ],
        [{ markup: { 'text-font': 'DFont' }, id: 'a' }],
        [{ markup: { 'text-font': 'CFont' }, id: 'b' }],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 1000,
          height: 600,
          'show-grid?': true,
          columns: 5,
          rows: 5,
        },
        '#player': { 'repeat?': false, 'rewind?': false },
      },
      resources: { fonts: ['BFont', 'AFont', 'DFont', 'CFont'] },
    },
  );
});

test('parse H', (t) => {
  const source = `
movie

#stage
  width 1000 height 600
  rows 5 columns 5
  show-grid? yes

scene

welcome
  text-content "Welcome!"
  flow [ > 3/2 motion show ]
  text-color white
  text-font FrederickaTheGreat

scene

hello
  text-content "Hello, World!"
  text-color white
  text-font Pacifico
  flow [ > 3/4 motion show ]
`;

  const ast = SourceParser.parse(source);

  t.deepEqual(
    ast,
    {
      scenes: [
        [
          {
            markup: {
              'text-color': 16777215,
              'background-color': 16777215,
              'text-content': 'Welcome!',
              'text-font': 'FrederickaTheGreat',
              motion: 'show',
              column: 3,
              row: 2,
            },
            id: 'welcome',
          },
        ],
        [
          {
            markup: {
              'text-color': 16777215,
              'background-color': 16777215,
              'text-content': 'Hello, World!',
              'text-font': 'Pacifico',
              motion: 'show',
              column: 3,
              row: 4,
            },
            id: 'hello',
          },
        ],
      ],
      markup: {
        '#stage': {
          'background-color': 0,
          width: 1000,
          height: 600,
          'show-grid?': true,
          columns: 5,
          rows: 5,
        },
        '#player': { 'repeat?': false, 'rewind?': false },
      },
      resources: { fonts: ['FrederickaTheGreat', 'Pacifico'] },
    },
  );
});
