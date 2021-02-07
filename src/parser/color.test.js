import test from 'ava';
import ColorParser from './color';

test('parse', (t) => {
  t.true(ColorParser.parse('#FFFFFF') === 16777215);
  t.true(ColorParser.parse('#FFF') === 16777215);
  t.true(ColorParser.parse('0xFFF') === 16777215);
  t.true(ColorParser.parse('Dodger-Blue') === 2003199);
  t.true(ColorParser.parse(2003199) === 2003199);
});
