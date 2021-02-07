import test from 'ava';
import ElementParser from './element';

test('parse A', (t) => {
  const ast = ElementParser.parse('↥e:\'lorem "ipsum"\'');

  t.deepEqual(
    ast,
    { id: 'e', markup: { 'text-content': 'lorem "ipsum"', motion: 'show' } },
  );
});

test('parse B', (t) => {
  const ast = ElementParser.parse('a');

  t.deepEqual(ast, { id: 'a', markup: {} });
});

test('parse C', (t) => {
  const ast = ElementParser.parse('↥e/\'lorem "ipsum"\'');

  t.deepEqual(
    ast,
    { id: 'e', markup: { 'text-content': 'lorem "ipsum"', motion: 'show' } },
  );
});

test('parse D', (t) => {
  const ast = ElementParser.parse('↥e|\'lorem "ipsum"\'');

  t.deepEqual(
    ast,
    { id: 'e', markup: { 'text-content': 'lorem "ipsum"', motion: 'show' } },
  );
});
