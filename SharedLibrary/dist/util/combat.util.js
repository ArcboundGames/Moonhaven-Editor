"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectileData = exports.getDamagableData = exports.damagableObjectFilter = void 0;
var constants_1 = require("../constants");
var creatureType_util_1 = require("./creatureType.util");
var itemType_util_1 = require("./itemType.util");
var objectType_util_1 = require("./objectType.util");
function damagableObjectFilter(objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey) {
    var breakable = (0, objectType_util_1.getObjectSetting)('breakable', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey).value;
    if (breakable) {
        return true;
    }
    var hasHealth = (0, objectType_util_1.getObjectSetting)('hasHealth', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey).value;
    if (hasHealth) {
        return true;
    }
    var stagesType = (0, objectType_util_1.getObjectSetting)('stagesType', objectOrSubCategory, objectCategoriesByKey, objectSubCategoriesByKey).value;
    if (stagesType === constants_1.STAGES_TYPE_GROWABLE_WITH_HEALTH) {
        return true;
    }
    return false;
}
exports.damagableObjectFilter = damagableObjectFilter;
function getDamagableData(objectCategories, objectCategoriesByKey, objectSubCategories, objectSubCategoriesByKey, objects, creatureCategories, creatureCategoriesByKey, creatures) {
    var damagableObjectCategories = objectCategories.filter(function (objectCategory) {
        var _a, _b, _c;
        return ((_a = objectCategory.settings) === null || _a === void 0 ? void 0 : _a.breakable) ||
            ((_b = objectCategory.settings) === null || _b === void 0 ? void 0 : _b.hasHealth) ||
            ((_c = objectCategory.settings) === null || _c === void 0 ? void 0 : _c.stagesType) === constants_1.STAGES_TYPE_GROWABLE_WITH_HEALTH;
    });
    var damagableObjectSubCategories = objectSubCategories.filter(function (objectSubCategory) {
        return damagableObjectFilter(objectSubCategory, objectCategoriesByKey, objectSubCategoriesByKey);
    });
    var damagableObjects = objects.filter(function (object) { return damagableObjectFilter(object, objectCategoriesByKey, objectSubCategoriesByKey); });
    var damagableCreatureCategories = creatureCategories.filter(function (objectCategory) { var _a; return (_a = objectCategory.settings) === null || _a === void 0 ? void 0 : _a.hasHealth; });
    var damagableCreatures = creatures.filter(function (creature) { return (0, creatureType_util_1.getCreatureSetting)('hasHealth', creature, creatureCategoriesByKey).value === true; });
    return {
        damagableObjectCategories: damagableObjectCategories,
        damagableObjectCategoryKeys: damagableObjectCategories.map(function (objectCategory) { return objectCategory.key; }),
        damagableObjectSubCategories: damagableObjectSubCategories,
        damagableObjectSubCategoryKeys: damagableObjectSubCategories.map(function (objectSubCategory) { return objectSubCategory.key; }),
        damagableObjects: damagableObjects,
        damagableObjectKeys: damagableObjects.map(function (object) { return object.key; }),
        damagableCreatureCategories: damagableCreatureCategories,
        damagableCreatureCategoryKeys: damagableCreatureCategories.map(function (creatureCategory) { return creatureCategory.key; }),
        damagableCreatures: damagableCreatures,
        damagableCreatureKeys: damagableCreatures.map(function (creature) { return creature.key; })
    };
}
exports.getDamagableData = getDamagableData;
function getProjectileData(itemCategories, itemCategoriesByKey, items) {
    var projectileItemCategories = itemCategories.filter(function (itemCategory) { var _a; return ((_a = itemCategory.settings) === null || _a === void 0 ? void 0 : _a.weaponType) === constants_1.WEAPON_TYPE_PROJECTILE; });
    var projectileItems = items.filter(function (item) { return (0, itemType_util_1.getItemSetting)('weaponType', item, itemCategoriesByKey).value === constants_1.WEAPON_TYPE_PROJECTILE; });
    return {
        projectileItemCategories: projectileItemCategories,
        projectileItemCategoryKeys: projectileItemCategories.map(function (itemCategory) { return itemCategory.key; }),
        projectileItems: projectileItems,
        projectileItemKeys: projectileItems.map(function (item) { return item.key; })
    };
}
exports.getProjectileData = getProjectileData;
