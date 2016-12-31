import * as path from 'path';
import * as log4js from 'log4js';
import { EventEmitter } from 'events';
import { TestRunner, TestResult, RunResult, TestStatus, RunStatus, RunnerOptions, CoverageCollection } from 'stryker-api/test_runner';
import { InputFile } from 'stryker-api/core';

import tape from 'tape';

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
      try {
        this.purgeFiles();

        // this allows us to intercept test results being run below
        tape.createStream({ objectMode: true })
          .on('data', (row: any) => {
            if (row.type === 'assert' && !row.ok) {
              fail();
            }
          })
          .on('end', resolve);

        try {
          this.files.filter(file => file.included).forEach(testFile => {
            // requiring the tape file is enough to execute the tests
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
        fail(error);
      }
    });

  }
}
