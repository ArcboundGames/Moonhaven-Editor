"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanObject = void 0;
var null_util_1 = require("./null.util");
function cleanObject(data) {
    if (!data) {
        return data;
    }
    cleanObjectRecursive(data);
    return data;
}
exports.cleanObject = cleanObject;
function cleanObjectRecursive(data) {
    if (data === undefined) {
        return true;
    }
    if (Array.isArray(data)) {
        return false;
    }
    if (Object.keys(data).length === 0) {
        return true;
    }
    var hasNonEmptyKey = false;
    for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
        var key = _a[_i];
        var dataKey = key;
        if (typeof data[dataKey] === 'object') {
            var result = cleanObjectRecursive(data[dataKey]);
            if (result) {
                delete data[dataKey];
            }
            else {
                hasNonEmptyKey = true;
            }
        }
        else if ((0, null_util_1.isNotNullish)(data[dataKey])) {
            hasNonEmptyKey = true;
        }
    }
    return !hasNonEmptyKey;
}
