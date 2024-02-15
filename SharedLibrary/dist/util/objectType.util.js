"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectSetting = void 0;
var converters_util_1 = require("./converters.util");
var null_util_1 = require("./null.util");
function hasSubCategory(type) {
    return Boolean(type && 'subCategoryKey' in type);
}
function getObjectSetting(setting, type, categoriesByKey, subCategoriesByKey) {
    var _a, _b;
    var controlledBy;
    var value;
    if ((0, null_util_1.isNullish)(type)) {
        return { value: undefined, controlledBy: 2 };
    }
    var typeSettings = (0, converters_util_1.toObjectSettings)((0, converters_util_1.toProcessedRawObjectSettings)(type === null || type === void 0 ? void 0 : type.settings));
    var subCategorySettings = hasSubCategory(type) && (0, null_util_1.isNotNullish)(type === null || type === void 0 ? void 0 : type.subCategoryKey)
        ? (0, converters_util_1.toObjectSettings)((0, converters_util_1.toProcessedRawObjectSettings)((_a = subCategoriesByKey === null || subCategoriesByKey === void 0 ? void 0 : subCategoriesByKey[type.subCategoryKey]) === null || _a === void 0 ? void 0 : _a.settings))
        : {};
    var categorySettings = (0, null_util_1.isNotNullish)(type === null || type === void 0 ? void 0 : type.categoryKey)
        ? (0, converters_util_1.toObjectSettings)((0, converters_util_1.toProcessedRawObjectSettings)((_b = categoriesByKey === null || categoriesByKey === void 0 ? void 0 : categoriesByKey[type.categoryKey]) === null || _b === void 0 ? void 0 : _b.settings))
        : {};
    if ((0, null_util_1.isNotNullish)(typeSettings === null || typeSettings === void 0 ? void 0 : typeSettings[setting])) {
        value = typeSettings === null || typeSettings === void 0 ? void 0 : typeSettings[setting];
        controlledBy = 0;
    }
    else if ((0, null_util_1.isNotNullish)(subCategorySettings === null || subCategorySettings === void 0 ? void 0 : subCategorySettings[setting])) {
        value = subCategorySettings === null || subCategorySettings === void 0 ? void 0 : subCategorySettings[setting];
        controlledBy = 1;
    }
    else {
        value = categorySettings === null || categorySettings === void 0 ? void 0 : categorySettings[setting];
        controlledBy = 2;
    }
    return { value: value, controlledBy: controlledBy };
}
exports.getObjectSetting = getObjectSetting;
