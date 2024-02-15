"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCaseFromVariableName = exports.toTitleCaseFromKey = exports.isNotEmpty = exports.isEmpty = void 0;
var null_util_1 = require("./null.util");
function isEmpty(value) {
    return (0, null_util_1.isNullish)(value) || value === '';
}
exports.isEmpty = isEmpty;
function isNotEmpty(value) {
    return (0, null_util_1.isNotNullish)(value) && value !== '';
}
exports.isNotEmpty = isNotEmpty;
function toTitleCaseFromKey(str) {
    return str.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}
exports.toTitleCaseFromKey = toTitleCaseFromKey;
function toTitleCaseFromVariableName(str) {
    return str
        .split(/(?=[A-Z])/)
        .join(' ')
        .replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}
exports.toTitleCaseFromVariableName = toTitleCaseFromVariableName;
