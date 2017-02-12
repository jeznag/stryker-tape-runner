"use strict";
var TapeTestFramework = (function () {
    function TapeTestFramework(settings) {
        this.settings = settings;
    }
    TapeTestFramework.prototype.beforeEach = function (codeFragment) {
        // beforeEach not really supported in tape. Need to use redtape for this feature
        return "" + codeFragment;
    };
    TapeTestFramework.prototype.afterEach = function (codeFragment) {
        // afterEach not really supported in tape. Need to use redtape for this feature
        return "" + codeFragment;
    };
    TapeTestFramework.prototype.filter = function (testIds) {
        throw new Error('Filtering tests not supported yet. Please log an issue if you want this feature');
    };
    return TapeTestFramework;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TapeTestFramework;
//# sourceMappingURL=TapeTestFramework.js.map