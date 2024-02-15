"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatureSetting = void 0;
var converters_util_1 = require("./converters.util");
var null_util_1 = require("./null.util");
function getCreatureSetting(setting, type, creatureCategoriesByKey) {
    var _a;
    var controlledBy;
    var value;
    if ((0, null_util_1.isNullish)(type)) {
        return { value: undefined, controlledBy: 1 };
    }
    var typeSettings = (0, converters_util_1.toCreatureSettings)(type === null || type === void 0 ? void 0 : type.settings);
    var categorySettings = (0, null_util_1.isNotNullish)(type === null || type === void 0 ? void 0 : type.categoryKey) ? (0, converters_util_1.toCreatureSettings)((_a = creatureCategoriesByKey === null || creatureCategoriesByKey === void 0 ? void 0 : creatureCategoriesByKey[type.categoryKey]) === null || _a === void 0 ? void 0 : _a.settings) : {};
    if ((0, null_util_1.isNotNullish)(typeSettings === null || typeSettings === void 0 ? void 0 : typeSettings[setting])) {
        value = typeSettings === null || typeSettings === void 0 ? void 0 : typeSettings[setting];
        controlledBy = 0;
    }
    else {
        value = categorySettings === null || categorySettings === void 0 ? void 0 : categorySettings[setting];
        controlledBy = 1;
    }
    return { value: value, controlledBy: controlledBy };
}
exports.getCreatureSetting = getCreatureSetting;
