import TapeTestRunner from '../../src/TapeTestRunner';
import { TestResult, RunnerOptions, RunResult, TestStatus, RunStatus } from 'stryker-api/test_runner';
import * as path from 'path';
const test = require('tape-catch');

const countTests = (runResult: RunResult, predicate: (result: TestResult) => boolean) =>
  runResult.tests.filter(predicate).length;

const countSucceeded = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Success);
const countFailed = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Failed);
const file = (filePath: string, mutated: boolean = true, included: boolean = true) =>
  ({ path: path.resolve(filePath), mutated, included });

let sut: any;

function beforeEach() {
  const testRunnerOptions = {
    files: [
      file('./testResources/sampleProject/src/MyMath.js'),
      file('./testResources/sampleProject/test/MyMathSpec.js')],
    strykerOptions: {},
    port: 1234
  };
  sut = new TapeTestRunner(testRunnerOptions);
}

test('TapeTestRunner should report completed tests', (t: any) => {
  beforeEach();
  sut.run().then((runResult: RunResult) => {
    console.log(runResult);
    t.equal(countSucceeded(runResult), 5);
    t.equal(countFailed(runResult), 0);

    runResult.tests.forEach((testResult) => {
      t.ok(testResult.timeSpentMs > -1 && testResult.timeSpentMs < 1000, 'test should take less than 1 second' + testResult.timeSpentMs);
    });
    t.equal(runResult.status, RunStatus.Complete);
    t.notOk(runResult.coverage, 'coverage should be falsy');

    t.end();
  });
})

test('should be able to run 2 times in a row', (t: any) => {
  beforeEach();
  sut.run().then(() => sut.run()).then((runResult: RunResult) => {
    t.equal(countSucceeded(runResult), 5);
    t.end();
  });
});

test('Given that there is an error in the input file, should ignore that file and report completed tests without errors', (t: any) => {
  let options = {
    files: [
      file('testResources/sampleProject/src/MyMath.js'),
      file('testResources/sampleProject/src/Error.js', false, false),
      file('testResources/sampleProject/test/MyMathSpec.js')
    ],
    strykerOptions: {},
    port: 1234
  };
  sut = new TapeTestRunner(options);

  sut.run().then((runResult: RunResult) => {
    t.equal(runResult.status, RunStatus.Complete, 'Test result did not match');
    t.end();
  });
});

test('Given that there are multiple failed tests, should report completed tests without errors', (t: any) => {
  sut = new TapeTestRunner({
    files: [
      file('testResources/sampleProject/src/MyMath.js'),
      file('testResources/sampleProject/test/MyMathFailedSpec.js')
    ],
    strykerOptions: {},
    port: 1234
  });

  sut.run().then((runResult: RunResult) => {
    t.equal(countFailed(runResult), 1);
    t.end();
  });
});
