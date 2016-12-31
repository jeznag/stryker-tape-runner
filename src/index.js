"use strict";
var test_runner_1 = require("stryker-api/test_runner");
var test_framework_1 = require("stryker-api/test_framework");
var TapeTestRunner_1 = require("./TapeTestRunner");
var TapeTestFramework_1 = require("./TapeTestFramework");
test_runner_1.TestRunnerFactory.instance().register('tape', TapeTestRunner_1.default);
test_framework_1.TestFrameworkFactory.instance().register('tape', TapeTestFramework_1.default);
//# sourceMappingURL=index.js.map