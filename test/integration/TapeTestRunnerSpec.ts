import TapeTestRunner from '../../src/TapeTestRunner';
import { TestResult, RunnerOptions, RunResult, TestStatus, RunStatus } from 'stryker-api/test_runner';
import * as chai from 'chai';
import * as path from 'path';
const expect = chai.expect;

const countTests = (runResult: RunResult, predicate: (result: TestResult) => boolean) =>
  runResult.tests.filter(predicate).length;

const countSucceeded = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Success);
const countFailed = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Failed);
const file = (filePath: string, mutated: boolean = true, included: boolean = true) =>
  ({ path: path.resolve(filePath), mutated, included });

function generateTestRunner() {
  let sut: any;
  let port: any = (Math.random() * 1000).toFixed(0);
  const testRunnerOptions = {
    files: [
      file('./testResources/sampleProject/src/MyMath.js'),
      file('./testResources/sampleProject/test/MyMathSpec.js')],
    strykerOptions: {},
    port
  };
  sut = new TapeTestRunner(testRunnerOptions);
  return sut;
}

describe('TapeTestRunner', () => {

  it('should report completed tests', (done: any) => {
    const sut = generateTestRunner();
    sut.run().then((runResult: RunResult) => {
      expect(countSucceeded(runResult)).to.equal(5);
      expect(countFailed(runResult)).to.equal(0);

      runResult.tests.forEach((testResult) => {
        expect(testResult.timeSpentMs > -1 && testResult.timeSpentMs < 1000).to.be.ok;
      });
      expect(runResult.status).to.equal(RunStatus.Complete);
      expect(runResult.coverage).to.not.be.ok;

      done();
    });
  });

  it('should be able to run 2 times in a row', (done: any) => {
    const sut = generateTestRunner();
    sut.run().then(() => sut.run()).then((runResult: RunResult) => {
      expect(countSucceeded(runResult)).to.equal(5);
      done();
    });
  });

  it('Given that there is an error in the input file, should ignore that file and report completed tests without errors', (done: any) => {
    let options = {
      files: [
        file('testResources/sampleProject/src/MyMath.js'),
        file('testResources/sampleProject/src/Error.js', false, false),
        file('testResources/sampleProject/test/MyMathSpec.js')
      ],
      strykerOptions: {},
      port: 1234
    };
    const sut = new TapeTestRunner(options);

    sut.run().then((runResult: RunResult) => {
      expect(runResult.status).to.equal(RunStatus.Complete);
      done();
    });
  });

  it('Given that there are multiple failed tests, should report completed tests without errors', (done: any) => {
    const sut = new TapeTestRunner({
      files: [
        file('testResources/sampleProject/src/MyMath.js'),
        file('testResources/sampleProject/test/MyMathFailedSpec.js')
      ],
      strykerOptions: {},
      port: 1234
    });

    sut.run();
    sut.run().then((runResult: RunResult) => {
      expect(countFailed(runResult)).to.equal(1);
      done();
    });
  });
});
