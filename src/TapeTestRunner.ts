import * as path from 'path';
import * as log4js from 'log4js';
import { EventEmitter } from 'events';
import { TestRunner, TestResult, RunResult, TestStatus, RunStatus, RunnerOptions, CoverageCollection } from 'stryker-api/test_runner';
import { InputFile } from 'stryker-api/core';

const tape = require('tape');

const log = log4js.getLogger('TapeTestRunner');
export default class TapeTestRunner extends EventEmitter implements TestRunner {
  private files: InputFile[];

  constructor(runnerOptions: RunnerOptions) {
    super();
    this.files = runnerOptions.files;
  }

  private purgeFiles() {
    this.files.forEach(f => delete require.cache[f.path]);
  }

  run(): Promise<RunResult> {
    return new Promise<RunResult>((resolve, fail) => {
      let testResults: TestResult[] = [];

      try {
        this.purgeFiles();

        let timeOfLastTest = Date.now();
        // this allows us to intercept test results being run below
        tape.createStream({ objectMode: true })
          .on('data', (row: any) => {
            if (row.type === 'test') {
              testResults.push({
                status: TestStatus.Success,
                name: row.name,
                timeSpentMs: 0
              });
            }
            if (row.type === 'end') {
              const timeSinceLastTest = Date.now() - timeOfLastTest;
              const relevantResult = testResults[row.test];
              relevantResult.timeSpentMs = timeSinceLastTest;
              timeOfLastTest = Date.now();
            }
            if (row.type === 'assert' && !row.ok) {
              testResults[row.id].status = TestStatus.Failed;
            }
          })
          .on('end', function () {
            resolve({
              status: RunStatus.Complete,
              tests: testResults,
              errorMessages: []
            });
          });

        try {
          this.files.filter(file => file.included).forEach(testFile => {
            // requiring the tape file is enough to execute the tests
            // NB - tape-catch is required otherwise the whole thing blows up
            // here if the test throws an exception
            require(testFile.path);
          });
        } catch (error) {
          resolve({
            status: RunStatus.Error,
            tests: [],
            errorMessages: [error]
          });
        }
      } catch (error) {
        log.error(error);
        resolve({
          status: RunStatus.Error,
          tests: [],
          errorMessages: [error]
        });
      }
    });
  }
}
