"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssert = void 0;
var null_util_1 = require("./null.util");
var string_util_1 = require("./string.util");
function createAssert() {
    var errors = [];
    var assert = function (condition, errorMessage) {
        if (!condition) {
            errors.push(errorMessage);
            return false;
        }
        return true;
    };
    var assertNotNullish = function (input, errorMessage) {
        if ((0, null_util_1.isNullish)(input)) {
            errors.push(errorMessage);
            return false;
        }
        return true;
    };
    var assertNotEmpty = function (input, errorMessage) {
        if (!(0, string_util_1.isNotEmpty)(input)) {
            errors.push(errorMessage);
            return false;
        }
        return true;
    };
    return { errors: errors, assert: assert, assertNotNullish: assertNotNullish, assertNotEmpty: assertNotEmpty };
}
exports.createAssert = createAssert;
