import test from 'ava';
import FlowParser from './flow';

test('parse A', (t) => {
  const ast = FlowParser.parse(`
  [
    >

      3

        1/2
        background-color white
    >

      4
  6/7
  text-color red
  ]
`);

  t.deepEqual(
    ast,
    {
      timeline: [
        {
          'background-color': 'white', scene: 3, column: 1, row: 2,
        },
        {
          'text-color': 'red', scene: 4, column: 6, row: 7,
        },
      ],
      previousScene: 4,
    },
  );
});

test('parse B', (t) => {
  const ast = FlowParser.parse(`
  [> 1/2 background-color white
   > 6/7 text-color red
  ]
`);

  t.deepEqual(
    ast,
    {
      timeline: [
        {
          'background-color': 'white', scene: 1, column: 1, row: 2,
        },
        {
          'text-color': 'red', scene: 2, column: 6, row: 7,
        },
      ],
      previousScene: 2,
    },
  );
});

test('parse C', (t) => {
  const ast = FlowParser.parse(`
  [> 7 1/2 background-color white
   > 6/7 text-color red
  ]
`);

  t.deepEqual(
    ast,
    {
      timeline: [
        {
          'background-color': 'white', scene: 7, column: 1, row: 2,
        },
        {
          'text-color': 'red', scene: 8, column: 6, row: 7,
        },
      ],
      previousScene: 8,
    },
  );
});

test('parse D', (t) => {
  const ast = FlowParser.parse(`
  [> 1/2 background-color white
   > 6/7 text-color red
  ]
`, 3);

  t.deepEqual(
    ast,
    {
      timeline: [
        {
          'background-color': 'white', scene: 4, column: 1, row: 2,
        },
        {
          'text-color': 'red', scene: 5, column: 6, row: 7,
        },
      ],
      previousScene: 5,
    },
  );
});
