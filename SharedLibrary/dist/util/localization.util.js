"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortLocalization = exports.getLocalizedValue = exports.getEnglishLocalization = exports.getLocalizationKey = void 0;
var constants_1 = require("../constants");
var null_util_1 = require("./null.util");
function getLocalizationKey(prefix, key, dataKey) {
    return dataKey ? "".concat(prefix, "_").concat(dataKey.toLowerCase(), "_").concat(key) : "".concat(prefix, "_").concat(key);
}
exports.getLocalizationKey = getLocalizationKey;
function getEnglishLocalization(localizations) {
    var index = localizations.findIndex(function (localization) { return localization.key.toLowerCase() === constants_1.ENGLISH_LOCALIZATION.toLowerCase(); });
    if (index < 0) {
        return {
            englishLocalization: null,
            englishIndex: index
        };
    }
    return {
        englishLocalization: localizations[index],
        englishIndex: index
    };
}
exports.getEnglishLocalization = getEnglishLocalization;
function getLocalizedValue(localization, keys, key) {
    var _a;
    if ((0, null_util_1.isNullish)(localization)) {
        return '';
    }
    var index = keys.indexOf(key);
    if (index < 0) {
        return '';
    }
    return (_a = localization.values[key]) !== null && _a !== void 0 ? _a : '';
}
exports.getLocalizedValue = getLocalizedValue;
function sortLocalization(localization) {
    return __assign(__assign({}, localization), { values: Object.entries(localization.values)
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return a.localeCompare(b);
        })
            .reduce(function (r, _a) {
            var _b;
            var k = _a[0], v = _a[1];
            return (__assign(__assign({}, r), (_b = {}, _b[k] = v, _b)));
        }, {}) });
}
exports.sortLocalization = sortLocalization;
