const test = require('tape-catch');
import TapeTestFramework from '../../src/TapeTestFramework';

test('beforeEach', (t: any) => {
  t.equal(true, true);
  t.end();
});

test('afterEach', (t: any) => {
  t.equal(true, true);
  t.end();
});

test('beforeEach', (t: any) => {
  try {
    TapeTestFramework.prototype.filter([1234]);
  } catch (e) {
    t.equal(e.message, 'Filtering tests not supported yet. Please log an issue if you want this feature');
    t.end();
  }
});
