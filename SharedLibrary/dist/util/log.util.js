"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToString = exports.error = exports.warn = exports.info = exports.log = void 0;
function log() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    try {
        unityLog(dataToString.apply(void 0, data));
    }
    catch (_a) {
        console.info.apply(console, data);
    }
}
exports.log = log;
function info() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    try {
        unityLog(dataToString.apply(void 0, data));
    }
    catch (_a) {
        console.info.apply(console, data);
    }
}
exports.info = info;
function warn() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    try {
        unityLogWarning(dataToString.apply(void 0, data));
    }
    catch (_a) {
        console.warn.apply(console, data);
    }
}
exports.warn = warn;
function error() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    try {
        unityLogError(dataToString.apply(void 0, data));
    }
    catch (_a) {
        console.error.apply(console, data);
    }
}
exports.error = error;
function dataToString() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    return data.reduce(function (previous, current) { return "".concat(previous, " ").concat(current); }, '');
}
exports.dataToString = dataToString;
