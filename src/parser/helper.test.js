import test from 'ava';
import ParserHelper from './helper';

test('rightTrim', (t) => {
  t.true(ParserHelper.rightTrim('  a  ') === '  a');
});

test('removeVoids', (t) => {
  const content = `

  1 2 3  
1 b  
2   
    
3 

`;

  const result = ParserHelper.removeVoids(content);
  const expected = `  1 2 3
1 b
2
3`;

  t.true(result === expected);
});
