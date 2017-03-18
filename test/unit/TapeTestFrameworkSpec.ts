import * as chai from 'chai';
const expect = chai.expect;
import TapeTestFramework from '../../src/TapeTestFramework';

describe('TapeTestRunner', () => {
  it('beforeEach not supported yet - should just return input', () => {
    expect(TapeTestFramework.prototype.beforeEach('blah')).to.equal('blah');
  });

  it('afterEach not supported yet - should just return input', () => {
    expect(TapeTestFramework.prototype.afterEach('blah')).to.equal('blah');
  });

  it('filtering tests not supported', () => {
    expect(function () {
      TapeTestFramework.prototype.filter([1234])
    }).to.throw(/Filtering tests not supported yet. Please log an issue if you want this feature/);
  });
});
