"use strict";
var test_runner_1 = require("stryker-api/test_runner");
var log4js = require("log4js");
var Timer_1 = require("./Timer");
var log = log4js.getLogger('StrykerTapeReporter');
var StrykerTapeReporter = (function () {
    function StrykerTapeReporter(runner) {
        this.runner = runner;
        this.timer = new Timer_1.default();
        this.passedCount = 0;
        this.registerEvents();
    }
    StrykerTapeReporter.prototype.registerEvents = function () {
        var _this = this;
        this.runner.on('start', function () {
            _this.passedCount = 0;
            _this.timer.reset();
            _this.runResult = {
                status: test_runner_1.RunStatus.Error,
                tests: [],
                errorMessages: []
            };
            log.debug('Starting Tape test run');
        });
        this.runner.on('pass', function (test) {
            _this.runResult.tests.push({
                status: test_runner_1.TestStatus.Success,
                name: test.fullTitle(),
                timeSpentMs: _this.timer.elapsedMs()
            });
            _this.passedCount++;
            _this.timer.reset();
            log.debug("Test passed: " + test.fullTitle());
        });
        this.runner.on('fail', function (test, err) {
            _this.runResult.tests.push({
                status: test_runner_1.TestStatus.Failed,
                name: test.fullTitle(),
                timeSpentMs: _this.timer.elapsedMs(),
                failureMessages: [err.message]
            });
            _this.runResult.errorMessages.push(err.message);
            log.debug("Test failed: " + test.fullTitle() + ". Error: " + err.message);
        });
        this.runner.on('end', function () {
            _this.runResult.status = test_runner_1.RunStatus.Complete;
            _this.runner.runResult = _this.runResult;
            log.debug("Tape test run completed: " + _this.passedCount + "/" + _this.runResult.tests.length + " passed");
        });
    };
    return StrykerTapeReporter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StrykerTapeReporter;
//# sourceMappingURL=StrykerTapeReporter.js.map