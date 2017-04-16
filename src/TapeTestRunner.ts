import * as path from 'path';
import * as log4js from 'log4js';
import { EventEmitter } from 'events';
import { TestRunner, TestResult, RunResult, TestStatus, RunStatus, RunnerOptions, CoverageCollection } from 'stryker-api/test_runner';
import { InputFile } from 'stryker-api/core';

const tape = require('tape');

const log = log4js.getLogger('TapeTestRunner');
export default class TapeTestRunner extends EventEmitter implements TestRunner {
  private files: InputFile[];
  private port: number;

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
        console.log('lets purge');
        this.purgeFiles();
        console.log('purged');

        let timeOfLastTest = Date.now();
        console.log('the time is now');
        // this allows us to intercept test results being run below
        tape.createStream({ objectMode: true, port: this.port })
          .on('data', (row: any) => {
            console.log(`got row ${JSON.stringify(row)}`);
            if (row.type === 'test') {
              testResults.push({
                status: TestStatus.Success,
                name: row.name,
                timeSpentMs: 0
              });
              console.log(`I now have ${testResults.length} test results`);
            }
            if (row.type === 'end') {
              const timeSinceLastTest = Date.now() - timeOfLastTest;
              const relevantResult = testResults[row.test];
              relevantResult.timeSpentMs = timeSinceLastTest;
              timeOfLastTest = Date.now();
              
              console.log(`Last test!`);
            }
            if (row.type === 'assert' && !row.ok) {
              testResults[row.id].status = TestStatus.Failed;
              
              console.log(`I failed!`);
            }
          })
          .on('end', function () {
            
              console.log(`Resolving with complete`);
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
            
              console.log(`Requiring ${JSON.stringify(testFile)}`);
            require(testFile.path);
          });
        } catch (error) {
           console.log(`Requiring went wrong ${JSON.stringify(error)}`);
          resolve({
            status: RunStatus.Error,
            tests: [],
            errorMessages: [error]
          });
        }
      } catch (error) {
        
           console.log(`Some error: ${JSON.stringify(error)}`);
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
