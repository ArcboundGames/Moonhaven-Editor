"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemSetting = exports.canItemDamageObject = void 0;
var converters_util_1 = require("./converters.util");
var null_util_1 = require("./null.util");
function canItemDamageObject(itemType, objectType, itemCategoriesByKey) {
    if (objectType === undefined || itemType === undefined) {
        return false;
    }
    var damagesObjectKeys = getItemSetting('damagesObjectKeys', itemType, itemCategoriesByKey).value;
    if (damagesObjectKeys === null || damagesObjectKeys === void 0 ? void 0 : damagesObjectKeys.includes(objectType.key)) {
        return true;
    }
    var damagesObjectSubCategoryKeys = getItemSetting('damagesObjectSubCategoryKeys', itemType, itemCategoriesByKey).value;
    if (objectType.subCategoryKey && (damagesObjectSubCategoryKeys === null || damagesObjectSubCategoryKeys === void 0 ? void 0 : damagesObjectSubCategoryKeys.includes(objectType.subCategoryKey))) {
        return true;
    }
    var damagesObjectCategoryKeys = getItemSetting('damagesObjectCategoryKeys', itemType, itemCategoriesByKey).value;
    if (objectType.categoryKey && (damagesObjectCategoryKeys === null || damagesObjectCategoryKeys === void 0 ? void 0 : damagesObjectCategoryKeys.includes(objectType.categoryKey))) {
        return true;
    }
    return false;
}
exports.canItemDamageObject = canItemDamageObject;
function getItemSetting(setting, type, itemCategoriesByKey) {
    var _a;
    var controlledBy;
    var value;
    if ((0, null_util_1.isNullish)(type)) {
        return { value: undefined, controlledBy: 1 };
    }
    var typeSettings = (0, converters_util_1.toItemSettings)(type === null || type === void 0 ? void 0 : type.settings);
    var categorySettings = (0, null_util_1.isNotNullish)(type === null || type === void 0 ? void 0 : type.categoryKey) ? (0, converters_util_1.toItemSettings)((_a = itemCategoriesByKey === null || itemCategoriesByKey === void 0 ? void 0 : itemCategoriesByKey[type.categoryKey]) === null || _a === void 0 ? void 0 : _a.settings) : {};
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
exports.getItemSetting = getItemSetting;
