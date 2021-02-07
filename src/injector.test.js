import test from 'ava';

import Injector from './injector';

test('Injector', (t) => {
  const error = t.throws(() => {
    new Injector({}); // eslint-disable-line no-new
  }, { instanceOf: Error });

  t.is(error.message, 'Missing pixi dependency.');
});
