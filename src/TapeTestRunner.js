"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var log4js = require("log4js");
var events_1 = require("events");
var test_runner_1 = require("stryker-api/test_runner");
var tape = require('tape');
var log = log4js.getLogger('TapeTestRunner');
var TapeTestRunner = (function (_super) {
    __extends(TapeTestRunner, _super);
    function TapeTestRunner(runnerOptions) {
        var _this = _super.call(this) || this;
        _this.files = runnerOptions.files;
        return _this;
    }
    TapeTestRunner.prototype.purgeFiles = function () {
        this.files.forEach(function (f) { return delete require.cache[f.path]; });
    };
    TapeTestRunner.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve, fail) {
            var testResults = [];
            try {
                _this.purgeFiles();
                var timeOfLastTest_1 = Date.now();
                tape.createStream({ objectMode: true, port: _this.port })
                    .on('data', function (row) {
                    if (row.type === 'test') {
                        testResults.push({
                            status: test_runner_1.TestStatus.Success,
                            name: row.name,
                            timeSpentMs: 0
                        });
                    }
                    if (row.type === 'end') {
                        var timeSinceLastTest = Date.now() - timeOfLastTest_1;
                        var relevantResult = testResults[row.test];
                        relevantResult.timeSpentMs = timeSinceLastTest;
                        timeOfLastTest_1 = Date.now();
                    }
                    if (row.type === 'assert' && !row.ok) {
                        testResults[row.id].status = test_runner_1.TestStatus.Failed;
                    }
                })
                    .on('end', function () {
                    resolve({
                        status: test_runner_1.RunStatus.Complete,
                        tests: testResults,
                        errorMessages: []
                    });
                });
                try {
                    _this.files.filter(function (file) { return file.included; }).forEach(function (testFile) {
                        require(testFile.path);
                    });
                }
                catch (error) {
                    resolve({
                        status: test_runner_1.RunStatus.Error,
                        tests: [],
                        errorMessages: [error]
                    });
                }
            }
            catch (error) {
                log.error(error);
                resolve({
                    status: test_runner_1.RunStatus.Error,
                    tests: [],
                    errorMessages: [error]
                });
            }
        });
    };
    return TapeTestRunner;
}(events_1.EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TapeTestRunner;
//# sourceMappingURL=TapeTestRunner.js.map