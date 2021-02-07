import test from 'ava';
import MovieParser from './01-movie';

test('parse A', (t) => {
  const source = `  1 2 3
1 b
2
3
-----------
  1 2 3
1
2   b
3

>

b
  text-content 1
----------
^

*
  text-color #FFF`;

  const ast = MovieParser.parse(source);

  t.deepEqual(
    ast,
    {
      sections: [
        { stage: '  1 2 3\n1 b\n2\n3', position: 1 },
        {
          stage: '  1 2 3\n1\n2   b\n3',
          markup: '>\nb\n  text-content 1',
          position: 2,
        },
      ],
      markup: '*\n  text-color #FFF',
    },
  );
});

test('parse B', (t) => {
  const source = `
  1 2 3
1
2   b
3

scene 1
b
  color red

scene 2
b
  color white
`;

  const ast = MovieParser.parse(source);

  t.deepEqual(
    ast,
    {
      sections: [
        {
          stage: '  1 2 3\n1\n2   b\n3',
          markup: 'scene 1\nb\n  color red\nscene 2\nb\n  color white',
          position: 1,
        },
      ],
      markup: '',
    },
  );
});
