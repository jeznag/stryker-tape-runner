"use strict";
var TapeTestFramework = (function () {
    function TapeTestFramework(settings) {
        this.settings = settings;
    }
    TapeTestFramework.prototype.beforeEach = function (codeFragment) {
        throw new Error('beforeEach is not really supported in tape. Please use redtape if you want this feature.');
    };
    TapeTestFramework.prototype.afterEach = function (codeFragment) {
        throw new Error('afterEach is not really supported in tape. Please use redtape if you want this feature.');
    };
    TapeTestFramework.prototype.filter = function (testIds) {
        throw new Error('Filtering tests not supported yet. Please log an issue if you want this feature');
    };
    return TapeTestFramework;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TapeTestFramework;
//# sourceMappingURL=TapeTestFramework.js.map