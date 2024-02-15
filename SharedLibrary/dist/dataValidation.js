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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectSubCategoryPlacementSpawningTab = exports.validateObjectSubCategoryGeneralTab = exports.validateObjectSubCategory = exports.validateObjectSubCategories = exports.checkObjectCategoriesRequiredSettings = exports.validateObjectCategoryPlacementSpawningTab = exports.validateObjectCategoryGeneralTab = exports.validateObjectCategory = exports.validateObjectCategories = exports.assertIngredient = exports.addToCategory = exports.validateCraftingRecipe = exports.validateCraftingRecipes = exports.validateCraftingRecipeCategory = exports.validateCraftingRecipeCategories = exports.assertLootTableComponent = exports.assertLootTableComponentGroup = exports.validateLootTable = exports.validateLootTables = exports.checkItemCombatConnections = exports.checkItemGeneralConnections = exports.checkItemsConnections = exports.checkItemCategoryConnection = exports.checkItemCategoryConnections = exports.assertFishingPoleAnchorPoints = exports.validateItemFishingTab = exports.validateItemCombatTab = exports.validateItemGeneralTab = exports.validateItem = exports.validateItems = exports.validateItemCategoryCombatTab = exports.validateItemCategoryGeneralTab = exports.validateItemCategory = exports.validateItemCategories = exports.assertCreatureSprites = exports.assertCreatureSprite = exports.assertCreatureShop = exports.assertCampSpawn = exports.checkCreatureConnections = exports.checkCreaturesConnections = exports.validateCreatureSpawningTab = exports.validateCreatureBehaviorTab = exports.validateCreatureShopTab = exports.validateCreatureSpriteStageTab = exports.validateCreatureGeneralTab = exports.validateCreature = exports.validateCreatures = exports.validateCreatureCategory = exports.validateCreatureCategories = exports.validateData = void 0;
exports.validateLocalization = exports.validateLocalizations = exports.validateLocalizationKey = exports.validateLocalizationKeys = exports.assertSkillLevel = exports.validateSkill = exports.validateSkills = exports.validateFishingZone = exports.validateFishingZones = exports.validateWorldSettingsWeatherTab = exports.validateWorldSettings = exports.validateEventLog = exports.validateEventLogs = exports.validateDialogueResponse = exports.validateDialogueResponses = exports.validateDialogue = exports.validateDialogues = exports.validateDialogueTreeDialogueTab = exports.validateDialogueTreeConditionsTab = exports.validateDialogueTreeGeneralTab = exports.validateDialogueTree = exports.validateDialogueTrees = exports.validateStartingItems = exports.validatePlayerStats = exports.validatePlayerDataLevelsTab = exports.validatePlayerDataGeneralTab = exports.validatePlayerData = exports.checkObjectRequiredAdjacentSettings = exports.checkObjectRequiredBelowSettings = exports.checkObjectsRequiredSettings = exports.assertBoxCollider = exports.assertObjectCollider = exports.assertObjectColliders = exports.assertObjectSpriteColliders = exports.assertColliders = exports.assertSubCategorySpriteRules = exports.assertSpawningConditions = exports.assertBreakableStage = exports.assertHealthStage = exports.assertGrowableStage = exports.assertObjectSprite = exports.validatePhysicsTab = exports.assertSpriteCounts = exports.validateObjectSpriteStageTab = exports.validateObjectPlacementSpawningTab = exports.validateObjectGeneralTab = exports.validateObject = exports.validateObjects = exports.checkObjectSubCategoriesRequiredSettings = exports.validateObjectSubCategorySpriteRulesTab = void 0;
exports.assertWorldZoneSpawn = exports.validateWorldZone = exports.validateWorldZones = exports.validateQuestRewardsTab = exports.assertQuestObjective = exports.assertQuestTask = exports.validateQuestTasksTab = exports.validateQuestGeneralTab = exports.validateQuest = exports.validateQuests = void 0;
var constants_1 = require("./constants");
var dataValidation = __importStar(require("./dataValidation"));
var assert_util_1 = require("./util/assert.util");
var combat_util_1 = require("./util/combat.util");
var converters_util_1 = require("./util/converters.util");
var creatureType_util_1 = require("./util/creatureType.util");
var itemType_util_1 = require("./util/itemType.util");
var localization_util_1 = require("./util/localization.util");
var null_util_1 = require("./util/null.util");
var objectType_util_1 = require("./util/objectType.util");
var string_util_1 = require("./util/string.util");
function validateData(rawCreatureCategories, rawCreatures, creatureAnimations, creaturePortraits, rawItemCategories, rawItems, itemIconSizes, itemAnimations, rawLootTables, rawCraftingRecipesCategories, rawCraftingRecipes, rawObjectCategories, rawObjectSubCategories, rawObjects, objectSpriteCounts, objectAccentSpriteCounts, rawPlayerData, rawDialogueTrees, rawEventLogs, rawWorldSettings, rawFishingZones, rawSkills, rawLocalizationKeys, rawLocalizations, rawQuests, rawWorldZones) {
    var allErrors = {};
    var localizationKeys = validateLocalizationKeys(allErrors, rawLocalizationKeys).localizationKeys;
    var localizations = validateLocalizations(allErrors, rawLocalizations, localizationKeys).localizations;
    var englishLocalization = (0, localization_util_1.getEnglishLocalization)(localizations).englishLocalization;
    var skillsByKey = validateSkills(allErrors, rawSkills, englishLocalization, localizationKeys).skillsByKey;
    var _a = validateItemCategories(allErrors, rawItemCategories, skillsByKey), itemCategories = _a.itemCategories, itemCategoriesByKey = _a.itemCategoriesByKey;
    var _b = validateItems(allErrors, rawItems, itemCategoriesByKey, skillsByKey, itemIconSizes, itemAnimations, englishLocalization, localizationKeys), items = _b.items, itemsByKey = _b.itemsByKey;
    var lootTablesByKey = validateLootTables(allErrors, rawLootTables, itemsByKey).lootTablesByKey;
    var eventLogsByKey = validateEventLogs(allErrors, rawEventLogs, englishLocalization, localizationKeys).eventLogsByKey;
    var _c = validateCreatureCategories(allErrors, rawCreatureCategories), creatureCategories = _c.creatureCategories, creatureCategoriesByKey = _c.creatureCategoriesByKey;
    var _d = validateCreatures(allErrors, rawCreatures, creatureCategoriesByKey, itemsByKey, lootTablesByKey, eventLogsByKey, englishLocalization, localizationKeys, creatureAnimations, creaturePortraits), creatures = _d.creatures, creaturesByKey = _d.creaturesByKey;
    checkCreaturesConnections(allErrors, creatures, creaturesByKey, creatureCategoriesByKey);
    var _e = validateObjectCategories(allErrors, rawObjectCategories), objectCategories = _e.objectCategories, objectCategoriesByKey = _e.objectCategoriesByKey;
    var _f = validateObjectSubCategories(allErrors, rawObjectSubCategories, objectCategoriesByKey), objectSubCategories = _f.objectSubCategories, objectSubCategoriesByKey = _f.objectSubCategoriesByKey;
    var _g = validateObjects(allErrors, rawObjects, objectCategoriesByKey, objectSubCategories, objectSubCategoriesByKey, lootTablesByKey, objectSpriteCounts, objectAccentSpriteCounts, englishLocalization, localizationKeys), objects = _g.objects, objectsByKey = _g.objectsByKey;
    var craftingRecipeCategoriesByKey = validateCraftingRecipeCategories(allErrors, rawCraftingRecipesCategories).craftingRecipeCategoriesByKey;
    var workstationKeys = objects
        .filter(function (type) {
        var isWorkstation = (0, objectType_util_1.getObjectSetting)('isWorkstation', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
        return isWorkstation;
    })
        .map(function (workstation) { return workstation.key; });
    var craftingRecipesByKey = validateCraftingRecipes(allErrors, rawCraftingRecipes, craftingRecipeCategoriesByKey, skillsByKey, itemsByKey, workstationKeys).craftingRecipesByKey;
    var dialogueTreesByKey = validateDialogueTrees(allErrors, rawDialogueTrees, creaturesByKey, eventLogsByKey, englishLocalization, localizationKeys).dialogueTreesByKey;
    validatePlayerData(allErrors, rawPlayerData, itemsByKey);
    validateWorldSettings(allErrors, rawWorldSettings);
    var _h = (0, combat_util_1.getProjectileData)(itemCategories, itemCategoriesByKey, items), projectileItemCategoryKeyOptions = _h.projectileItemCategoryKeys, projectileItemKeyOptions = _h.projectileItemKeys;
    var _j = (0, combat_util_1.getDamagableData)(objectCategories, objectCategoriesByKey, objectSubCategories, objectSubCategoriesByKey, objects, creatureCategories, creatureCategoriesByKey, creatures), damagableObjectCategoryKeys = _j.damagableObjectCategoryKeys, damagableObjectSubCategoryKeys = _j.damagableObjectSubCategoryKeys, damagableObjectKeys = _j.damagableObjectKeys, damagableCreatureCategoryKeys = _j.damagableCreatureCategoryKeys, damagableCreatureKeys = _j.damagableCreatureKeys;
    checkObjectCategoriesRequiredSettings(allErrors, objectCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);
    checkObjectSubCategoriesRequiredSettings(allErrors, objectSubCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);
    checkObjectsRequiredSettings(allErrors, objects, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey);
    checkItemCategoryConnections(allErrors, itemCategories, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemKeyOptions, projectileItemCategoryKeyOptions);
    checkItemsConnections(allErrors, items, itemsByKey, itemCategoriesByKey, objectsByKey, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemKeyOptions, projectileItemCategoryKeyOptions);
    validateFishingZones(allErrors, rawFishingZones, lootTablesByKey);
    validateQuests(allErrors, rawQuests, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, eventLogsByKey, englishLocalization, localizationKeys);
    validateWorldZones(allErrors, rawWorldZones, creaturesByKey);
    if (Object.keys(allErrors).length > 0) {
        return allErrors;
    }
    return null;
}
exports.validateData = validateData;
/**
 * Creatures
 */
function validateCreatureCategories(allErrors, rawCreatureCategories) {
    var _a;
    var _b;
    var creatureCategories = [];
    var creatureCategoriesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawCreatureCategories)) {
        return { creatureCategories: creatureCategories, creatureCategoriesByKey: creatureCategoriesByKey };
    }
    var creatureErrors = {};
    var i = 1;
    for (var _i = 0, rawCreatureCategories_1 = rawCreatureCategories; _i < rawCreatureCategories_1.length; _i++) {
        var rawCategory = rawCreatureCategories_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            key = rawCategory.key;
        }
        else {
            key = "Creature Category #".concat(i);
        }
        var errors = validateCreatureCategory(rawCategory);
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            var category = (0, converters_util_1.toCreatureCategory)(rawCategory, i);
            creatureCategories.push(category);
            creatureCategoriesByKey[category.key] = category;
        }
        if (errors.length > 0) {
            creatureErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(creatureErrors).length > 0) {
        allErrors[constants_1.CREATURES_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.CREATURES_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_CREATURE_CATEGORIES] = creatureErrors, _a));
    }
    return { creatureCategories: creatureCategories, creatureCategoriesByKey: creatureCategoriesByKey };
}
exports.validateCreatureCategories = validateCreatureCategories;
function validateCreatureCategory(rawCategory) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assertNotNullish = _a.assertNotNullish;
    assertNotNullish(rawCategory.key, 'No key');
    return errors;
}
exports.validateCreatureCategory = validateCreatureCategory;
function validateCreatures(allErrors, rawCreatures, categoriesByKey, itemsByKey, lootTablesByKey, eventLogsByKey, localization, localizationKeys, creatureAnimations, creaturePortraits) {
    var _a;
    var _b;
    var creatures = [];
    var creaturesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawCreatures)) {
        return { creatures: creatures, creaturesByKey: creaturesByKey };
    }
    var creatureErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawCreatures_1 = rawCreatures; _i < rawCreatures_1.length; _i++) {
        var rawType = rawCreatures_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawType.key)) {
            key = rawType.key;
        }
        else {
            key = "Creature #".concat(i);
        }
        var errors = validateCreature(rawType, categoriesByKey, itemsByKey, lootTablesByKey, eventLogsByKey, localization, localizationKeys, rawType.key ? creatureAnimations[rawType.key] : 0, rawType.key
            ? creaturePortraits[rawType.key]
            : {
                width: undefined,
                height: undefined
            }, idsSeen);
        i++;
        if ((0, null_util_1.isNotNullish)(rawType.key)) {
            var type = (0, converters_util_1.toCreatureType)(rawType, i);
            creatures.push(type);
            creaturesByKey[type.key] = type;
            idsSeen.push(type.id);
        }
        if (errors.length > 0) {
            creatureErrors[key] = errors;
        }
    }
    if (Object.keys(creatureErrors).length > 0) {
        allErrors[constants_1.CREATURES_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.CREATURES_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_CREATURES] = creatureErrors, _a));
    }
    return { creatures: creatures, creaturesByKey: creaturesByKey };
}
exports.validateCreatures = validateCreatures;
function validateCreature(rawType, categoriesByKeys, itemsByKey, lootTablesByKey, eventLogsByKey, localization, localizationKeys, animationSpriteCount, portraitSize, idsSeen) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], validateCreatureGeneralTab(rawType, categoriesByKeys, lootTablesByKey, localization, localizationKeys, portraitSize, idsSeen), true), validateCreatureSpriteStageTab(rawType, animationSpriteCount), true), validatePhysicsTab(rawType), true), validateCreatureShopTab(rawType, categoriesByKeys, itemsByKey, eventLogsByKey, localization, localizationKeys), true), validateCreatureBehaviorTab(rawType, categoriesByKeys, animationSpriteCount), true), validateCreatureSpawningTab(rawType), true);
}
exports.validateCreature = validateCreature;
function validateCreatureGeneralTab(rawType, categoriesByKeys, lootTablesByKey, localization, localizationKeys, portraitSize, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawType.id), "Duplicate id: ".concat(rawType.id));
    }
    if (assertNotNullish(rawType.key, 'No key') && localization) {
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('creature', 'name', rawType.key)), 'No name');
    }
    if (assertNotNullish(rawType.categoryKey, 'No category')) {
        var hasValidCategory = rawType.categoryKey in categoriesByKeys;
        assert(hasValidCategory, "Invalid category: ".concat(rawType.categoryKey));
    }
    var hasDialogue = (0, creatureType_util_1.getCreatureSetting)('hasDialogue', rawType, categoriesByKeys).value;
    if (hasDialogue) {
        if (assertNotNullish(portraitSize.width, 'Creatures with dialogue must have portrait width') &&
            assertNotNullish(portraitSize.height, 'Creatures with dialogue must have portrait height')) {
            assert(portraitSize.width === constants_1.PORTRAIT_WIDTH, "Portrait width must be ".concat(constants_1.PORTRAIT_WIDTH, " pixels, currently is ").concat(portraitSize.width));
            assert(portraitSize.height === constants_1.PORTRAIT_HEIGHT, "Portrait height must be ".concat(constants_1.PORTRAIT_HEIGHT, " pixels, currently is ").concat(portraitSize.height));
        }
    }
    var hasHealth = (0, creatureType_util_1.getCreatureSetting)('hasHealth', rawType, categoriesByKeys).value;
    if (hasHealth) {
        if (assertNotNullish(rawType.health, 'No health')) {
            assert(rawType.health > 0, 'Health must be greater than 0');
            assert(rawType.health % 1 === 0, 'Health must be a whole number');
        }
    }
    if ((0, null_util_1.isNotNullish)(rawType.lootTableKey)) {
        assert(rawType.lootTableKey in lootTablesByKey, "No loot table with key ".concat(rawType.lootTableKey, " exists"));
    }
    if (hasHealth && (0, null_util_1.isNotNullish)(rawType.lootTableKey)) {
        assert(rawType.experience > 0, 'Experience must be greater than 0');
        assert(rawType.experience % 1 === 0, 'Experience must be a whole number');
    }
    return errors;
}
exports.validateCreatureGeneralTab = validateCreatureGeneralTab;
function validateCreatureSpriteStageTab(rawType, spriteCount) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    if (assertNotNullish(rawType.sprite, 'No sprite data')) {
        assertCreatureSprite(assert, rawType.sprite, spriteCount);
    }
    return errors;
}
exports.validateCreatureSpriteStageTab = validateCreatureSpriteStageTab;
function validateCreatureShopTab(rawType, categoriesByKeys, itemsByKey, eventLogsByKey, localization, localizationKeys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var isShopkeeper = (0, creatureType_util_1.getCreatureSetting)('isShopkeeper', rawType, categoriesByKeys).value;
    if (isShopkeeper) {
        if (assertNotNullish(rawType.shop, 'No shop data')) {
            assertCreatureShop(assert, assertNotNullish, rawType.shop, itemsByKey, eventLogsByKey, localization, localizationKeys);
        }
    }
    return errors;
}
exports.validateCreatureShopTab = validateCreatureShopTab;
function validateCreatureBehaviorTab(rawType, categoriesByKeys, animationSpriteCount) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var movementType = (0, creatureType_util_1.getCreatureSetting)('movementType', rawType, categoriesByKeys).value;
    assertNotNullish(movementType, 'No movement type');
    if (movementType !== constants_1.MOVEMENT_TYPE_JUMP) {
        assert(rawType.walkSpeed >= 1, 'Walk speed must be greater than or equal to 1');
        assert(rawType.walkSpeed <= 10, 'Walk speed must be less than or equal to 10');
    }
    else if (movementType === constants_1.MOVEMENT_TYPE_JUMP) {
        assert(rawType.jumpMinWaitTime >= 1, 'Jump min wait time must be greater than or equal to 1');
        assert(rawType.jumpMinWaitTime <= 10, 'Jump min wait time must be less than or equal to 10');
        assert(rawType.jumpMaxWaitTime >= 1, 'Jump max wait time must be greater than or equal to 1');
        assert(rawType.jumpMaxWaitTime <= 10, 'Jump max wait time must be less than or equal to 10');
        assert(rawType.jumpMinWaitTime < rawType.jumpMaxWaitTime, 'Jump min wait time must be less than jump max wait time');
        assert(rawType.jumpMinDistance >= 1, 'Jump min distance must be greater than or equal to 1');
        assert(rawType.jumpMinDistance <= 10, 'Jump min distance must be less than or equal to 10');
        assert(rawType.jumpMaxDistance >= 1, 'Jump max distance must be greater than or equal to 1');
        assert(rawType.jumpMaxDistance <= 10, 'Jump max distance must be less than or equal to 10');
        assert(rawType.jumpMoveStartSpriteIndex >= 0, 'Jump move start sprite index must be greater than or equal to 0');
        assert(rawType.jumpMoveStartSpriteIndex < animationSpriteCount, "Jump move start sprite index must be less than the number of sprites in the jump animation (".concat(animationSpriteCount, ")"));
        assert(rawType.jumpMoveEndSpriteIndex >= 0, 'Jump move end sprite index must be greater than or equal to 0');
        assert(rawType.jumpMoveEndSpriteIndex < animationSpriteCount, "Jump move end sprite index must be less than the number of sprites in the jump animation (".concat(animationSpriteCount, ")"));
        assert(rawType.jumpMoveStartSpriteIndex < rawType.jumpMoveEndSpriteIndex, 'Jump move end sprite index must be greater than the jump move start sprite index');
    }
    if (rawType.dangerBehaviorEnabled) {
        if (movementType !== constants_1.MOVEMENT_TYPE_JUMP) {
            assert(rawType.runSpeed >= 0, 'Run speed must be greater than or equal to 0');
            assert(rawType.runSpeed <= 10, 'Run speed must be less than or equal to 10');
            assert(rawType.walkSpeed < rawType.runSpeed, 'Run speed must be greater than walk speed');
        }
        assert(rawType.dangerRadius >= 1, 'Danger radius must be greater than or equal to 1');
        assert(rawType.dangerRadius <= 20, 'Danger radius must be less than or equal to 20');
        assert(rawType.dangerTolerance > 0, 'Danger tolerance must be between 0 and 1 (inclusive)');
    }
    if (rawType.wanderBehaviorEnabled) {
        if (movementType !== constants_1.MOVEMENT_TYPE_JUMP) {
            assert(rawType.wanderTime > 0, 'Wander time must be greater than 0');
            assert(rawType.wanderTime <= 20, 'Wander time must be less than or equal to 20');
            assert(rawType.wanderRadius >= 1, 'Wander radius must be greater than or equal to 1');
            assert(rawType.wanderRadius <= 20, 'Wander radius must be less than or equal to 20');
        }
        if (rawType.campSpawns.length > 0) {
            assert(rawType.wanderUseSpawnAnchor === true, 'Spawn anchor must be used with camp spawns');
        }
        assert(!rawType.wanderUseSpawnAnchor || !rawType.wanderUseCustomAnchor, 'Spawn and custom anchors cannot be used together');
        if (rawType.wanderUseSpawnAnchor || rawType.wanderUseCustomAnchor) {
            if (rawType.wanderUseHardLeash) {
                assert(rawType.wanderHardLeashRange >= 1, 'Wander hard leash range must be greater than or equal to 1');
                assert(rawType.wanderHardLeashRange <= 25, 'Wander hard leash range must be less than or equal to 25');
            }
        }
        else {
            assert(!rawType.wanderUseHardLeash, 'Hard lease cannot be used with a spawn or custom anchor');
        }
        if (rawType.wanderUseCustomAnchor) {
            assertNotNullish(rawType.wanderAnchor, 'No wander custom anchor');
        }
    }
    if (rawType.attackBehaviorEnabled) {
        var attackType = (0, creatureType_util_1.getCreatureSetting)('attackType', rawType, categoriesByKeys).value;
        assertNotNullish(attackType, 'No attack type');
        assert(rawType.attackRadius >= 1, 'Attack radius must be greater than or equal to 1');
        assert(rawType.attackRadius <= 20, 'Attack radius must be less than or equal to 20');
        assert(rawType.attackDamage >= 1, 'Attack damage must be greater than or equal to 1');
        assert(rawType.attackDamage <= 1000, 'Attack damage must be less than or equal to 1000');
        assert(rawType.attackDamage % 1 === 0, 'Attack damage must be a whole number');
        assert(rawType.attackKnockbackModifier >= 1, 'Attack knockback modifier must be greater than or equal to 1');
        assert(rawType.attackKnockbackModifier <= 5, 'Attack knockback modifier must be less than or equal to 5');
        if (movementType !== constants_1.MOVEMENT_TYPE_JUMP) {
            assert(rawType.attackDesiredRangeMin >= 1, 'Attack desired min range must be greater than or equal to 1');
            assert(rawType.attackDesiredRangeMin <= 20, 'Attack desired min range must be less than or equal to 20');
            assert(rawType.attackDesiredRangeMax >= 1, 'Attack desired max range must be greater than or equal to 1');
            assert(rawType.attackDesiredRangeMax <= 20, 'Attack desired max range must be less than or equal to 20');
            assert(rawType.attackDesiredRangeMin < rawType.attackDesiredRangeMax, 'Attack desired min range must be less than attack desired max range');
            if (rawType.attackUseStrafing) {
                assert(rawType.attackStrafingTimeMin >= 1, 'Strafing min time must be greater than or equal to 1');
                assert(rawType.attackStrafingTimeMin <= 25, 'Strafing min time must be less than or equal to 10');
                assert(rawType.attackStrafingTimeMax >= 1, 'Strafing max time must be greater than or equal to 1');
                assert(rawType.attackStrafingTimeMax <= 25, 'Strafing max time must be less than or equal to 10');
                assert(rawType.attackStrafingTimeMin < rawType.attackStrafingTimeMax, 'Strafing min time must be less than strafing max time');
            }
        }
    }
    return errors;
}
exports.validateCreatureBehaviorTab = validateCreatureBehaviorTab;
function validateCreatureSpawningTab(rawType) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    assert(rawType.spawnDistanceMinFromPlayers >= 0, 'Min spawn distance from players must be greater than or equal to 0');
    assert(rawType.spawnDistanceMinFromPlayers <= 100, 'Min spawn distance from players must be less than or equal to 100');
    assert(rawType.spawnDistanceMaxFromPlayers >= 0, 'Max spawn distance from players must be greater than or equal to 0');
    assert(rawType.spawnDistanceMaxFromPlayers <= 100, 'Max spawn distance from players must be less than or equal to 100');
    assert(rawType.spawnDistanceMinFromPlayers <= rawType.spawnDistanceMaxFromPlayers, 'Min spawn distance from players must be less than or equal to max spawn distance from players');
    assert(rawType.despawnDistanceFromPlayers >= 0, 'Despawn distance from players must be greater than or equal to 0');
    assert(rawType.despawnDistanceFromPlayers <= 200, 'Despawn distance from players must be less than or equal to 200');
    if (rawType.despawnDistanceFromPlayers > 0) {
        assert(rawType.despawnDistanceFromPlayers > rawType.spawnDistanceMaxFromPlayers, 'Despawn distance from players must be greater than max spawn distance');
    }
    if (rawType.randomSpawnsEnabled) {
        assert(rawType.maxPopulation >= 1, 'Max population must be greater than or equal to 1');
        assert(rawType.maxPopulation <= 250, 'Max population must be less than or equal to 250');
        assert(rawType.maxPopulation % 1 === 0, 'Max population must be a whole number');
        assert(rawType.spawnDeadZoneRadius >= 1, 'Spawn dead zone radius must be greater than or equal to 1');
        assert(rawType.spawnDeadZoneRadius <= 20, 'Spawn dead zone radius must be less than or equal to 20');
    }
    rawType.campSpawns.forEach(function (campSpawn, index) { return assertCampSpawn(assert, assertNotNullish, campSpawn, "Camp spawn ".concat(index)); });
    return errors;
}
exports.validateCreatureSpawningTab = validateCreatureSpawningTab;
function checkCreaturesConnections(allErrors, creatures, creaturesByKey, creatureCategoriesByKey) {
    var _a, _b;
    var _c, _d, _e;
    var creatureErrors = (_d = (_c = allErrors[constants_1.CREATURES_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_CREATURES]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, creatures_1 = creatures; _i < creatures_1.length; _i++) {
        var creature = creatures_1[_i];
        var key = creature.key;
        var errors = checkCreatureConnections(creature, creaturesByKey, creatureCategoriesByKey);
        if (errors.length > 0) {
            if (key in creatureErrors) {
                (_a = creatureErrors[key]).push.apply(_a, errors);
            }
            else {
                creatureErrors[key] = errors;
            }
        }
    }
    if (Object.keys(creatureErrors).length > 0) {
        allErrors[constants_1.CREATURES_DATA_FILE] = __assign(__assign({}, ((_e = allErrors[constants_1.CREATURES_DATA_FILE]) !== null && _e !== void 0 ? _e : {})), (_b = {}, _b[constants_1.ERROR_SECTION_CREATURES] = creatureErrors, _b));
    }
}
exports.checkCreaturesConnections = checkCreaturesConnections;
function checkCreatureConnections(creature, creaturesByKey, creatureCategoriesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    if (creature.dangerBehaviorEnabled) {
        for (var _i = 0, _b = creature.dangerCreatureCategoryKeys; _i < _b.length; _i++) {
            var key = _b[_i];
            assert(key in creatureCategoriesByKey, "Danager Behavior: No creature category exists with key '".concat(key, "'"));
        }
        for (var _c = 0, _d = creature.dangerCreatureKeys; _c < _d.length; _c++) {
            var key = _d[_c];
            assert(key in creaturesByKey, "Danager Behavior: No creature exists with key '".concat(key, "'"));
        }
    }
    if (creature.attackBehaviorEnabled) {
        for (var _e = 0, _f = creature.attackTargetCreatureCategoryKeys; _e < _f.length; _e++) {
            var key = _f[_e];
            assert(key in creatureCategoriesByKey, "Attack Behavior: No creature category exists with key '".concat(key, "'"));
        }
        for (var _g = 0, _h = creature.attackTargetCreatureKeys; _g < _h.length; _g++) {
            var key = _h[_g];
            assert(key in creaturesByKey, "Attack Behavior: No creature exists with key '".concat(key, "'"));
        }
    }
    return errors;
}
exports.checkCreatureConnections = checkCreatureConnections;
function assertCampSpawn(assert, assertNotNullish, campSpawn, header) {
    assertNotNullish(campSpawn.position, "".concat(header, ": No position"));
    assert(campSpawn.maxPopulation > 0, "".concat(header, ": Max population must be greater than 0"));
    assert(campSpawn.maxPopulation <= 250, "".concat(header, ": Max population must be less than or equal to 250"));
}
exports.assertCampSpawn = assertCampSpawn;
function assertCreatureShop(assert, assertNotNullish, shop, itemsByKey, eventLogsByKey, localization, localizationKeys) {
    for (var _i = 0, _a = Object.keys(shop.prices); _i < _a.length; _i++) {
        var seasonKey = _a[_i];
        if (assert(seasonKey === constants_1.ALL_SEASONS || constants_1.SEASONS.includes(seasonKey), "Invalid season: ".concat(seasonKey))) {
            for (var _b = 0, _c = Object.keys(shop.prices[seasonKey]); _b < _c.length; _b++) {
                var itemKey = _c[_b];
                assert(itemKey in itemsByKey, "Shop Price: No item exists with key '".concat(itemKey, "'"));
                if (itemKey in itemsByKey) {
                    var item = itemsByKey[itemKey];
                    var itemName = (0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('item', 'name', item.key));
                    var amount = shop.prices[seasonKey][itemKey];
                    assert(amount > 0, "Shop Price [".concat(itemName, "]: Amount must be greater than 0"));
                    assert(amount % 1 === 0, "Shop Price [".concat(itemName, "]: Amount must be a whole number"));
                }
            }
        }
    }
    assert(shop.openTimes.length === constants_1.DAYS_IN_A_WEEK, "There must be ".concat(constants_1.DAYS_IN_A_WEEK, " open times"));
    assert(shop.closeTimes.length === constants_1.DAYS_IN_A_WEEK, "There must be ".concat(constants_1.DAYS_IN_A_WEEK, " close times"));
    if (shop.openTimes.length === constants_1.DAYS_IN_A_WEEK && shop.closeTimes.length === constants_1.DAYS_IN_A_WEEK) {
        for (var i = 0; i < shop.openTimes.length; i++) {
            var openTime = shop.openTimes[i];
            var closeTime = shop.closeTimes[i];
            if (!assertNotNullish(openTime, "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " has no open time (set to -1 for closed)")) ||
                !assertNotNullish(closeTime, "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " has no close time (set to -1 for closed)"))) {
                continue;
            }
            assert(openTime >= -1 && openTime <= constants_1.DAY_LENGTH, "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " open time must be between (inclusive) -1 and ").concat(constants_1.DAY_LENGTH));
            assert(closeTime >= -1 && closeTime <= constants_1.DAY_LENGTH, "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " close time must be between (inclusive) -1 and ").concat(constants_1.DAY_LENGTH));
            assert((openTime === -1 && closeTime === -1) || (openTime >= 0 && closeTime >= 0), "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " must have both open and close times or neither"));
            if (openTime >= 0 && closeTime >= 0) {
                assert(openTime < closeTime, "".concat(constants_1.DAYS_OF_THE_WEEK[i].name, " open time must be before close time"));
            }
        }
    }
    if ((0, null_util_1.isNotNullish)(shop.openingEvent)) {
        assert(shop.openingEvent in eventLogsByKey, "Invalid shop opening event: ".concat(shop.openingEvent));
    }
}
exports.assertCreatureShop = assertCreatureShop;
function assertCreatureSprite(assert, creatureSprite, spriteCount) {
    assert(spriteCount > 0, 'No sprites');
    assert(creatureSprite.width >= 16, 'Sprite width must be at least 16');
    assert(creatureSprite.width % 1 == 0, 'Sprite width must be a whole number');
    assert(creatureSprite.height >= 16, 'Sprite height must be at least 16');
    assert(creatureSprite.height % 1 == 0, 'Sprite height must be a whole number');
    if ((0, null_util_1.isNotNullish)(creatureSprite.pivotOffset)) {
        assert(creatureSprite.pivotOffset.x % 1 == 0, 'Sprite pivot offset x must be a whole number');
        assert(creatureSprite.pivotOffset.y % 1 == 0, 'Sprite pivot offset y must be a whole number');
    }
    if ((0, null_util_1.isNotNullish)(creatureSprite.sprites)) {
        assertCreatureSprites(assert, creatureSprite.sprites);
    }
    if ((0, null_util_1.isNotNullish)(creatureSprite.idleSprites)) {
        assertCreatureSprites(assert, creatureSprite.idleSprites);
    }
    if ((0, null_util_1.isNotNullish)(creatureSprite.deathSprites)) {
        assertCreatureSprites(assert, creatureSprite.deathSprites);
    }
}
exports.assertCreatureSprite = assertCreatureSprite;
function assertCreatureSprites(assert, sprites) {
    var _a, _b, _c, _d;
    for (var _i = 0, _e = Object.keys(sprites); _i < _e.length; _i++) {
        var key = _e[_i];
        var keyAsNumber = Number(key);
        assert(!Number.isNaN(keyAsNumber), "Sprite key '".concat(key, "' must be a number"));
        if (!Number.isNaN(keyAsNumber)) {
            var individualObjectSprite = sprites[key];
            if ((0, null_util_1.isNotNullish)(individualObjectSprite)) {
                if ((0, null_util_1.isNotNullish)(individualObjectSprite.pivotOffset)) {
                    assert(((_a = individualObjectSprite.pivotOffset) === null || _a === void 0 ? void 0 : _a.x) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " pivot offset x must be a whole number"));
                    assert(((_b = individualObjectSprite.pivotOffset) === null || _b === void 0 ? void 0 : _b.y) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " pivot offset y must be a whole number"));
                }
                if ((0, null_util_1.isNotNullish)(individualObjectSprite.spriteOffset)) {
                    assert(((_c = individualObjectSprite.spriteOffset) === null || _c === void 0 ? void 0 : _c.x) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " sprite offset x must be a whole number"));
                    assert(((_d = individualObjectSprite.spriteOffset) === null || _d === void 0 ? void 0 : _d.y) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " sprite offset y must be a whole number"));
                }
                if ((0, null_util_1.isNotNullish)(individualObjectSprite.placementLayer)) {
                    assert(constants_1.PLACEMENT_LAYERS.includes(individualObjectSprite.placementLayer), "Sprite ".concat(keyAsNumber + 1, " Invalid placement layer: ").concat(individualObjectSprite.placementLayer));
                }
            }
        }
    }
}
exports.assertCreatureSprites = assertCreatureSprites;
/**
 * Items
 */
function validateItemCategories(allErrors, rawItemCategories, skillsByKey) {
    var _a;
    var _b;
    var itemCategories = [];
    var itemCategoriesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawItemCategories)) {
        return { itemCategories: itemCategories, itemCategoriesByKey: itemCategoriesByKey };
    }
    var itemErrors = {};
    var i = 1;
    for (var _i = 0, rawItemCategories_1 = rawItemCategories; _i < rawItemCategories_1.length; _i++) {
        var rawCategory = rawItemCategories_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            key = rawCategory.key;
        }
        else {
            key = "Item Category #".concat(i);
        }
        var errors = validateItemCategory(rawCategory, skillsByKey);
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            var category = (0, converters_util_1.toItemCategory)(rawCategory, i);
            itemCategories.push(category);
            itemCategoriesByKey[category.key] = category;
        }
        if (errors.length > 0) {
            itemErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(itemErrors).length > 0) {
        allErrors[constants_1.ITEMS_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.ITEMS_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_ITEM_CATEGORIES] = itemErrors, _a));
    }
    return { itemCategories: itemCategories, itemCategoriesByKey: itemCategoriesByKey };
}
exports.validateItemCategories = validateItemCategories;
function validateItemCategory(rawCategory, skillsByKey) {
    return __spreadArray(__spreadArray([], validateItemCategoryGeneralTab(rawCategory), true), validateItemCategoryCombatTab(rawCategory, skillsByKey), true);
}
exports.validateItemCategory = validateItemCategory;
function validateItemCategoryGeneralTab(rawCategory) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    assertNotNullish(rawCategory.key, 'No key');
    if ((0, null_util_1.isNotNullish)(rawCategory.settings) && assertNotEmpty(rawCategory.settings.filledFromType, 'No filled from type')) {
        assert(constants_1.FILLED_FROM_TYPES.includes(rawCategory.settings.filledFromType), "Invalid filled from type: ".concat(rawCategory.settings.filledFromType));
    }
    if ((0, null_util_1.isNotNullish)(rawCategory.settings) && assertNotEmpty(rawCategory.settings.fishingItemType, 'No fishing item type')) {
        assert(constants_1.FISHING_ITEM_TYPES.includes(rawCategory.settings.fishingItemType), "Invalid fishing item type: ".concat(rawCategory.settings.fishingItemType));
    }
    return errors;
}
exports.validateItemCategoryGeneralTab = validateItemCategoryGeneralTab;
function validateItemCategoryCombatTab(rawCategory, skillsByKey) {
    var _a;
    var _b = (0, assert_util_1.createAssert)(), errors = _b.errors, assert = _b.assert, assertNotEmpty = _b.assertNotEmpty;
    if ((0, null_util_1.isNotNullish)(rawCategory.settings) && assertNotEmpty(rawCategory.settings.weaponType, 'No weapon type')) {
        assert(constants_1.WEAPON_TYPES.includes(rawCategory.settings.weaponType), "Invalid weapon type '".concat((_a = rawCategory.settings) === null || _a === void 0 ? void 0 : _a.weaponType, "'"));
        if (constants_1.WEAPON_TYPES.includes(rawCategory.settings.weaponType) && rawCategory.settings.weaponType !== constants_1.WEAPON_TYPE_NONE) {
            if ((0, null_util_1.isNotNullish)(rawCategory.settings.creatureDamageIncreasedBySkillKey)) {
                assert(rawCategory.settings.creatureDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(rawCategory.settings.creatureDamageIncreasedBySkillKey));
            }
            if ((0, null_util_1.isNotNullish)(rawCategory.settings.objectDamageIncreasedBySkillKey)) {
                assert(rawCategory.settings.objectDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(rawCategory.settings.objectDamageIncreasedBySkillKey));
            }
            if ((0, null_util_1.isNotNullish)(rawCategory.settings.launcherDamageIncreasedBySkillKey)) {
                assert(rawCategory.settings.launcherDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(rawCategory.settings.launcherDamageIncreasedBySkillKey));
            }
        }
    }
    return errors;
}
exports.validateItemCategoryCombatTab = validateItemCategoryCombatTab;
function validateItems(allErrors, rawItems, categories, skillsByKey, itemIconSizes, itemAnimations, localization, localizationKeys) {
    var _a;
    var _b;
    var items = [];
    var itemsById = {};
    var itemsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawItems)) {
        return { items: items, itemsById: itemsById, itemsByKey: itemsByKey };
    }
    var itemErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawItems_1 = rawItems; _i < rawItems_1.length; _i++) {
        var rawType = rawItems_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawType.key)) {
            key = rawType.key;
        }
        else {
            key = "Item #".concat(i);
        }
        var errors = validateItem(rawType, categories, skillsByKey, rawType.key
            ? itemIconSizes[rawType.key]
            : {
                width: undefined,
                height: undefined
            }, rawType.key ? itemAnimations[rawType.key] : 0, idsSeen, localization, localizationKeys);
        i++;
        if ((0, null_util_1.isNotNullish)(rawType.key) && (0, null_util_1.isNotNullish)(rawType.id) && rawType.id > 0) {
            var type = (0, converters_util_1.toItemType)(rawType, i);
            items.push(type);
            itemsById[type.id] = type;
            idsSeen.push(type.id);
            itemsByKey[type.key] = type;
        }
        if (errors.length > 0) {
            itemErrors[key] = errors;
        }
    }
    if (Object.keys(itemErrors).length > 0) {
        allErrors[constants_1.ITEMS_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.ITEMS_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_ITEMS] = itemErrors, _a));
    }
    return { items: items, itemsById: itemsById, itemsByKey: itemsByKey };
}
exports.validateItems = validateItems;
function validateItem(rawType, categoriesByKeys, skillsByKey, iconSize, animationSpriteCount, idsSeen, localization, localizationKeys) {
    return __spreadArray(__spreadArray(__spreadArray([], validateItemGeneralTab(rawType, categoriesByKeys, iconSize, animationSpriteCount, idsSeen, localization, localizationKeys), true), validateItemCombatTab(rawType, categoriesByKeys, skillsByKey), true), validateItemFishingTab(rawType, categoriesByKeys), true);
}
exports.validateItem = validateItem;
function validateItemGeneralTab(rawType, categoriesByKeys, iconSize, animationSpriteCount, idsSeen, localization, localizationKeys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawType.id), "Duplicate id: ".concat(rawType.id));
    }
    assertNotNullish(rawType.key, 'No key');
    assert(rawType.maxStackSize >= 0, 'Max stack size cannot be negative');
    assert(rawType.maxStackSize % 1 === 0, 'Max stack size must be a whole number');
    if (assertNotNullish(iconSize.width, 'No icon width') && assertNotNullish(iconSize.height, 'No icon height')) {
        assert(iconSize.width === constants_1.ICON_WIDTH, "Icon width must be ".concat(constants_1.ICON_WIDTH, " pixels, currently is ").concat(iconSize.width));
        assert(iconSize.height === constants_1.ICON_HEIGHT, "Icon height must be ".concat(constants_1.ICON_HEIGHT, " pixels, currently is ").concat(iconSize.height));
    }
    if ((0, null_util_1.isNotNullish)(rawType.key) && localization) {
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('item', 'name', rawType.key)), 'No name');
    }
    if (assertNotNullish(rawType.sellPrice, 'No sell price')) {
        assert(rawType.sellPrice > 0, 'Sell price must be greater than 0');
        assert(rawType.sellPrice % 1 === 0, 'Sell price must be a whole number');
    }
    if (assertNotNullish(rawType.categoryKey, 'No category')) {
        var hasValidCategory = rawType.categoryKey in categoriesByKeys;
        assert(hasValidCategory, "Invalid category: ".concat(rawType.categoryKey));
    }
    var placeable = (0, itemType_util_1.getItemSetting)('placeable', rawType, categoriesByKeys).value;
    if (placeable) {
        assertNotNullish(rawType.objectTypeKey, 'No object type key');
    }
    var hasDurability = (0, itemType_util_1.getItemSetting)('hasDurability', rawType, categoriesByKeys).value;
    if (hasDurability) {
        assert(rawType.durability > 0, 'Durability must be greater than 0');
        assert(rawType.durability % 1 === 0, 'Durability must be a whole number');
        assert(rawType.maxStackSize === 1, 'Items with durability must have a max stack size of 1');
    }
    var isEdible = (0, itemType_util_1.getItemSetting)('isEdible', rawType, categoriesByKeys).value;
    if (isEdible) {
        assert(rawType.hungerIncrease > 0 || rawType.thirstIncrease > 0, 'Edible items must increase either hunger, thirst or both');
        assert(rawType.hungerIncrease >= 0, 'Hunger increase cannot be negative');
        assert(rawType.thirstIncrease >= 0, 'Thirst increase cannot be negative');
        assert(rawType.energyIncrease >= 0, 'Energy increase cannot be negative');
    }
    var filledFromType = (0, itemType_util_1.getItemSetting)('filledFromType', rawType, categoriesByKeys).value;
    if ((0, null_util_1.isNotNullish)(filledFromType)) {
        if (assert(constants_1.FILLED_FROM_TYPES.includes(filledFromType), "Invalid filled from type: ".concat(filledFromType))) {
            switch (filledFromType) {
                case constants_1.FILLED_FROM_TYPE_WATER:
                    assert(rawType.filledLevel > 0 || (0, null_util_1.isNotNullish)(rawType.filledItemTypeKey), 'Items that can be filled with water must either have a water amount greater than 0 or a filled item type');
                    break;
                case constants_1.FILLED_FROM_TYPE_SAND:
                    assertNotNullish(rawType.filledItemTypeKey, 'Items that can be filled with sand must have a filled item type');
                    break;
            }
        }
    }
    var watersGround = (0, itemType_util_1.getItemSetting)('watersGround', rawType, categoriesByKeys).value;
    var createsFarmland = (0, itemType_util_1.getItemSetting)('createsFarmland', rawType, categoriesByKeys).value;
    var weaponType = (0, itemType_util_1.getItemSetting)('weaponType', rawType, categoriesByKeys).value;
    if (weaponType == constants_1.WEAPON_TYPE_POINT || weaponType == constants_1.WEAPON_TYPE_ARC || watersGround || createsFarmland) {
        assert(animationSpriteCount > 0, 'Tools (waters ground, creates or destroys farmland) and weapons (anything that does damage other than projectiles) require animations');
        assert(animationSpriteCount % 4 == 0, 'Item animations must have an equal number of animation frames for all 4 directions');
    }
    var hasLight = (0, objectType_util_1.getObjectSetting)('hasLight', rawType, categoriesByKeys).value;
    if (hasLight && assertNotNullish(rawType.lightLevel, 'No light level')) {
        assert(rawType.lightLevel >= 1 && rawType.lightLevel < 20, 'Light level must be between 1 and 20');
        if (rawType.lightLevel >= 1) {
            if (assertNotNullish(rawType.lightPosition, 'No light position')) {
                assert(rawType.lightPosition.x >= 0 && rawType.lightPosition.x < constants_1.ICON_WIDTH, "Light position x value must be between 0 and ".concat(constants_1.ICON_WIDTH - 1, " (inclusive)"));
                assert(rawType.lightPosition.y >= 0 && rawType.lightPosition.y < constants_1.ICON_HEIGHT, "Light position y value must be between 0 and ".concat(constants_1.ICON_HEIGHT - 1, " (inclusive)"));
            }
        }
    }
    return errors;
}
exports.validateItemGeneralTab = validateItemGeneralTab;
function validateItemCombatTab(rawType, categoriesByKeys, skillsByKey) {
    var _a, _b, _c, _d, _e;
    var _f = (0, assert_util_1.createAssert)(), errors = _f.errors, assert = _f.assert;
    var _g = (0, itemType_util_1.getItemSetting)('weaponType', rawType, categoriesByKeys), weaponType = _g.value, weaponTypeControlledBy = _g.controlledBy;
    if ((0, null_util_1.isNotNullish)(weaponType) && weaponType != constants_1.WEAPON_TYPE_NONE) {
        var canDamageObjects = __spreadArray(__spreadArray(__spreadArray([], ((_a = (0, itemType_util_1.getItemSetting)('damagesObjectKeys', rawType, categoriesByKeys).value) !== null && _a !== void 0 ? _a : []), true), ((_b = (0, itemType_util_1.getItemSetting)('damagesObjectCategoryKeys', rawType, categoriesByKeys).value) !== null && _b !== void 0 ? _b : []), true), ((_c = (0, itemType_util_1.getItemSetting)('damagesObjectSubCategoryKeys', rawType, categoriesByKeys).value) !== null && _c !== void 0 ? _c : []), true).length > 0;
        if (canDamageObjects) {
            assert(rawType.objectDamage > 0, 'Object damage must be greater than 0');
            assert(rawType.objectDamage % 1 === 0, 'Object damage must be a whole number');
        }
        var canDamageCreatures = __spreadArray(__spreadArray([], ((_d = (0, itemType_util_1.getItemSetting)('damagesCreatureKeys', rawType, categoriesByKeys).value) !== null && _d !== void 0 ? _d : []), true), ((_e = (0, itemType_util_1.getItemSetting)('damagesCreatureCategoryKeys', rawType, categoriesByKeys).value) !== null && _e !== void 0 ? _e : []), true).length > 0;
        if (canDamageCreatures) {
            assert(rawType.creatureDamage > 0, 'Creature damage must be greater than 0');
            assert(rawType.creatureDamage % 1 === 0, 'Creature damage must be a whole number');
        }
        if (weaponTypeControlledBy == 0) {
            assert(constants_1.WEAPON_TYPES.includes(weaponType), "Invalid weapon type '".concat(weaponType, "'"));
        }
        if (weaponType === constants_1.WEAPON_TYPE_ARC) {
            assert(rawType.damageArcRadius > 0, 'Damage arc radius must be greater than 0');
            assert(rawType.damageArcRadius <= 10, 'Damage arc radius must be less than or equal to 10');
        }
        else if (weaponType === constants_1.WEAPON_TYPE_PROJECTILE) {
            assert(rawType.projectileSpeed > 0, 'Projectile speed must be greater than 0');
            assert(rawType.projectileSpeed <= 20, 'Projectile speed must be less than or equal to 20');
            assert(rawType.projectileDistance >= 1, 'Projectile distance must be greater than or equal to 1');
            assert(rawType.projectileDistance <= 50, 'Projectile distance must be less than or equal to 50');
        }
        else if (weaponType === constants_1.WEAPON_TYPE_PROJECTILE_LAUNCHER) {
            assert(rawType.launcherDamage > 0, 'Launcher damage must be greater than 0');
            assert(rawType.launcherDamage % 1 === 0, 'Launcher damage must be a whole number');
        }
        var _h = (0, itemType_util_1.getItemSetting)('creatureDamageIncreasedBySkillKey', rawType, categoriesByKeys), creatureDamageIncreasedBySkillKey = _h.value, creatureDamageIncreasedBySkillKeyControlledBy = _h.controlledBy;
        if ((0, null_util_1.isNotNullish)(creatureDamageIncreasedBySkillKey) && creatureDamageIncreasedBySkillKeyControlledBy === 0) {
            assert(creatureDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(creatureDamageIncreasedBySkillKey));
        }
        var _j = (0, itemType_util_1.getItemSetting)('objectDamageIncreasedBySkillKey', rawType, categoriesByKeys), objectDamageIncreasedBySkillKey = _j.value, objectDamageIncreasedBySkillKeyControlledBy = _j.controlledBy;
        if ((0, null_util_1.isNotNullish)(objectDamageIncreasedBySkillKey) && objectDamageIncreasedBySkillKeyControlledBy === 0) {
            assert(objectDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(objectDamageIncreasedBySkillKey));
        }
        var _k = (0, itemType_util_1.getItemSetting)('launcherDamageIncreasedBySkillKey', rawType, categoriesByKeys), launcherDamageIncreasedBySkillKey = _k.value, launcherDamageIncreasedBySkillKeyControlledBy = _k.controlledBy;
        if ((0, null_util_1.isNotNullish)(launcherDamageIncreasedBySkillKey) && launcherDamageIncreasedBySkillKeyControlledBy === 0) {
            assert(launcherDamageIncreasedBySkillKey in skillsByKey, "Invalid skill: ".concat(launcherDamageIncreasedBySkillKey));
        }
    }
    return errors;
}
exports.validateItemCombatTab = validateItemCombatTab;
function validateItemFishingTab(rawType, categoriesByKeys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var fishingItemType = (0, itemType_util_1.getItemSetting)('fishingItemType', rawType, categoriesByKeys).value;
    if ((0, null_util_1.isNotNullish)(fishingItemType)) {
        if (fishingItemType === constants_1.FISHING_ITEM_TYPE_POLE) {
            if (assertNotNullish(rawType.fishingPoleAnchorPointsNorth, 'No fishing pole north facing anchor points')) {
                assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsNorth, 'north');
            }
            if (assertNotNullish(rawType.fishingPoleAnchorPointsEast, 'No fishing pole east facing anchor points')) {
                assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsEast, 'east');
            }
            if (assertNotNullish(rawType.fishingPoleAnchorPointsSouth, 'No fishing pole south facing anchor points')) {
                assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsSouth, 'south');
            }
            if (assertNotNullish(rawType.fishingPoleAnchorPointsWest, 'No fishing pole west facing anchor points')) {
                assertFishingPoleAnchorPoints(assert, assertNotNullish, rawType.fishingPoleAnchorPointsWest, 'west');
            }
        }
        else if (fishingItemType === constants_1.FISHING_ITEM_TYPE_FISH) {
            assert(rawType.fishExperience >= 1, 'Fishing experience must be greater than 0');
            assert(rawType.fishExperience % 1 === 0, 'Fishing experience must be a whole number');
        }
    }
    return errors;
}
exports.validateItemFishingTab = validateItemFishingTab;
function assertFishingPoleAnchorPoints(assert, assertNotNullish, points, direction) {
    if (assertNotNullish(points.idle, "No fishing pole ".concat(direction, " facing idle anchor point"))) {
        assert(points.idle.x >= 0 && points.idle.x < constants_1.PLAYER_SPRITE_WIDTH, "Fishing pole ".concat(direction, " facing idle anchor point x value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_WIDTH - 1, " (inclusive)"));
        assert(points.idle.y >= 0 && points.idle.y < constants_1.PLAYER_SPRITE_HEIGHT, "Fishing pole ".concat(direction, " facing idle anchor point y value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_HEIGHT - 1, " (inclusive)"));
    }
    if (assertNotNullish(points.casting, "No fishing pole ".concat(direction, " facing casting anchor point"))) {
        assert(points.casting.x >= 0 && points.casting.x < constants_1.PLAYER_SPRITE_WIDTH, "Fishing pole ".concat(direction, " facing casting anchor point x value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_WIDTH - 1, " (inclusive)"));
        assert(points.casting.y >= 0 && points.casting.y < constants_1.PLAYER_SPRITE_HEIGHT, "Fishing pole ".concat(direction, " facing casting anchor point y value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_HEIGHT - 1, " (inclusive)"));
    }
    if (assertNotNullish(points.pulling, "No fishing pole ".concat(direction, " facing pulling anchor point"))) {
        assert(points.pulling.x >= 0 && points.pulling.x < constants_1.PLAYER_SPRITE_WIDTH, "Fishing pole ".concat(direction, " facing pulling anchor point x value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_WIDTH - 1, " (inclusive)"));
        assert(points.pulling.y >= 0 && points.pulling.y < constants_1.PLAYER_SPRITE_HEIGHT, "Fishing pole ".concat(direction, " facing pulling anchor point y value must be between 0 and ").concat(constants_1.PLAYER_SPRITE_HEIGHT - 1, " (inclusive)"));
    }
}
exports.assertFishingPoleAnchorPoints = assertFishingPoleAnchorPoints;
function checkItemCategoryConnections(allErrors, categories, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemOptions, projectileItemCategoryOptions) {
    var _a, _b;
    var _c, _d, _e;
    var itemErrors = (_d = (_c = allErrors[constants_1.ITEMS_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_ITEM_CATEGORIES]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var category = categories_1[_i];
        var key = category.key;
        var errors = checkItemCategoryConnection(category, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemOptions, projectileItemCategoryOptions);
        if (errors.length > 0) {
            if (key in itemErrors) {
                (_a = itemErrors[key]).push.apply(_a, errors);
            }
            else {
                itemErrors[key] = errors;
            }
        }
    }
    if (Object.keys(itemErrors).length > 0) {
        allErrors[constants_1.ITEMS_DATA_FILE] = __assign(__assign({}, ((_e = allErrors[constants_1.ITEMS_DATA_FILE]) !== null && _e !== void 0 ? _e : {})), (_b = {}, _b[constants_1.ERROR_SECTION_ITEM_CATEGORIES] = itemErrors, _b));
    }
}
exports.checkItemCategoryConnections = checkItemCategoryConnections;
function checkItemCategoryConnection(category, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemKeys, projectileItemCategoryKeys) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var _q = (0, assert_util_1.createAssert)(), errors = _q.errors, assert = _q.assert;
    for (var _i = 0, _r = (_b = (_a = category.settings) === null || _a === void 0 ? void 0 : _a.damagesObjectCategoryKeys) !== null && _b !== void 0 ? _b : []; _i < _r.length; _i++) {
        var objectCategoryKey = _r[_i];
        assert(damagableObjectCategoryKeys.includes(objectCategoryKey), "Damages object category: No damagable object category with key '".concat(objectCategoryKey, "' exists"));
    }
    for (var _s = 0, _t = (_d = (_c = category.settings) === null || _c === void 0 ? void 0 : _c.damagesObjectSubCategoryKeys) !== null && _d !== void 0 ? _d : []; _s < _t.length; _s++) {
        var objectSubCategoryKey = _t[_s];
        assert(damagableObjectSubCategoryKeys.includes(objectSubCategoryKey), "Damages object sub category: No damagable object sub category with key '".concat(objectSubCategoryKey, "' exists"));
    }
    for (var _u = 0, _v = (_f = (_e = category.settings) === null || _e === void 0 ? void 0 : _e.damagesObjectKeys) !== null && _f !== void 0 ? _f : []; _u < _v.length; _u++) {
        var objectKey = _v[_u];
        assert(damagableObjectKeys.includes(objectKey), "Damages object: No damagable object with key '".concat(objectKey, "' exists"));
    }
    for (var _w = 0, _x = (_h = (_g = category.settings) === null || _g === void 0 ? void 0 : _g.damagesCreatureCategoryKeys) !== null && _h !== void 0 ? _h : []; _w < _x.length; _w++) {
        var creatureCategoryKey = _x[_w];
        assert(damagableCreatureCategoryKeys.includes(creatureCategoryKey), "Damages creature category: No damagable creature category with key '".concat(creatureCategoryKey, "' exists, options: ").concat(damagableCreatureCategoryKeys));
    }
    for (var _y = 0, _z = (_k = (_j = category.settings) === null || _j === void 0 ? void 0 : _j.damagesCreatureKeys) !== null && _k !== void 0 ? _k : []; _y < _z.length; _y++) {
        var creatureKey = _z[_y];
        assert(damagableCreatureKeys.includes(creatureKey), "Damages creature: No damagable creature with key '".concat(creatureKey, "' exists"));
    }
    for (var _0 = 0, _1 = (_m = (_l = category.settings) === null || _l === void 0 ? void 0 : _l.projectileItemCategoryKeys) !== null && _m !== void 0 ? _m : []; _0 < _1.length; _0++) {
        var projectileItemCategoryKey = _1[_0];
        assert(projectileItemCategoryKeys.includes(projectileItemCategoryKey), "Projectile item category: No projectile item category with key '".concat(projectileItemCategoryKey, "' exists"));
    }
    for (var _2 = 0, _3 = (_p = (_o = category.settings) === null || _o === void 0 ? void 0 : _o.projectileItemKeys) !== null && _p !== void 0 ? _p : []; _2 < _3.length; _2++) {
        var projectileItemKey = _3[_2];
        assert(projectileItemKeys.includes(projectileItemKey), "Projectile item: No projectile item with key ".concat(projectileItemKey, " exists"));
    }
    return errors;
}
exports.checkItemCategoryConnection = checkItemCategoryConnection;
function checkItemsConnections(allErrors, items, itemsByKey, itemCategoriesByKey, objectsByKey, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemOptions, projectileItemCategoryOptions) {
    var _a, _b;
    var _c, _d, _e;
    var itemErrors = (_d = (_c = allErrors[constants_1.ITEMS_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_ITEMS]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var type = items_1[_i];
        var key = type.key;
        var errors = __spreadArray(__spreadArray([], checkItemGeneralConnections(type, itemsByKey, itemCategoriesByKey, objectsByKey), true), checkItemCombatConnections(type, itemCategoriesByKey, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemOptions, projectileItemCategoryOptions), true);
        if (errors.length > 0) {
            if (key in itemErrors) {
                (_a = itemErrors[key]).push.apply(_a, errors);
            }
            else {
                itemErrors[key] = errors;
            }
        }
    }
    if (Object.keys(itemErrors).length > 0) {
        allErrors[constants_1.ITEMS_DATA_FILE] = __assign(__assign({}, ((_e = allErrors[constants_1.ITEMS_DATA_FILE]) !== null && _e !== void 0 ? _e : {})), (_b = {}, _b[constants_1.ERROR_SECTION_ITEMS] = itemErrors, _b));
    }
}
exports.checkItemsConnections = checkItemsConnections;
function checkItemGeneralConnections(type, itemsByKey, itemCategoriesByKey, objectsByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var placeable = (0, itemType_util_1.getItemSetting)('placeable', type, itemCategoriesByKey).value;
    var requiredObjectCategoryKey = (0, itemType_util_1.getItemSetting)('requiredObjectCategoryKey', type, itemCategoriesByKey).value;
    if (placeable && (0, null_util_1.isNotNullish)(type.objectTypeKey)) {
        var objectType = objectsByKey[type.objectTypeKey];
        if (assertNotNullish(objectType, "Object to place: No object with key ".concat(type.objectTypeKey, " exists")) && requiredObjectCategoryKey) {
            assert(objectType.categoryKey == requiredObjectCategoryKey, "Must have an object in the ".concat(requiredObjectCategoryKey, " category"));
        }
    }
    var isEdible = (0, itemType_util_1.getItemSetting)('isEdible', type, itemCategoriesByKey).value;
    if (isEdible) {
        assert((0, null_util_1.isNullish)(type.edibleLeftoverItemTypeKey) || type.edibleLeftoverItemTypeKey in itemsByKey, "Edible leftover item: No item with key ".concat(type.edibleLeftoverItemTypeKey, " exists"));
    }
    return errors;
}
exports.checkItemGeneralConnections = checkItemGeneralConnections;
function checkItemCombatConnections(type, itemCategoriesByKey, damagableObjectKeys, damagableObjectCategoryKeys, damagableObjectSubCategoryKeys, damagableCreatureKeys, damagableCreatureCategoryKeys, projectileItemOptions, projectileItemCategoryOptions) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    var _b = (0, itemType_util_1.getItemSetting)('damagesObjectCategoryKeys', type, itemCategoriesByKey), damagesObjectCategoryKeys = _b.value, damagesObjectCategoryKeysControlledBy = _b.controlledBy;
    if (damagesObjectCategoryKeysControlledBy == 0) {
        for (var _i = 0, _c = damagesObjectCategoryKeys !== null && damagesObjectCategoryKeys !== void 0 ? damagesObjectCategoryKeys : []; _i < _c.length; _i++) {
            var objectCategoryKey = _c[_i];
            assert(damagableObjectCategoryKeys.includes(objectCategoryKey), "Damages object category: No damagable object category with key ".concat(objectCategoryKey, " exists"));
        }
    }
    var _d = (0, itemType_util_1.getItemSetting)('damagesObjectSubCategoryKeys', type, itemCategoriesByKey), damagesObjectSubCategoryKeys = _d.value, damagesObjectSubCategoryKeysControlledBy = _d.controlledBy;
    if (damagesObjectSubCategoryKeysControlledBy == 0) {
        for (var _e = 0, _f = damagesObjectSubCategoryKeys !== null && damagesObjectSubCategoryKeys !== void 0 ? damagesObjectSubCategoryKeys : []; _e < _f.length; _e++) {
            var objectSubCategoryKey = _f[_e];
            assert(damagableObjectSubCategoryKeys.includes(objectSubCategoryKey), "Damages object sub category: No damagable object sub category with key ".concat(objectSubCategoryKey, " exists"));
        }
    }
    var _g = (0, itemType_util_1.getItemSetting)('damagesObjectKeys', type, itemCategoriesByKey), damagesObjectKeys = _g.value, damagesObjectKeysControlledBy = _g.controlledBy;
    if (damagesObjectKeysControlledBy == 0) {
        for (var _h = 0, _j = damagesObjectKeys !== null && damagesObjectKeys !== void 0 ? damagesObjectKeys : []; _h < _j.length; _h++) {
            var objectKey = _j[_h];
            assert(damagableObjectKeys.includes(objectKey), "Damages object: No object with key ".concat(objectKey, " exists"));
        }
    }
    var _k = (0, itemType_util_1.getItemSetting)('damagesCreatureCategoryKeys', type, itemCategoriesByKey), damagesCreatureCategoryKeys = _k.value, damagesCreatureCategoryKeysControlledBy = _k.controlledBy;
    if (damagesCreatureCategoryKeysControlledBy == 0) {
        for (var _l = 0, _m = damagesCreatureCategoryKeys !== null && damagesCreatureCategoryKeys !== void 0 ? damagesCreatureCategoryKeys : []; _l < _m.length; _l++) {
            var creatureCategoryKey = _m[_l];
            assert(damagableCreatureCategoryKeys.includes(creatureCategoryKey), "Damages creature category: No damagable creature category with key ".concat(creatureCategoryKey, " exists"));
        }
    }
    var _o = (0, itemType_util_1.getItemSetting)('damagesCreatureKeys', type, itemCategoriesByKey), damagesCreatureKeys = _o.value, damagesCreatureKeysControlledBy = _o.controlledBy;
    if (damagesCreatureKeysControlledBy == 0) {
        for (var _p = 0, _q = damagesCreatureKeys !== null && damagesCreatureKeys !== void 0 ? damagesCreatureKeys : []; _p < _q.length; _p++) {
            var creatureKey = _q[_p];
            assert(damagableCreatureKeys.includes(creatureKey), "Damages creature: No creature with key ".concat(creatureKey, " exists"));
        }
    }
    var _r = (0, itemType_util_1.getItemSetting)('projectileItemCategoryKeys', type, itemCategoriesByKey), projectileItemCategoryKeys = _r.value, projectileItemCategoryKeysControlledBy = _r.controlledBy;
    if (projectileItemCategoryKeysControlledBy == 0) {
        for (var _s = 0, _t = projectileItemCategoryKeys !== null && projectileItemCategoryKeys !== void 0 ? projectileItemCategoryKeys : []; _s < _t.length; _s++) {
            var projectileItemCategoryKey = _t[_s];
            assert(projectileItemCategoryOptions.includes(projectileItemCategoryKey), "Projectile item category: No projectile item category with key '".concat(projectileItemCategoryKey, "' exists"));
        }
    }
    var _u = (0, itemType_util_1.getItemSetting)('projectileItemKeys', type, itemCategoriesByKey), projectileItemKeys = _u.value, projectileItemKeysControlledBy = _u.controlledBy;
    if (projectileItemKeysControlledBy == 0) {
        for (var _v = 0, _w = projectileItemKeys !== null && projectileItemKeys !== void 0 ? projectileItemKeys : []; _v < _w.length; _v++) {
            var projectileItemKey = _w[_v];
            assert(projectileItemOptions.includes(projectileItemKey), "Projectile item: No projectile item with key ".concat(projectileItemKey, " exists"));
        }
    }
    return errors;
}
exports.checkItemCombatConnections = checkItemCombatConnections;
/**
 * Loot Tables
 */
function validateLootTables(allErrors, rawLootTables, itemsByKey) {
    var lootTables = [];
    var lootTablesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawLootTables)) {
        return { lootTables: lootTables, lootTablesByKey: lootTablesByKey };
    }
    var lootTableErrors = {};
    var i = 1;
    for (var _i = 0, rawLootTables_1 = rawLootTables; _i < rawLootTables_1.length; _i++) {
        var rawLootTable = rawLootTables_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawLootTable.key)) {
            key = rawLootTable.key;
        }
        else {
            key = "Loot Table #".concat(i);
        }
        var errors = validateLootTable(rawLootTable, itemsByKey);
        if ((0, null_util_1.isNotNullish)(rawLootTable.key)) {
            var category = (0, converters_util_1.toLootTable)(rawLootTable, i);
            lootTables.push(category);
            lootTablesByKey[category.key] = category;
        }
        if (errors.length > 0) {
            lootTableErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(lootTableErrors).length > 0) {
        allErrors[constants_1.LOOT_TABLES_DATA_FILE] = lootTableErrors;
    }
    return { lootTables: lootTables, lootTablesByKey: lootTablesByKey };
}
exports.validateLootTables = validateLootTables;
function validateLootTable(rawLootTable, itemTypesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    assertNotNullish(rawLootTable.key, 'No key');
    if (assertNotNullish(rawLootTable.defaultGroup, 'No default group')) {
        assertLootTableComponentGroup(assert, assertNotNullish, rawLootTable.defaultGroup, -1, itemTypesByKey);
    }
    if (assertNotNullish(rawLootTable.groups, 'No groups')) {
        for (var index = 0; index < rawLootTable.groups.length; index++) {
            assertLootTableComponentGroup(assert, assertNotNullish, rawLootTable.groups[index], index + 1, itemTypesByKey);
        }
    }
    return errors;
}
exports.validateLootTable = validateLootTable;
function assertLootTableComponentGroup(assert, assertNotNullish, group, groupIndex, itemTypesByKey) {
    var header = groupIndex === -1 ? 'Default Group' : "Group ".concat(groupIndex);
    assert(group.probability <= 100 && group.probability >= 0, "".concat(header, ": Probability must be between 0 and 100 inclusive"));
    assert(group.probability % 1 === 0, "".concat(header, ": Probability must be a whole number"));
    if (assertNotNullish(group.components, "".concat(header, ": No components")) &&
        assert(group.components.length != 0, "".concat(header, ": There must be at least one component"))) {
        for (var index = 0; index < group.components.length; index++) {
            assertLootTableComponent(assert, assertNotNullish, group.components[index], index + 1, itemTypesByKey, "".concat(header, ","));
        }
    }
}
exports.assertLootTableComponentGroup = assertLootTableComponentGroup;
function assertLootTableComponent(assert, assertNotNullish, component, index, itemTypes, header) {
    if (assertNotNullish(component.typeKey, "".concat(header, " Component ").concat(index, ": No item type key"))) {
        assert(component.typeKey in itemTypes, "".concat(header, " Component ").concat(index, ": No item with key ").concat(component.typeKey, " exists"));
    }
    assert(component.min >= 0, "".concat(header, " Component ").concat(index, ": Min cannot be negative"));
    assert(component.min % 1 === 0, "".concat(header, " Component ").concat(index, ": Min must be a whole number"));
    assert(component.max >= 1, "".concat(header, " Component ").concat(index, ": Max must be greater than or equal to 1"));
    assert(component.max % 1 === 0, "".concat(header, " Component ").concat(index, ": Max must be a whole number"));
    assert(component.max >= component.min, "".concat(header, " Component ").concat(index, ": Max must be greater than or equal to min"));
    assert(component.probability <= 100 && component.probability >= 0, "".concat(header, " Component ").concat(index, ": Probability must be between 0 and 100 inclusive"));
    assert(component.probability % 1 === 0, "".concat(header, " Component ").concat(index, ": Probability must be a whole number"));
}
exports.assertLootTableComponent = assertLootTableComponent;
/**
 * Crafting Recipes
 */
function validateCraftingRecipeCategories(allErrors, rawCraftingRecipeCategories) {
    var _a;
    var _b;
    var craftingRecipeCategories = [];
    var craftingRecipeCategoriesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawCraftingRecipeCategories)) {
        return { craftingRecipeCategories: craftingRecipeCategories, craftingRecipeCategoriesByKey: craftingRecipeCategoriesByKey };
    }
    var craftingRecipeErrors = {};
    var i = 1;
    for (var _i = 0, rawCraftingRecipeCategories_1 = rawCraftingRecipeCategories; _i < rawCraftingRecipeCategories_1.length; _i++) {
        var rawCategory = rawCraftingRecipeCategories_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            key = rawCategory.key;
        }
        else {
            key = "Crafting Recipe Category #".concat(i);
        }
        var errors = validateCraftingRecipeCategory(rawCategory);
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            var category = (0, converters_util_1.toCraftingRecipeCategory)(rawCategory, i);
            craftingRecipeCategories.push(category);
            craftingRecipeCategoriesByKey[category.key] = category;
        }
        if (errors.length > 0) {
            craftingRecipeErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(craftingRecipeErrors).length > 0) {
        allErrors[constants_1.CRAFTING_RECIPES_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.CRAFTING_RECIPES_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES] = craftingRecipeErrors, _a));
    }
    return { craftingRecipeCategories: craftingRecipeCategories, craftingRecipeCategoriesByKey: craftingRecipeCategoriesByKey };
}
exports.validateCraftingRecipeCategories = validateCraftingRecipeCategories;
function validateCraftingRecipeCategory(rawCategory) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assertNotNullish = _a.assertNotNullish;
    assertNotNullish(rawCategory.key, 'No key');
    return errors;
}
exports.validateCraftingRecipeCategory = validateCraftingRecipeCategory;
function validateCraftingRecipes(allErrors, rawCraftingRecipes, craftingRecipeCategoriesByKey, skillsByKey, itemTypesByKey, workstationKeys) {
    var _a;
    var _b;
    var craftingRecipes = [];
    var craftingRecipesByKey = {};
    var craftingRecipesByCategory = {};
    if (!(0, null_util_1.isNotNullish)(rawCraftingRecipes)) {
        return { craftingRecipes: craftingRecipes, craftingRecipesByKey: craftingRecipesByKey, craftingRecipesByCategory: craftingRecipesByCategory };
    }
    var craftingRecipeErrors = {};
    var i = 1;
    for (var _i = 0, rawCraftingRecipes_1 = rawCraftingRecipes; _i < rawCraftingRecipes_1.length; _i++) {
        var rawRecipe = rawCraftingRecipes_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawRecipe.key)) {
            key = rawRecipe.key;
        }
        else {
            key = "Recipe #".concat(i);
        }
        var errors = validateCraftingRecipe(rawRecipe, craftingRecipeCategoriesByKey, skillsByKey, itemTypesByKey, workstationKeys);
        if ((0, null_util_1.isNotNullish)(rawRecipe.key)) {
            var recipe = (0, converters_util_1.toCraftingRecipe)(rawRecipe, i);
            craftingRecipes.push(recipe);
            craftingRecipesByKey[recipe.key] = recipe;
            if ((0, null_util_1.isNotNullish)(recipe.categoryKey)) {
                addToCategory(craftingRecipesByCategory, recipe.categoryKey, recipe);
            }
            if ((0, null_util_1.isNotNullish)(recipe.searchCategories)) {
                for (var _c = 0, _d = recipe.searchCategories; _c < _d.length; _c++) {
                    var searchCategory = _d[_c];
                    addToCategory(craftingRecipesByCategory, searchCategory, recipe);
                }
            }
        }
        if (errors.length > 0) {
            craftingRecipeErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(craftingRecipeErrors).length > 0) {
        allErrors[constants_1.CRAFTING_RECIPES_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.CRAFTING_RECIPES_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_CRAFTING_RECIPES] = craftingRecipeErrors, _a));
    }
    return { craftingRecipes: craftingRecipes, craftingRecipesByKey: craftingRecipesByKey, craftingRecipesByCategory: craftingRecipesByCategory };
}
exports.validateCraftingRecipes = validateCraftingRecipes;
function validateCraftingRecipe(rawRecipe, craftingRecipeCategoriesByKey, skillsByKey, itemTypesByKey, workstationKeys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    assertNotNullish(rawRecipe.key, 'No key');
    assert(rawRecipe.craftingTime > 0, 'Crafting time must be greater than 0');
    assert(rawRecipe.craftingTime % 1 === 0, 'Crafting time must be a whole number');
    assert(rawRecipe.amount > 0, 'Amount must be greater than 0');
    assert(rawRecipe.amount % 1 === 0, 'Amount must be a whole number');
    if ((0, null_util_1.isNotNullish)(rawRecipe.requiredSkillKey)) {
        if (assert(rawRecipe.requiredSkillKey in skillsByKey, "No skill with key '".concat(rawRecipe.requiredSkillKey, "' exists"))) {
            if (assertNotNullish(rawRecipe.requiredSkillLevelKey, 'No skill level')) {
                var skill = skillsByKey[rawRecipe.requiredSkillKey];
                assert((0, null_util_1.isNotNullish)(skill.levels.find(function (skillLevel) { return skillLevel.key === rawRecipe.requiredSkillLevelKey; })), "No skill level with key '".concat(rawRecipe.requiredSkillLevelKey, "' exists on skill '").concat(rawRecipe.requiredSkillKey, "'"));
            }
        }
    }
    if (assertNotNullish(rawRecipe.itemTypeKey, 'No item type')) {
        assert(rawRecipe.itemTypeKey in itemTypesByKey, "No item with key '".concat(rawRecipe.itemTypeKey, "' exists"));
    }
    if ((0, null_util_1.isNotNullish)(rawRecipe.hiddenResultsTypeKeys) && rawRecipe.hiddenResultsTypeKeys.length > 0) {
        for (var i = 0; i < rawRecipe.hiddenResultsTypeKeys.length; i++) {
            var key = rawRecipe.hiddenResultsTypeKeys[i];
            assert(key in itemTypesByKey, "Hidden result ".concat(i + 1, ": No item with key '").concat(key, "'' exists"));
        }
    }
    if (assertNotNullish(rawRecipe.categoryKey, 'No category')) {
        assert(rawRecipe.categoryKey in craftingRecipeCategoriesByKey, "Invalid category: ".concat(rawRecipe.categoryKey));
    }
    if ((0, null_util_1.isNotNullish)(rawRecipe.workstation)) {
        assert(workstationKeys.includes(rawRecipe.workstation), "Invalid workstation (object): ".concat(rawRecipe.workstation));
    }
    if (assertNotNullish(rawRecipe.ingredients, 'No ingredients') &&
        assert(Object.keys(rawRecipe.ingredients).length > 0, 'There must be at least 1 ingredient')) {
        for (var _i = 0, _b = Object.keys(rawRecipe.ingredients); _i < _b.length; _i++) {
            var ingredientKey = _b[_i];
            assertIngredient(assert, ingredientKey, rawRecipe.ingredients[ingredientKey], itemTypesByKey);
        }
    }
    return errors;
}
exports.validateCraftingRecipe = validateCraftingRecipe;
function addToCategory(craftingRecipesByCategory, category, recipe) {
    if (!(category in craftingRecipesByCategory)) {
        craftingRecipesByCategory[category] = [];
    }
    craftingRecipesByCategory[category].push(recipe);
}
exports.addToCategory = addToCategory;
function assertIngredient(assert, ingredientKey, amount, itemTypes) {
    assert(ingredientKey in itemTypes, "Ingredient ".concat(ingredientKey, ": No item with key ").concat(ingredientKey, " exists"));
    assert(amount > 0, "Ingredient ".concat(ingredientKey, ": Amount must be greater than 0"));
    assert(amount % 1 === 0, "Ingredient ".concat(ingredientKey, ": Amount must be a whole number"));
}
exports.assertIngredient = assertIngredient;
/**
 * Objects
 */
function validateObjectCategories(allErrors, rawObjectCategories) {
    var _a;
    var _b;
    var objectCategories = [];
    var objectCategoriesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawObjectCategories)) {
        return { objectCategories: objectCategories, objectCategoriesByKey: objectCategoriesByKey };
    }
    var objectCategoryErrors = {};
    var i = 1;
    for (var _i = 0, rawObjectCategories_1 = rawObjectCategories; _i < rawObjectCategories_1.length; _i++) {
        var rawCategory = rawObjectCategories_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            key = rawCategory.key;
        }
        else {
            key = "Object Category #".concat(i);
        }
        var errors = validateObjectCategory(rawCategory);
        if ((0, null_util_1.isNotNullish)(rawCategory.key)) {
            var category = (0, converters_util_1.toObjectCategory)(rawCategory, i);
            objectCategories.push(category);
            objectCategoriesByKey[category.key] = category;
        }
        if (errors.length > 0) {
            objectCategoryErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(objectCategoryErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_OBJECT_CATEGORIES] = objectCategoryErrors, _a));
    }
    return { objectCategories: objectCategories, objectCategoriesByKey: objectCategoriesByKey };
}
exports.validateObjectCategories = validateObjectCategories;
/**
 * Objects
 */
function validateObjectCategory(rawCategory) {
    return __spreadArray(__spreadArray(__spreadArray([], validateObjectCategoryGeneralTab(rawCategory), true), validateObjectCategoryPlacementSpawningTab(rawCategory), true), validatePhysicsTab(rawCategory), true);
}
exports.validateObjectCategory = validateObjectCategory;
function validateObjectCategoryGeneralTab(rawCategory) {
    var _a, _b, _c, _d;
    var _e = (0, assert_util_1.createAssert)(), errors = _e.errors, assert = _e.assert, assertNotNullish = _e.assertNotNullish;
    assertNotNullish(rawCategory.key, 'No key');
    var lootType = (_a = rawCategory.settings) === null || _a === void 0 ? void 0 : _a.lootType;
    if (assertNotNullish(lootType, 'No loot type')) {
        assert(constants_1.LOOT_TYPES.includes(lootType), "Invalid loot type: ".concat(lootType));
    }
    var stagesType = (_b = rawCategory.settings) === null || _b === void 0 ? void 0 : _b.stagesType;
    if (assertNotNullish(stagesType, 'No stages type')) {
        assert(constants_1.STAGES_TYPES.includes(stagesType), "Invalid stages type: ".concat(stagesType));
    }
    var inventoryType = (_c = rawCategory.settings) === null || _c === void 0 ? void 0 : _c.inventoryType;
    var isWorkstation = (_d = rawCategory.settings) === null || _d === void 0 ? void 0 : _d.isWorkstation;
    if (assertNotNullish(inventoryType, 'No inventory type')) {
        assert(constants_1.INVENTORY_TYPES.includes(inventoryType), "Invalid inventory type: ".concat(inventoryType));
        assert(!isWorkstation || inventoryType === constants_1.INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
    }
    assert(((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE) || lootType !== constants_1.LOOT_TYPE_STAGE_DROP, "Loot type ".concat(constants_1.LOOT_TYPE_STAGE_DROP, " requires stages"));
    return errors;
}
exports.validateObjectCategoryGeneralTab = validateObjectCategoryGeneralTab;
function validateObjectCategoryPlacementSpawningTab(rawCategory) {
    var _a, _b, _c;
    var _d = (0, assert_util_1.createAssert)(), errors = _d.errors, assert = _d.assert, assertNotNullish = _d.assertNotNullish;
    var placementPosition = (_a = rawCategory.settings) === null || _a === void 0 ? void 0 : _a.placementPosition;
    if (assertNotNullish(placementPosition, 'No placement position')) {
        assert(constants_1.PLACEMENT_POSITIONS.includes(placementPosition), "Invalid placement position: ".concat(placementPosition));
    }
    var placementLayer = (_b = rawCategory.settings) === null || _b === void 0 ? void 0 : _b.placementLayer;
    if (assertNotNullish(placementLayer, 'No placement layer')) {
        assert(constants_1.PLACEMENT_LAYERS.includes(placementLayer), "Invalid placement layer: ".concat(placementLayer));
    }
    var spawningConditions = (_c = rawCategory.settings) === null || _c === void 0 ? void 0 : _c.spawningConditions;
    if ((0, null_util_1.isNotNullish)(spawningConditions)) {
        assertSpawningConditions(assert, spawningConditions);
    }
    return errors;
}
exports.validateObjectCategoryPlacementSpawningTab = validateObjectCategoryPlacementSpawningTab;
function checkObjectCategoriesRequiredSettings(allErrors, categories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey) {
    var _a, _b;
    var _c, _d, _e, _f;
    var objectErrors = (_d = (_c = allErrors[constants_1.OBJECTS_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_OBJECT_CATEGORIES]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
        var category = categories_2[_i];
        var key = category.key;
        var placementLayer = (_e = category.settings) === null || _e === void 0 ? void 0 : _e.placementLayer;
        if ((0, null_util_1.isNotNullish)(placementLayer) && (0, null_util_1.isNotNullish)(category.settings)) {
            var errors = __spreadArray(__spreadArray([], checkObjectRequiredBelowSettings(placementLayer, category.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true), checkObjectRequiredAdjacentSettings(placementLayer, category.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true);
            if (errors.length > 0) {
                if (key in objectErrors) {
                    (_a = objectErrors[key]).push.apply(_a, errors);
                }
                else {
                    objectErrors[key] = errors;
                }
            }
        }
    }
    if (Object.keys(objectErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_f = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _f !== void 0 ? _f : {})), (_b = {}, _b[constants_1.ERROR_SECTION_OBJECT_CATEGORIES] = objectErrors, _b));
    }
}
exports.checkObjectCategoriesRequiredSettings = checkObjectCategoriesRequiredSettings;
function validateObjectSubCategories(allErrors, rawObjectSubCategories, categoriesByKey) {
    var _a;
    var _b;
    var objectSubCategories = [];
    var objectSubCategoriesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawObjectSubCategories)) {
        return { objectSubCategories: objectSubCategories, objectSubCategoriesByKey: objectSubCategoriesByKey };
    }
    var objectSubCategoryErrors = {};
    var i = 1;
    for (var _i = 0, rawObjectSubCategories_1 = rawObjectSubCategories; _i < rawObjectSubCategories_1.length; _i++) {
        var rawSubCategory = rawObjectSubCategories_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawSubCategory.key)) {
            key = rawSubCategory.key;
        }
        else {
            key = "Object Sub Category #".concat(i);
        }
        var errors = validateObjectSubCategory(rawSubCategory, categoriesByKey);
        if ((0, null_util_1.isNotNullish)(rawSubCategory.key)) {
            var subCategory = (0, converters_util_1.toObjectSubCategory)(rawSubCategory, i);
            objectSubCategories.push(subCategory);
            objectSubCategoriesByKey[subCategory.key] = subCategory;
        }
        if (errors.length > 0) {
            objectSubCategoryErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(objectSubCategoryErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_OBJECT_SUB_CATEGORIES] = objectSubCategoryErrors, _a));
    }
    return { objectSubCategories: objectSubCategories, objectSubCategoriesByKey: objectSubCategoriesByKey };
}
exports.validateObjectSubCategories = validateObjectSubCategories;
function validateObjectSubCategory(rawSubCategory, categoriesByKey) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], validateObjectSubCategoryGeneralTab(rawSubCategory, categoriesByKey), true), validateObjectSubCategoryPlacementSpawningTab(rawSubCategory, categoriesByKey), true), validateObjectSubCategorySpriteRulesTab(rawSubCategory, categoriesByKey), true), validatePhysicsTab(rawSubCategory), true);
}
exports.validateObjectSubCategory = validateObjectSubCategory;
function validateObjectSubCategoryGeneralTab(rawSubCategory, categoriesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    assertNotNullish(rawSubCategory.key, 'No key');
    if (assertNotEmpty(rawSubCategory.categoryKey, 'No category')) {
        assert(rawSubCategory.categoryKey in categoriesByKey, "Invalid category: ".concat(rawSubCategory.categoryKey));
    }
    var _b = (0, objectType_util_1.getObjectSetting)('lootType', rawSubCategory, categoriesByKey, {}), lootType = _b.value, lootTypeControlledBy = _b.controlledBy;
    if ((0, null_util_1.isNotNullish)(lootType) && lootTypeControlledBy === 0) {
        assert(constants_1.LOOT_TYPES.includes(lootType), "Invalid loot type: ".concat(lootType));
    }
    var _c = (0, objectType_util_1.getObjectSetting)('stagesType', rawSubCategory, categoriesByKey, {}), stagesType = _c.value, stagesTypeControlledBy = _c.controlledBy;
    if ((0, null_util_1.isNotNullish)(stagesType) && stagesTypeControlledBy === 0) {
        assert(constants_1.STAGES_TYPES.includes(stagesType), "Invalid stages type: ".concat(stagesType));
    }
    if (lootTypeControlledBy === 0 || stagesTypeControlledBy === 0) {
        assert(((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE) || lootType !== constants_1.LOOT_TYPE_STAGE_DROP, "Loot type ".concat(constants_1.LOOT_TYPE_STAGE_DROP, " requires stages"));
    }
    var _d = (0, objectType_util_1.getObjectSetting)('inventoryType', rawSubCategory, categoriesByKey, {}), inventoryType = _d.value, inventoryTypeControlledBy = _d.controlledBy;
    var _e = (0, objectType_util_1.getObjectSetting)('isWorkstation', rawSubCategory, categoriesByKey, {}), isWorkstation = _e.value, isWorkstationControlledBy = _e.controlledBy;
    if (inventoryTypeControlledBy === 0) {
        if (assertNotNullish(inventoryType, 'No inventory type')) {
            assert(constants_1.INVENTORY_TYPES.includes(inventoryType), "Invalid inventory type: ".concat(inventoryType));
        }
    }
    if (inventoryTypeControlledBy === 0 || isWorkstationControlledBy === 0) {
        assert(!isWorkstation || inventoryType === constants_1.INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
    }
    return errors;
}
exports.validateObjectSubCategoryGeneralTab = validateObjectSubCategoryGeneralTab;
function validateObjectSubCategoryPlacementSpawningTab(rawSubCategory, categoriesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    var _b = (0, objectType_util_1.getObjectSetting)('placementPosition', rawSubCategory, categoriesByKey, {}), placementPosition = _b.value, placementPositionControlledBy = _b.controlledBy;
    if ((0, null_util_1.isNotNullish)(placementPosition) && placementPositionControlledBy === 1) {
        assert(constants_1.PLACEMENT_POSITIONS.includes(placementPosition), "Invalid placement position: ".concat(placementPosition));
    }
    var _c = (0, objectType_util_1.getObjectSetting)('placementLayer', rawSubCategory, categoriesByKey, {}), placementLayer = _c.value, placementLayerControlledBy = _c.controlledBy;
    if ((0, null_util_1.isNotNullish)(placementLayer) && placementLayerControlledBy === 1) {
        assert(constants_1.PLACEMENT_LAYERS.includes(placementLayer), "Invalid placement layer: ".concat(placementLayer));
    }
    var _d = (0, objectType_util_1.getObjectSetting)('spawningConditions', rawSubCategory, categoriesByKey, {}), spawningConditions = _d.value, spawningConditionsControlledBy = _d.controlledBy;
    if ((0, null_util_1.isNotNullish)(spawningConditions) && spawningConditionsControlledBy === 1) {
        assertSpawningConditions(assert, spawningConditions);
    }
    return errors;
}
exports.validateObjectSubCategoryPlacementSpawningTab = validateObjectSubCategoryPlacementSpawningTab;
function validateObjectSubCategorySpriteRulesTab(rawSubCategory, categoriesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var lootType = (0, objectType_util_1.getObjectSetting)('lootType', rawSubCategory, categoriesByKey, {}).value;
    var stagesType = (0, objectType_util_1.getObjectSetting)('stagesType', rawSubCategory, categoriesByKey, {}).value;
    var _b = (0, objectType_util_1.getObjectSetting)('canOpen', rawSubCategory, categoriesByKey, {}).value, canOpen = _b === void 0 ? false : _b;
    if ((0, null_util_1.isNotNullish)(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
        assert(!canOpen, 'Object sub categories that can open cannot have rulesets');
    }
    if (lootType === constants_1.LOOT_TYPE_STAGE_DROP || ((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE)) {
        assert((0, null_util_1.isNullish)(rawSubCategory.rulesets), 'Object sub categories with stages cannot have rulesets');
    }
    else if ((0, null_util_1.isNotNullish)(rawSubCategory.rulesets)) {
        var placementPosition = (0, objectType_util_1.getObjectSetting)('placementPosition', rawSubCategory, categoriesByKey, {}).value;
        var rulesetsProcessed = false;
        if ((0, null_util_1.isNotNullish)(placementPosition)) {
            if (placementPosition === constants_1.PLACEMENT_POSITION_CENTER) {
                assert((0, null_util_1.isNotNullish)(rawSubCategory.rulesets) &&
                    rawSubCategory.rulesets.length > 0 &&
                    (0, null_util_1.isNotNullish)(rawSubCategory.rulesets[0].rules) &&
                    rawSubCategory.rulesets[0].rules.length > 0, "One sprite ruleset are required for ".concat(rawSubCategory.key));
                if ((0, null_util_1.isNotNullish)(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
                    assertSubCategorySpriteRules(assert, assertNotNullish, 'Sprite rule', rawSubCategory.rulesets[0]);
                }
            }
            else if (placementPosition === constants_1.PLACEMENT_POSITION_EDGE) {
                assert((0, null_util_1.isNotNullish)(rawSubCategory.rulesets) &&
                    rawSubCategory.rulesets.length >= 2 &&
                    (0, null_util_1.isNotNullish)(rawSubCategory.rulesets[0].rules) &&
                    rawSubCategory.rulesets[0].rules.length > 0 &&
                    (0, null_util_1.isNotNullish)(rawSubCategory.rulesets[1].rules) &&
                    rawSubCategory.rulesets[1].rules.length > 0, "Two sprite rulesets (front [0] and side [1]) are required for ".concat(rawSubCategory.key));
                if ((0, null_util_1.isNotNullish)(rawSubCategory.rulesets)) {
                    if (rawSubCategory.rulesets.length >= 1) {
                        assertSubCategorySpriteRules(assert, assertNotNullish, 'Front sprite rule', rawSubCategory.rulesets[0]);
                    }
                    if (rawSubCategory.rulesets.length >= 2) {
                        assertSubCategorySpriteRules(assert, assertNotNullish, 'Side sprite rule', rawSubCategory.rulesets[1]);
                    }
                }
            }
        }
        if (!rulesetsProcessed) {
            if ((0, null_util_1.isNotNullish)(rawSubCategory.rulesets) && rawSubCategory.rulesets.length > 0) {
                assertSubCategorySpriteRules(assert, assertNotNullish, 'Sprite rule', rawSubCategory.rulesets[0]);
            }
        }
    }
    return errors;
}
exports.validateObjectSubCategorySpriteRulesTab = validateObjectSubCategorySpriteRulesTab;
function checkObjectSubCategoriesRequiredSettings(allErrors, subCategories, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey) {
    var _a, _b;
    var _c, _d, _e;
    var objectErrors = (_d = (_c = allErrors[constants_1.OBJECTS_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_OBJECT_SUB_CATEGORIES]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, subCategories_1 = subCategories; _i < subCategories_1.length; _i++) {
        var subCategory = subCategories_1[_i];
        var key = subCategory.key;
        var placementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', subCategory, objectCategoriesByKey).value;
        if ((0, null_util_1.isNotNullish)(placementLayer) && (0, null_util_1.isNotNullish)(subCategory.settings)) {
            var errors = __spreadArray(__spreadArray([], checkObjectRequiredBelowSettings(placementLayer, subCategory.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true), checkObjectRequiredAdjacentSettings(placementLayer, subCategory.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true);
            if (errors.length > 0) {
                if (key in objectErrors) {
                    (_a = objectErrors[key]).push.apply(_a, errors);
                }
                else {
                    objectErrors[key] = errors;
                }
            }
        }
    }
    if (Object.keys(objectErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_e = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _e !== void 0 ? _e : {})), (_b = {}, _b[constants_1.ERROR_SECTION_OBJECT_SUB_CATEGORIES] = objectErrors, _b));
    }
}
exports.checkObjectSubCategoriesRequiredSettings = checkObjectSubCategoriesRequiredSettings;
function validateObjects(allErrors, rawObjects, categoriesByKey, subCategories, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts, localization, localizationKeys) {
    var _a;
    var _b;
    var objects = [];
    var objectsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawObjects)) {
        return { objects: objects, objectsByKey: objectsByKey };
    }
    var objectErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawObjects_1 = rawObjects; _i < rawObjects_1.length; _i++) {
        var rawType = rawObjects_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawType.key)) {
            key = rawType.key;
        }
        else {
            key = "Object #".concat(i);
        }
        var errors = validateObject(rawType, categoriesByKey, subCategories, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts, localization, localizationKeys, idsSeen);
        if ((0, null_util_1.isNotNullish)(rawType.key)) {
            var type = (0, converters_util_1.toObjectType)(rawType, i);
            objects.push(type);
            objectsByKey[type.key] = type;
            idsSeen.push(type.id);
        }
        if (errors.length > 0) {
            objectErrors[key] = errors;
        }
        i++;
    }
    if (Object.keys(objectErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_OBJECTS] = objectErrors, _a));
    }
    return { objects: objects, objectsByKey: objectsByKey };
}
exports.validateObjects = validateObjects;
function validateObject(rawType, categoriesByKey, subCategories, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts, localization, localizationKeys, idsSeen) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], validateObjectGeneralTab(rawType, categoriesByKey, subCategories, subCategoriesByKey, lootTablesByKey, localization, localizationKeys, idsSeen), true), validateObjectPlacementSpawningTab(rawType, categoriesByKey, subCategoriesByKey), true), validateObjectSpriteStageTab(rawType, categoriesByKey, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts), true), validatePhysicsTab(rawType), true);
}
exports.validateObject = validateObject;
function validateObjectGeneralTab(rawType, categoriesByKey, subCategories, subCategoriesByKey, lootTablesByKey, localization, localizationKeys, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawType.id, 'No id') && rawType.id != 0) {
        assert(!idsSeen.includes(rawType.id), "Duplicate id: ".concat(rawType.id));
    }
    if (assertNotNullish(rawType.key, 'No key') && localization) {
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('object', 'name', rawType.key)), 'No name');
    }
    if (assertNotNullish(rawType.categoryKey, 'No category')) {
        assert(rawType.categoryKey in categoriesByKey, "Invalid category: ".concat(rawType.categoryKey));
        var availableSubCategories = subCategories.filter(function (subCategory) { return subCategory.categoryKey === rawType.categoryKey; });
        if (availableSubCategories.length > 0) {
            if (assertNotNullish(rawType.subCategoryKey, 'No sub category')) {
                assert((0, null_util_1.isNotNullish)(availableSubCategories.find(function (subCategory) { return subCategory.key === rawType.subCategoryKey; })), "Invalid sub category: ".concat(rawType.subCategoryKey));
            }
        }
    }
    var _b = (0, objectType_util_1.getObjectSetting)('lootType', rawType, categoriesByKey, subCategoriesByKey), lootType = _b.value, lootTypeControlledBy = _b.controlledBy;
    if ((0, null_util_1.isNotNullish)(lootType)) {
        if (lootTypeControlledBy === 0) {
            assert(constants_1.LOOT_TYPES.includes(lootType), "Invalid loot type: ".concat(lootType));
        }
        if (lootType === constants_1.LOOT_TYPE_DROP) {
            if (assertNotNullish(rawType.lootTableKey, 'No loot table key')) {
                assert(rawType.lootTableKey in lootTablesByKey, "No loot table with key ".concat(rawType.lootTableKey, " exists"));
            }
        }
    }
    var hasHealth = (0, objectType_util_1.getObjectSetting)('hasHealth', rawType, categoriesByKey, subCategoriesByKey).value;
    if (hasHealth) {
        assert(rawType.health > 0, 'Health must be greater than 0');
        assert(rawType.health % 1 === 0, 'Health must be a whole number');
    }
    var requiresWater = (0, objectType_util_1.getObjectSetting)('requiresWater', rawType, categoriesByKey, subCategoriesByKey).value;
    if (requiresWater) {
        assert(rawType.expireChance >= 0 && rawType.expireChance <= 100, 'Expire change must be between 0 and 100 inclusive');
        assert(rawType.expireChance % 1 === 0, 'Expire change must be a whole number');
    }
    var _c = (0, objectType_util_1.getObjectSetting)('inventoryType', rawType, categoriesByKey, subCategoriesByKey), inventoryType = _c.value, inventoryTypeControlledBy = _c.controlledBy;
    var _d = (0, objectType_util_1.getObjectSetting)('isWorkstation', rawType, categoriesByKey, subCategoriesByKey), isWorkstation = _d.value, isWorkstationControlledBy = _d.controlledBy;
    if (inventoryTypeControlledBy === 0) {
        if (assertNotNullish(inventoryType, 'No inventory type')) {
            assert(constants_1.INVENTORY_TYPES.includes(inventoryType), "Invalid inventory type: ".concat(inventoryType));
        }
    }
    if (inventoryTypeControlledBy === 0 || isWorkstationControlledBy === 0) {
        assert(!isWorkstation || inventoryType === constants_1.INVENTORY_TYPE_SMALL, 'Workstations must have small inventories');
    }
    var stagesType = (0, objectType_util_1.getObjectSetting)('stagesType', rawType, categoriesByKey, subCategoriesByKey).value;
    if (stagesType && stagesType !== constants_1.STAGES_TYPE_NONE && lootType && lootType !== constants_1.LOOT_TYPE_NONE) {
        assert(rawType.experience > 0, 'Experience must be greater than 0');
        assert(rawType.experience % 1 === 0, 'Experience must be a whole number');
    }
    var hasLight = (0, objectType_util_1.getObjectSetting)('hasLight', rawType, categoriesByKey, subCategoriesByKey).value;
    if (hasLight && assertNotNullish(rawType.lightLevel, 'No light level')) {
        assert(rawType.lightLevel >= 1 && rawType.lightLevel < 20, 'Light level must be between 1 and 20');
        if (rawType.lightLevel >= 1) {
            if (assertNotNullish(rawType.lightPosition, 'No light position')) {
                assert(rawType.lightPosition.x >= 0 && rawType.lightPosition.x < rawType.sprite.width, "Light position x value must be between 0 and ".concat(rawType.sprite.width - 1, " (inclusive)"));
                assert(rawType.lightPosition.y >= 0 && rawType.lightPosition.y < rawType.sprite.height, "Light position y value must be between 0 and ".concat(rawType.sprite.height - 1, " (inclusive)"));
            }
        }
    }
    return errors;
}
exports.validateObjectGeneralTab = validateObjectGeneralTab;
function validateObjectPlacementSpawningTab(rawType, categoriesByKey, subCategoriesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    var _b = (0, objectType_util_1.getObjectSetting)('placementPosition', rawType, categoriesByKey, subCategoriesByKey), placementPosition = _b.value, placementPositionControlledBy = _b.controlledBy;
    if ((0, null_util_1.isNotNullish)(placementPosition) && placementPositionControlledBy === 0) {
        assert(constants_1.PLACEMENT_POSITIONS.includes(placementPosition), "Invalid placement position: ".concat(placementPosition));
    }
    var _c = (0, objectType_util_1.getObjectSetting)('placementLayer', rawType, categoriesByKey, subCategoriesByKey), placementLayer = _c.value, placementLayerControlledBy = _c.controlledBy;
    if ((0, null_util_1.isNotNullish)(placementLayer) && placementLayerControlledBy === 0) {
        assert(constants_1.PLACEMENT_LAYERS.includes(placementLayer), "Invalid placement layer: ".concat(placementLayer));
    }
    var _d = (0, objectType_util_1.getObjectSetting)('spawningConditions', rawType, categoriesByKey, subCategoriesByKey), spawningConditions = _d.value, spawningConditionsControlledBy = _d.controlledBy;
    if ((0, null_util_1.isNotNullish)(spawningConditions) && spawningConditionsControlledBy === 0) {
        assertSpawningConditions(assert, spawningConditions);
    }
    var stagesType = (0, objectType_util_1.getObjectSetting)('stagesType', rawType, categoriesByKey, subCategoriesByKey).value;
    if ((0, null_util_1.isNotNullish)(stagesType) && (stagesType === constants_1.STAGES_TYPE_GROWABLE || stagesType === constants_1.STAGES_TYPE_GROWABLE_WITH_HEALTH)) {
        if (assertNotNullish(rawType.season, 'No season')) {
            assert(rawType.season === constants_1.ALL_SEASONS || constants_1.SEASONS.includes(rawType.season), "Invalid season: ".concat(rawType.season));
        }
    }
    return errors;
}
exports.validateObjectPlacementSpawningTab = validateObjectPlacementSpawningTab;
function validateObjectSpriteStageTab(rawType, categoriesByKey, subCategoriesByKey, lootTablesByKey, spriteCounts, accentSpriteCounts) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    assertNotNullish(rawType.sprite, 'No sprite data');
    var _b = (0, objectType_util_1.getObjectSetting)('canOpen', rawType, categoriesByKey, subCategoriesByKey).value, canOpen = _b === void 0 ? false : _b;
    var _c = (0, objectType_util_1.getObjectSetting)('canActivate', rawType, categoriesByKey, subCategoriesByKey).value, canActivate = _c === void 0 ? false : _c;
    var _d = (0, objectType_util_1.getObjectSetting)('placementPosition', rawType, categoriesByKey, subCategoriesByKey).value, placementPosition = _d === void 0 ? constants_1.PLACEMENT_POSITION_CENTER : _d;
    var _e = (0, objectType_util_1.getObjectSetting)('stagesType', rawType, categoriesByKey, subCategoriesByKey), stagesType = _e.value, stagesTypeControlledBy = _e.controlledBy;
    var _f = (0, objectType_util_1.getObjectSetting)('changesSpritesWithSeason', rawType, categoriesByKey, subCategoriesByKey).value, changesSpritesWithSeason = _f === void 0 ? undefined : _f;
    if (changesSpritesWithSeason) {
        for (var _i = 0, SEASONS_1 = constants_1.SEASONS; _i < SEASONS_1.length; _i++) {
            var season = SEASONS_1[_i];
            var spriteKey = "".concat(rawType.key, "-").concat(season);
            assertSpriteCounts(assert, rawType, categoriesByKey, subCategoriesByKey, placementPosition, canOpen, canActivate, rawType.key ? spriteCounts[spriteKey] : 0, rawType.key ? accentSpriteCounts[spriteKey] : {}, stagesType, "".concat(season, ": "));
        }
    }
    else {
        assertSpriteCounts(assert, rawType, categoriesByKey, subCategoriesByKey, placementPosition, canOpen, canActivate, rawType.key ? spriteCounts[rawType.key] : 0, rawType.key ? accentSpriteCounts[rawType.key] : {}, stagesType, '');
    }
    if (assertNotNullish(rawType.worldSize, 'No world size')) {
        assert(rawType.worldSize.x >= 1, 'World size width must be at least 1');
        assert(rawType.worldSize.x % 1 == 0, 'World size width must be a whole number');
        assert(rawType.worldSize.y >= 1, 'World size height must be at least 1');
        assert(rawType.worldSize.y % 1 == 0, 'World size height must be a whole number');
    }
    if (canOpen) {
        assert(!canActivate, 'Objects that can open cannot be activated');
        assert(!changesSpritesWithSeason, 'Objects that can open cannot change sprites with seasons');
    }
    if (canActivate) {
        assert(!changesSpritesWithSeason, 'Objects that can be activated cannot change sprites with seasons');
        if (assertNotNullish(rawType.animationSampleRate, 'Objects that can be activated must have an animation sample rate')) {
            assert(rawType.animationSampleRate >= 1, 'Animation sample rate must be at least 1');
            assert(rawType.animationSampleRate % 1 == 0, 'Animation sample rate must be a whole number');
        }
    }
    if ((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE) {
        assert(!canOpen, 'Objects that can open cannot have stages');
        assert(!canActivate, 'Objects that can be activated cannot have stages');
        if (assert(constants_1.STAGES_TYPES.includes(stagesType), "Invalid stages type: ".concat(stagesType)) && (0, null_util_1.isNotNullish)(rawType.stages)) {
            var lootType_1 = (0, objectType_util_1.getObjectSetting)('lootType', rawType, categoriesByKey, subCategoriesByKey).value;
            for (var i = 0; i < rawType.stages.length; i++) {
                var stage = rawType.stages[i];
                if ((0, null_util_1.isNotNullish)(lootType_1)) {
                    if (lootType_1 === constants_1.LOOT_TYPE_STAGE_DROP) {
                        if (assertNotNullish(stage.lootTableKey, "Stage ".concat(i, " has no loot table key"))) {
                            assert(stage.lootTableKey in lootTablesByKey, "Stage ".concat(i, " no loot table with key ").concat(stage.lootTableKey, " exists"));
                        }
                    }
                }
                switch (stagesType) {
                    case constants_1.STAGES_TYPE_GROWABLE_WITH_HEALTH:
                        assertGrowableStage(assert, assertNotNullish, stage, i + 1, rawType.stages.length);
                        assertHealthStage(assert, stage, i + 1);
                        break;
                    case constants_1.STAGES_TYPE_GROWABLE:
                        assertGrowableStage(assert, assertNotNullish, stage, i + 1, rawType.stages.length);
                        break;
                    case constants_1.STAGES_TYPE_BREAKABLE:
                        assertBreakableStage(assert, rawType, stage, i);
                        break;
                }
            }
        }
    }
    var _g = (0, objectType_util_1.getObjectSetting)('lootType', rawType, categoriesByKey, subCategoriesByKey), lootType = _g.value, lootTypeControlledBy = _g.controlledBy;
    if (lootTypeControlledBy === 0 || stagesTypeControlledBy === 0) {
        assert(((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE) || lootType !== constants_1.LOOT_TYPE_STAGE_DROP, "Loot type ".concat(constants_1.LOOT_TYPE_STAGE_DROP, " requires stages"));
    }
    return errors;
}
exports.validateObjectSpriteStageTab = validateObjectSpriteStageTab;
function assertSpriteCounts(assert, rawType, categoriesByKey, subCategoriesByKey, placementPosition, canOpen, canActivate, spriteCount, accentSpriteCounts, stagesType, prefix) {
    var _a, _b;
    if ((0, null_util_1.isNotNullish)(rawType.sprite)) {
        assertObjectSprite(assert, rawType.sprite, placementPosition, canOpen, canActivate, spriteCount, accentSpriteCounts, prefix);
    }
    if ((0, null_util_1.isNotNullish)(stagesType) && stagesType !== constants_1.STAGES_TYPE_NONE) {
        assert((0, null_util_1.isNotNullish)(rawType.sprite) && (0, null_util_1.isNotNullish)(rawType.stages) && spriteCount == rawType.stages.length, "".concat(prefix, " Sprite count (").concat(spriteCount !== null && spriteCount !== void 0 ? spriteCount : 0, ") does not match stage count (").concat((_b = (_a = rawType.stages) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, ")"));
    }
    if ((0, null_util_1.isNotNullish)(rawType.categoryKey) &&
        rawType.categoryKey in categoriesByKey &&
        (0, null_util_1.isNotNullish)(rawType.subCategoryKey) &&
        rawType.subCategoryKey in subCategoriesByKey) {
        var subCategory = subCategoriesByKey[rawType.subCategoryKey];
        if (subCategory && (0, null_util_1.isNotNullish)(subCategory.rulesets) && subCategory.rulesets.length > 0) {
            var expectedSpriteCount = 0;
            for (var _i = 0, _c = subCategory.rulesets; _i < _c.length; _i++) {
                var ruleset = _c[_i];
                if ((0, null_util_1.isNotNullish)(ruleset.rules)) {
                    for (var _d = 0, _e = ruleset.rules; _d < _e.length; _d++) {
                        var rule = _e[_d];
                        if ((0, null_util_1.isNotNullish)(rule) && (0, null_util_1.isNotNullish)(rule.sprites) && rule.sprites.length > 0) {
                            for (var _f = 0, _g = rule.sprites; _f < _g.length; _f++) {
                                var sprite = _g[_f];
                                if (sprite > expectedSpriteCount) {
                                    expectedSpriteCount = sprite;
                                }
                            }
                        }
                    }
                }
            }
            expectedSpriteCount += 1;
            assert((0, null_util_1.isNotNullish)(rawType.sprite) && (0, null_util_1.isNotNullish)(spriteCount) && spriteCount >= expectedSpriteCount, "".concat(prefix, " There must be at least ").concat(spriteCount, " sprites based on rules"));
        }
    }
}
exports.assertSpriteCounts = assertSpriteCounts;
function validatePhysicsTab(rawType) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    assertColliders(assert, assertNotNullish, rawType);
    return errors;
}
exports.validatePhysicsTab = validatePhysicsTab;
function assertObjectSprite(assert, objectSprite, placementPosition, canOpen, canActivate, spriteCount, accentSpriteCounts, prefix) {
    var _a, _b, _c, _d;
    if (assert(spriteCount > 0, "".concat(prefix, " No sprites"))) {
        if ((0, null_util_1.isNotNullish)(accentSpriteCounts)) {
            for (var _i = 0, GROUND_TYPES_1 = constants_1.GROUND_TYPES; _i < GROUND_TYPES_1.length; _i++) {
                var groundType = GROUND_TYPES_1[_i];
                assert((0, null_util_1.isNullish)(accentSpriteCounts[groundType]) ||
                    accentSpriteCounts[groundType] === 0 ||
                    accentSpriteCounts[groundType] === spriteCount, "".concat(prefix, " Accent \"").concat(groundType, "\": Sprite count (").concat(accentSpriteCounts[groundType], ") does not match main sprite count (").concat(spriteCount, ")"));
            }
        }
        if (placementPosition === constants_1.PLACEMENT_POSITION_EDGE) {
            assert(!canOpen || spriteCount >= 4, "".concat(prefix, " Objects that can open and can be placed on edges must have at least 4 sprites"));
        }
        else {
            assert(!canOpen || spriteCount >= 2, "".concat(prefix, " Objects that can open must have at least 2 sprites"));
        }
        assert(!canActivate || spriteCount >= 2, "".concat(prefix, " Objects that can be activated must have at least 2 sprites"));
    }
    assert(objectSprite.width >= 16, "".concat(prefix, " Sprite width must be at least 16"));
    assert(objectSprite.width % 1 == 0, "".concat(prefix, " Sprite width must be a whole number"));
    assert(objectSprite.height >= 16, "".concat(prefix, " Sprite height must be at least 16"));
    assert(objectSprite.height % 1 == 0, "".concat(prefix, " Sprite height must be a whole number"));
    if ((0, null_util_1.isNotNullish)(objectSprite.pivotOffset)) {
        assert(objectSprite.pivotOffset.x % 1 == 0, "".concat(prefix, " Sprite pivot offset x must be a whole number"));
        assert(objectSprite.pivotOffset.y % 1 == 0, "".concat(prefix, " Sprite pivot offset y must be a whole number"));
    }
    if ((0, null_util_1.isNotNullish)(objectSprite.sprites)) {
        for (var _e = 0, _f = Object.keys(objectSprite.sprites); _e < _f.length; _e++) {
            var key = _f[_e];
            var keyAsNumber = Number(key);
            if (assert(!Number.isNaN(keyAsNumber), "Sprite key '".concat(key, "' must be a number"))) {
                var individualObjectSprite = objectSprite.sprites[key];
                if ((0, null_util_1.isNotNullish)(individualObjectSprite)) {
                    if ((0, null_util_1.isNotNullish)(individualObjectSprite.pivotOffset)) {
                        assert(((_a = individualObjectSprite.pivotOffset) === null || _a === void 0 ? void 0 : _a.x) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " pivot offset x must be a whole number"));
                        assert(((_b = individualObjectSprite.pivotOffset) === null || _b === void 0 ? void 0 : _b.y) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " pivot offset y must be a whole number"));
                    }
                    if ((0, null_util_1.isNotNullish)(individualObjectSprite.spriteOffset)) {
                        assert(((_c = individualObjectSprite.spriteOffset) === null || _c === void 0 ? void 0 : _c.x) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " sprite offset x must be a whole number"));
                        assert(((_d = individualObjectSprite.spriteOffset) === null || _d === void 0 ? void 0 : _d.y) % 1 == 0, "Sprite ".concat(keyAsNumber + 1, " sprite offset y must be a whole number"));
                    }
                    if ((0, null_util_1.isNotNullish)(individualObjectSprite.placementLayer)) {
                        assert(constants_1.PLACEMENT_LAYERS.includes(individualObjectSprite.placementLayer), "Sprite ".concat(keyAsNumber + 1, " Invalid placement layer: ").concat(individualObjectSprite.placementLayer));
                    }
                }
            }
        }
    }
}
exports.assertObjectSprite = assertObjectSprite;
function assertGrowableStage(assert, assertNotNullish, stage, index, total) {
    if (!stage.pause && (index < total || ((0, null_util_1.isNotNullish)(stage.jumpToStage) && stage.jumpCondition === constants_1.STAGE_JUMP_CONDITION_TIME))) {
        assert(stage.growthDays > 0, "Stage ".concat(index, ": Growth days must be greater than 0"));
        assert(stage.growthDays % 1 == 0, "Stage ".concat(index, ": Growth days must be a whole number"));
    }
    if ((0, null_util_1.isNotNullish)(stage.jumpToStage)) {
        assertNotNullish(stage.jumpCondition, "Stage ".concat(index, ": No jump condition (required when jump to stage is set)"));
    }
    if ((0, null_util_1.isNotNullish)(stage.jumpCondition)) {
        assert(constants_1.STAGE_JUMP_CONDITIONS.includes(stage.jumpCondition), "Stage ".concat(index, ": Invalid jump condition: ").concat(stage.jumpCondition, ". Only ").concat(constants_1.STAGE_JUMP_CONDITION_TIME, " and ").concat(constants_1.STAGE_JUMP_CONDITION_HARVEST, " are allowed"));
        if (stage.jumpCondition === constants_1.STAGE_JUMP_CONDITION_HARVEST) {
            assert(stage.harvestable, "Stage ".concat(index, ": Stages with a jump condition of ").concat(constants_1.STAGE_JUMP_CONDITION_HARVEST, " must be harvestable"));
        }
    }
}
exports.assertGrowableStage = assertGrowableStage;
function assertHealthStage(assert, stage, index) {
    assert(stage.health >= 0, "Stage ".concat(index, ": No health"));
    assert(stage.health % 1 === 0, "Stage ".concat(index, ": Health must be a whole number"));
}
exports.assertHealthStage = assertHealthStage;
function assertBreakableStage(assert, type, stage, index) {
    var _a;
    assert(stage.threshold <= 100 && stage.threshold >= 0, "Stage ".concat(index + 1, ": Threshold must be between 0 and 100 inclusive"));
    if (index != 0) {
        var previousStageThreshold = (_a = type.stages) === null || _a === void 0 ? void 0 : _a[index - 1].threshold;
        if ((0, null_util_1.isNotNullish)(previousStageThreshold)) {
            assert(previousStageThreshold != stage.threshold, "Stage ".concat(index + 1, ": Has the same threshold as stage ").concat(index));
            assert(previousStageThreshold > stage.threshold, "Stage ".concat(index + 1, ": Has a threshold greater than previous stage ").concat(index));
        }
    }
    assert(index != 0 || stage.threshold == 100, 'The first stage must have a threshold of 100');
    assert(stage.threshold % 1 === 0, "Stage ".concat(index + 1, ": Threshold must be a whole number"));
}
exports.assertBreakableStage = assertBreakableStage;
function assertSpawningConditions(assert, spawningConditions) {
    if ((0, null_util_1.isNotNullish)(spawningConditions) && spawningConditions.length > 0) {
        for (var _i = 0, spawningConditions_1 = spawningConditions; _i < spawningConditions_1.length; _i++) {
            var condition = spawningConditions_1[_i];
            assert(constants_1.CONDITIONS.includes(condition), "Invalid spawning condition: ".concat(condition));
        }
    }
}
exports.assertSpawningConditions = assertSpawningConditions;
function assertSubCategorySpriteRules(assert, assertNotNullish, name, spriteRules) {
    if ((0, null_util_1.isNotNullish)(spriteRules)) {
        if ((0, null_util_1.isNotNullish)(spriteRules.rules) && spriteRules.rules.length > 0) {
            var ruleIndex = 1;
            for (var _i = 0, _a = spriteRules.rules; _i < _a.length; _i++) {
                var rule = _a[_i];
                if (assertNotNullish(rule.sprites, "".concat(name, " ").concat(ruleIndex, ": No sprites")) &&
                    assert(rule.sprites.length > 0, "".concat(name, " ").concat(ruleIndex, ": There must be at least one sprite"))) {
                    for (var _b = 0, _c = rule.sprites; _b < _c.length; _b++) {
                        var sprite = _c[_b];
                        assert(sprite >= 0, "".concat(name, " ").concat(ruleIndex, ": Sprite index must be greater than 0"));
                    }
                }
                if (assertNotNullish(rule.conditions, "".concat(name, " ").concat(ruleIndex, ": No conditions")) &&
                    assert(Object.keys(rule.conditions).length > 0, "".concat(name, " ").concat(ruleIndex, ": There must be at least one condition"))) {
                    for (var _d = 0, _e = Object.keys(rule.conditions); _d < _e.length; _d++) {
                        var direction = _e[_d];
                        assert(constants_1.SPRITE_RULE_DIRECTIONS.includes(direction), "".concat(name, " ").concat(ruleIndex, ": ").concat(direction, " is not a valid direction"));
                    }
                }
                ruleIndex++;
            }
        }
    }
}
exports.assertSubCategorySpriteRules = assertSubCategorySpriteRules;
function assertColliders(assert, assertNotNullish, type) {
    if ((0, null_util_1.isNotNullish)(type.colliders)) {
        dataValidation.assertObjectColliders(assert, assertNotNullish, type.colliders, 'Generic collider');
    }
    if ((0, null_util_1.isNotNullish)(type.sprite) && (0, null_util_1.isNotNullish)(type.sprite.sprites)) {
        dataValidation.assertObjectSpriteColliders(assert, assertNotNullish, type.sprite.sprites);
    }
}
exports.assertColliders = assertColliders;
function assertObjectSpriteColliders(assert, assertNotNullish, sprites) {
    for (var _i = 0, _a = Object.keys(sprites); _i < _a.length; _i++) {
        var key = _a[_i];
        var colliders = sprites[key].colliders;
        if ((0, null_util_1.isNotNullish)(colliders)) {
            dataValidation.assertObjectColliders(assert, assertNotNullish, colliders, "Sprite ".concat(key, " Collider"));
        }
    }
}
exports.assertObjectSpriteColliders = assertObjectSpriteColliders;
function assertObjectColliders(assert, assertNotNullish, colliders, type) {
    for (var i = 0; i < colliders.length; i++) {
        dataValidation.assertObjectCollider(assert, assertNotNullish, colliders[i], type, i + 1);
    }
}
exports.assertObjectColliders = assertObjectColliders;
function assertObjectCollider(assert, assertNotNullish, collider, type, index) {
    if (assertNotNullish(collider.type, "".concat(type, " ").concat(index, ": No collider type"))) {
        if (assert(constants_1.COLLIDER_TYPES.includes(collider.type), "".concat(type, " ").concat(index, ": Invalid collider type: ").concat(collider.type, ". Only ").concat(constants_1.POLYGON_COLLIDER_TYPE, " and ").concat(constants_1.BOX_COLLIDER_TYPE, " are allowed"))) {
            switch (collider.type) {
                case constants_1.POLYGON_COLLIDER_TYPE:
                    break;
                case constants_1.AUTO_BOX_COLLIDER_TYPE:
                    break;
                case constants_1.BOX_COLLIDER_TYPE:
                    dataValidation.assertBoxCollider(assertNotNullish, collider, type, index);
                    break;
            }
        }
    }
}
exports.assertObjectCollider = assertObjectCollider;
function assertBoxCollider(assertNotNullish, collider, type, index) {
    if (assertNotNullish(collider, "".concat(type, " ").concat(index, ": Not configured"))) {
        assertNotNullish(collider.size, "".concat(type, " ").concat(index, ": No size"));
        assertNotNullish(collider.offset, "".concat(type, " ").concat(index, ": No offset"));
    }
}
exports.assertBoxCollider = assertBoxCollider;
function checkObjectsRequiredSettings(allErrors, objectTypes, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey) {
    var _a, _b;
    var _c, _d, _e;
    var objectErrors = (_d = (_c = allErrors[constants_1.OBJECTS_DATA_FILE]) === null || _c === void 0 ? void 0 : _c[constants_1.ERROR_SECTION_OBJECTS]) !== null && _d !== void 0 ? _d : {};
    for (var _i = 0, objectTypes_1 = objectTypes; _i < objectTypes_1.length; _i++) {
        var type = objectTypes_1[_i];
        var key = type.key;
        var placementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
        if ((0, null_util_1.isNotNullish)(placementLayer) && (0, null_util_1.isNotNullish)(type.settings)) {
            var errors = __spreadArray(__spreadArray([], checkObjectRequiredBelowSettings(placementLayer, type.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true), checkObjectRequiredAdjacentSettings(placementLayer, type.settings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey), true);
            if (errors.length > 0) {
                if (key in objectErrors) {
                    (_a = objectErrors[key]).push.apply(_a, errors);
                }
                else {
                    objectErrors[key] = errors;
                }
            }
        }
    }
    if (Object.keys(objectErrors).length > 0) {
        allErrors[constants_1.OBJECTS_DATA_FILE] = __assign(__assign({}, ((_e = allErrors[constants_1.OBJECTS_DATA_FILE]) !== null && _e !== void 0 ? _e : {})), (_b = {}, _b[constants_1.ERROR_SECTION_OBJECTS] = objectErrors, _b));
    }
}
exports.checkObjectsRequiredSettings = checkObjectsRequiredSettings;
function checkObjectRequiredBelowSettings(placementLayer, objectSettings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey) {
    var _a, _b;
    var _c = (0, assert_util_1.createAssert)(), errors = _c.errors, assert = _c.assert, assertNotNullish = _c.assertNotNullish;
    var layerBelow;
    if (placementLayer === constants_1.PLACEMENT_LAYER_ON_GROUND) {
        layerBelow = constants_1.PLACEMENT_LAYER_IN_GROUND;
    }
    else if (placementLayer === constants_1.PLACEMENT_LAYER_IN_AIR) {
        layerBelow = constants_1.PLACEMENT_LAYER_ON_GROUND;
    }
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredBelowObjectCategoryKeys)) {
        for (var _i = 0, _d = objectSettings.requiredBelowObjectCategoryKeys; _i < _d.length; _i++) {
            var key = _d[_i];
            var category = objectCategoriesByKey[key];
            if (assertNotNullish(category, "Invalid required below category ".concat(key))) {
                assert(((_a = category.settings) === null || _a === void 0 ? void 0 : _a.placementLayer) === layerBelow, "Required below category ".concat(key, " is in the wrong placement layer ").concat((_b = category.settings) === null || _b === void 0 ? void 0 : _b.placementLayer, ". Should be ").concat(layerBelow));
            }
        }
    }
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredBelowObjectSubCategoryKeys)) {
        for (var _e = 0, _f = objectSettings.requiredBelowObjectSubCategoryKeys; _e < _f.length; _e++) {
            var key = _f[_e];
            var subCategory = objectSubCategoriesByKey[key];
            if (assertNotNullish(subCategory, "Invalid required below sub category ".concat(key))) {
                var subCategoryPlacementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', subCategory, objectCategoriesByKey).value;
                assert(subCategoryPlacementLayer === layerBelow, "Required below sub category ".concat(key, " is in the wrong placement layer ").concat(subCategoryPlacementLayer, ". Should be ").concat(layerBelow));
            }
        }
    }
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredBelowObjectKeys)) {
        for (var _g = 0, _h = objectSettings.requiredBelowObjectKeys; _g < _h.length; _g++) {
            var key = _h[_g];
            var type = objectsByKey[key];
            if (assertNotNullish(type, "Invalid required below object ".concat(key))) {
                var objectPlacementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
                assert(objectPlacementLayer === layerBelow, "Required below object ".concat(key, " is in the wrong placement layer ").concat(objectPlacementLayer, ". Should be ").concat(layerBelow));
            }
        }
    }
    return errors;
}
exports.checkObjectRequiredBelowSettings = checkObjectRequiredBelowSettings;
function checkObjectRequiredAdjacentSettings(placementLayer, objectSettings, objectCategoriesByKey, objectSubCategoriesByKey, objectsByKey) {
    var _a, _b;
    var _c = (0, assert_util_1.createAssert)(), errors = _c.errors, assert = _c.assert, assertNotNullish = _c.assertNotNullish;
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredAdjacentObjectCategoryKeys)) {
        for (var _i = 0, _d = objectSettings.requiredAdjacentObjectCategoryKeys; _i < _d.length; _i++) {
            var key = _d[_i];
            var category = objectCategoriesByKey[key];
            if (assertNotNullish(category, "Invalid required adjacent category ".concat(key))) {
                assert(((_a = category.settings) === null || _a === void 0 ? void 0 : _a.placementLayer) === placementLayer, "Required adjacent category ".concat(key, " is in the wrong placement layer ").concat((_b = category.settings) === null || _b === void 0 ? void 0 : _b.placementLayer, ". Should be ").concat(placementLayer));
            }
        }
    }
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredAdjacentObjectSubCategoryKeys)) {
        for (var _e = 0, _f = objectSettings.requiredAdjacentObjectSubCategoryKeys; _e < _f.length; _e++) {
            var key = _f[_e];
            var subCategory = objectSubCategoriesByKey[key];
            if (assertNotNullish(subCategory, "Invalid required adjacent sub category ".concat(key))) {
                var subCategoryPlacementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', subCategory, objectCategoriesByKey).value;
                assert(subCategoryPlacementLayer === placementLayer, "Required adjacent sub category ".concat(key, " is in the wrong placement layer ").concat(subCategoryPlacementLayer, ". Should be ").concat(placementLayer));
            }
        }
    }
    if ((0, null_util_1.isNotNullish)(objectSettings.requiredAdjacentObjectKeys)) {
        for (var _g = 0, _h = objectSettings.requiredAdjacentObjectKeys; _g < _h.length; _g++) {
            var key = _h[_g];
            var type = objectsByKey[key];
            if (assertNotNullish(type, "Invalid required adjacent object ".concat(key))) {
                var objectPlacementLayer = (0, objectType_util_1.getObjectSetting)('placementLayer', type, objectCategoriesByKey, objectSubCategoriesByKey).value;
                assert(objectPlacementLayer === placementLayer, "Required adjacent object ".concat(key, " is in the wrong placement layer ").concat(objectPlacementLayer, ". Should be ").concat(placementLayer));
            }
        }
    }
    return errors;
}
exports.checkObjectRequiredAdjacentSettings = checkObjectRequiredAdjacentSettings;
/**
 * Starting Items
 */
function validatePlayerData(allErrors, rawPlayerData, itemsByKey) {
    var playerData = validatePlayerDataGeneralTab(allErrors, rawPlayerData, itemsByKey);
    validatePlayerDataLevelsTab(allErrors, playerData);
    return playerData;
}
exports.validatePlayerData = validatePlayerData;
function validatePlayerDataGeneralTab(allErrors, rawPlayerData, itemsByKey) {
    var _a, _b;
    var _c, _d;
    var playerData = (0, converters_util_1.toPlayerData)((0, converters_util_1.toProcessedRawPlayerData)(undefined));
    if (!(0, null_util_1.isNotNullish)(rawPlayerData)) {
        return playerData;
    }
    var playerStatErrors = validatePlayerStats(rawPlayerData);
    if (Object.keys(playerStatErrors).length > 0) {
        allErrors[constants_1.PLAYER_DATA_FILE] = __assign(__assign({}, ((_c = allErrors[constants_1.PLAYER_DATA_FILE]) !== null && _c !== void 0 ? _c : {})), (_a = {}, _a[constants_1.ERROR_SECTION_PLAYER_STATS] = playerStatErrors, _a));
    }
    var startingItemErrors = validateStartingItems(rawPlayerData.startingItems, itemsByKey);
    if (Object.keys(startingItemErrors).length > 0) {
        allErrors[constants_1.PLAYER_DATA_FILE] = __assign(__assign({}, ((_d = allErrors[constants_1.PLAYER_DATA_FILE]) !== null && _d !== void 0 ? _d : {})), (_b = {}, _b[constants_1.ERROR_SECTION_PLAYER_STARTING_ITEMS] = startingItemErrors, _b));
    }
    return playerData;
}
exports.validatePlayerDataGeneralTab = validatePlayerDataGeneralTab;
function validatePlayerDataLevelsTab(allErrors, playerData) {
    var _a;
    var _b;
    var _c = (0, assert_util_1.createAssert)(), errors = _c.errors, assert = _c.assert;
    for (var i = 0; i < playerData.nextLevelExp.length; i++) {
        assert(playerData.nextLevelExp[i] > 0, "Level ".concat(i + 2, " next level exp must be greater than 0"));
        assert(playerData.nextLevelExp[i] % 1 === 0, "Level ".concat(i + 2, " next level exp must be a whole number"));
    }
    if (errors.length > 0) {
        allErrors[constants_1.PLAYER_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.PLAYER_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_PLAYER_LEVELS] = errors, _a));
    }
    return playerData;
}
exports.validatePlayerDataLevelsTab = validatePlayerDataLevelsTab;
function validatePlayerStats(rawPlayerData) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    assert(rawPlayerData.health > 0, 'Starting health must be greater than 0');
    assert(rawPlayerData.health % 1 === 0, 'Starting health must be a whole number');
    assert(rawPlayerData.healthMax > 0, 'Max health must be greater than 0');
    assert(rawPlayerData.healthMax % 1 === 0, 'Max health must be a whole number');
    assert(rawPlayerData.healthDepletionTime > 0, 'Health depletion time must be greater than 0');
    assert(rawPlayerData.healthRefillTime > 0, 'Health refill time must be greater than 0');
    assert(rawPlayerData.healthRefillHungerDepletionRate > 0, 'Health refill hunger depletion rate must be greater than 0');
    assert(rawPlayerData.healthRefillThirstDepletionRate > 0, 'Health refill thirst depletion rate must be greater than 0');
    assert(rawPlayerData.energy > 0, 'Starting energy must be greater than 0');
    assert(rawPlayerData.energy % 1 === 0, 'Starting energy must be a whole number');
    assert(rawPlayerData.energyMax > 0, 'Max energy must be greater than 0');
    assert(rawPlayerData.energyMax % 1 === 0, 'Max energy must be a whole number');
    assert(rawPlayerData.energyBaseUsageRate > 0, 'Base energy usage rate must be greater than 0');
    assert(rawPlayerData.energyRefillRate > 0, 'Energy refill rate must be greater than 0');
    assert(rawPlayerData.energyRefillHungerDepletionRate > 0, 'Energy refill hunger depletion rate must be greater than 0');
    assert(rawPlayerData.energyRefillThirstDepletionRate > 0, 'Energy refill thirst depletion rate must be greater than 0');
    assert(rawPlayerData.hunger > 0, 'Starting hunger must be greater than 0');
    assert(rawPlayerData.hunger % 1 === 0, 'Starting hunger must be a whole number');
    assert(rawPlayerData.hungerMax > 0, 'Max hunger must be greater than 0');
    assert(rawPlayerData.hungerMax % 1 === 0, 'Max hunger must be a whole number');
    assert(rawPlayerData.hungerInitialDelay > 0, 'Hunger initial delay must be greater than 0');
    assert(rawPlayerData.hungerInitialDelay % 1 === 0, 'Hunger initial delay must be a whole number');
    assert(rawPlayerData.hungerMaxedOutDelay > 0, 'Hunger maxed out delay must be greater than 0');
    assert(rawPlayerData.hungerMaxedOutDelay % 1 === 0, 'Hunger maxed out delay must be a whole number');
    assert(rawPlayerData.hungerDepletionRate > 0, 'Hunger depletion rate must be greater than 0');
    assert(rawPlayerData.thirst > 0, 'Starting thirst must be greater than 0');
    assert(rawPlayerData.thirst % 1 === 0, 'Starting thirst must be a whole number');
    assert(rawPlayerData.thirstMax > 0, 'Max thirst must be greater than 0');
    assert(rawPlayerData.thirstMax % 1 === 0, 'Max thirst must be a whole number');
    assert(rawPlayerData.thirstInitialDelay > 0, 'Thirst initial delay must be greater than 0');
    assert(rawPlayerData.thirstInitialDelay % 1 === 0, 'Thirst initial delay must be a whole number');
    assert(rawPlayerData.thirstMaxedOutDelay > 0, 'Thirst maxed out delay must be greater than 0');
    assert(rawPlayerData.thirstMaxedOutDelay % 1 === 0, 'Thirst maxed out delay must be a whole number');
    assert(rawPlayerData.thirstDepletionRate > 0, 'Thirst depletion rate must be greater than 0');
    assert(rawPlayerData.money > 0, 'Money must be greater than 0');
    assert(rawPlayerData.money % 1 === 0, 'Money must be a whole number');
    assert(rawPlayerData.damageImmunityTime > 0, 'Damage immunity time must be greater than 0');
    assert(rawPlayerData.damageImmunityTime <= 10, 'Damage immunity time must be less than or equal to 10');
    return errors;
}
exports.validatePlayerStats = validatePlayerStats;
function validateStartingItems(startingItems, itemsByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    Object.keys(startingItems !== null && startingItems !== void 0 ? startingItems : []).forEach(function (itemTypeKey, index) {
        var header = "Starting Item ".concat(index + 1);
        if ((0, string_util_1.isNotEmpty)(itemTypeKey)) {
            assert(itemTypeKey in itemsByKey, "".concat(header, ": No item with key ").concat(itemTypeKey, " exists"));
        }
        var itemAmount = startingItems[itemTypeKey];
        assert(itemAmount > 0 && itemAmount % 1 == 0, "".concat(header, ": Amount must be a positive whole number greater than 0"));
    });
    return errors;
}
exports.validateStartingItems = validateStartingItems;
/**
 * Dialogue
 */
function validateDialogueTrees(allErrors, rawDialogueTrees, creaturesByKey, eventLogsByKey, localization, localizationKeys) {
    var _a;
    var _b;
    var dialogueTrees = [];
    var dialogueTreesByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawDialogueTrees)) {
        return { dialogueTrees: dialogueTrees, dialogueTreesByKey: dialogueTreesByKey };
    }
    var dialogueErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawDialogueTrees_1 = rawDialogueTrees; _i < rawDialogueTrees_1.length; _i++) {
        var rawDialogueTree = rawDialogueTrees_1[_i];
        var key = void 0;
        if ((0, null_util_1.isNotNullish)(rawDialogueTree.key)) {
            key = rawDialogueTree.key;
        }
        else {
            key = "Dialogue Tree #".concat(i);
        }
        var errors = validateDialogueTree(rawDialogueTree, creaturesByKey, eventLogsByKey, localization, localizationKeys, idsSeen);
        i++;
        if ((0, null_util_1.isNotNullish)(rawDialogueTree.key)) {
            var type = (0, converters_util_1.toDialogueTree)(rawDialogueTree);
            dialogueTrees.push(type);
            dialogueTreesByKey[type.key] = type;
            idsSeen.push(type.id);
        }
        if (errors.length > 0) {
            dialogueErrors[key] = errors;
        }
    }
    if (Object.keys(dialogueErrors).length > 0) {
        allErrors[constants_1.DIALOGUE_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.DIALOGUE_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_DIALOGUE_TREES] = dialogueErrors, _a));
    }
    return { dialogueTrees: dialogueTrees, dialogueTreesByKey: dialogueTreesByKey };
}
exports.validateDialogueTrees = validateDialogueTrees;
function validateDialogueTree(rawType, creaturesByKey, eventLogsByKey, localization, localizationKeys, idsSeen) {
    return __spreadArray(__spreadArray(__spreadArray([], validateDialogueTreeGeneralTab(rawType, creaturesByKey, eventLogsByKey, idsSeen), true), validateDialogueTreeConditionsTab(rawType), true), validateDialogueTreeDialogueTab(rawType, localization, localizationKeys), true);
}
exports.validateDialogueTree = validateDialogueTree;
function validateDialogueTreeGeneralTab(rawType, creaturesByKey, eventLogsByKey, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'No id')) {
        assert(!idsSeen.includes(rawType.id), "Duplicate id: ".concat(rawType.id));
    }
    assertNotNullish(rawType.key, 'No key');
    if (assertNotNullish(rawType.creatureKey, 'No creature')) {
        assert(rawType.creatureKey in creaturesByKey, "Invalid creature: ".concat(rawType.creatureKey));
    }
    if (assertNotNullish(rawType.priority, 'No priority')) {
        assert(rawType.priority >= 0, 'Priority cannot be negative');
    }
    if (rawType.runOnlyOnce) {
        assertNotNullish(rawType.completionEvent, 'No completion event');
    }
    if ((0, null_util_1.isNotNullish)(rawType.completionEvent)) {
        assert(rawType.completionEvent in eventLogsByKey, "Invalid completion event: ".concat(rawType.completionEvent));
    }
    return errors;
}
exports.validateDialogueTreeGeneralTab = validateDialogueTreeGeneralTab;
function validateDialogueTreeConditionsTab(rawType) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _j = (0, assert_util_1.createAssert)(), errors = _j.errors, assert = _j.assert, assertNotNullish = _j.assertNotNullish;
    if ((0, null_util_1.isNotNullish)(rawType.conditions)) {
        if ((0, null_util_1.isNotNullish)(rawType.conditions.days)) {
            for (var _i = 0, _k = rawType.conditions.days; _i < _k.length; _i++) {
                var day = _k[_i];
                assert(day >= 0 && day <= 6, "Invalid day '".concat(day, "'. Day must be between 0 and 6 (inclusive)"));
            }
        }
        if ((0, null_util_1.isNotNullish)(rawType.conditions.timesComparator)) {
            assert(constants_1.TIME_COMPARATORS.includes(rawType.conditions.timesComparator), "Invalid times comparator '".concat(rawType.conditions.timesComparator, "'"));
            if (constants_1.TIME_COMPARATORS.includes(rawType.conditions.timesComparator)) {
                switch (rawType.conditions.timesComparator) {
                    case constants_1.TIME_COMPARATOR_BEFORE:
                        if (assertNotNullish(rawType.conditions.times, "No time for ".concat(constants_1.TIME_COMPARATOR_BEFORE, " comparator")) &&
                            assert(((_b = (_a = rawType.conditions.times) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0, "One time is required for ".concat(constants_1.TIME_COMPARATOR_BEFORE, " comparator"))) {
                            if (assert(rawType.conditions.times.length == 1, "Only provide one times for ".concat(constants_1.TIME_COMPARATOR_BEFORE, " comparator"))) {
                                assert(rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= constants_1.DAY_LENGTH, "Invalid time '".concat(rawType.conditions.times[0], "'. Time must be between 0 and ").concat(constants_1.DAY_LENGTH, " (inclusive)"));
                            }
                        }
                        break;
                    case constants_1.TIME_COMPARATOR_AFTER:
                        if (assertNotNullish(rawType.conditions.times, "No time for ".concat(constants_1.TIME_COMPARATOR_AFTER, " comparator")) &&
                            assert(((_d = (_c = rawType.conditions.times) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0, "One time is required for ".concat(constants_1.TIME_COMPARATOR_AFTER, " comparator"))) {
                            if (assert(rawType.conditions.times.length == 1, "Only provide one times for ".concat(constants_1.TIME_COMPARATOR_AFTER, " comparator"))) {
                                assert(rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= constants_1.DAY_LENGTH, "Invalid time '".concat(rawType.conditions.times[0], "'. Time must be between 0 and ").concat(constants_1.DAY_LENGTH, " (inclusive)"));
                            }
                        }
                        break;
                    case constants_1.TIME_COMPARATOR_BETWEEN:
                        if (assertNotNullish(rawType.conditions.times, "No time for ".concat(constants_1.TIME_COMPARATOR_BEFORE, " TIME_COMPARATOR_BETWEEN")) &&
                            assert(((_f = (_e = rawType.conditions.times) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 1, "Two times are required for ".concat(constants_1.TIME_COMPARATOR_BETWEEN, " comparator"))) {
                            if (assert(rawType.conditions.times.length == 2, "Only provide two times for ".concat(constants_1.TIME_COMPARATOR_BETWEEN, " comparator"))) {
                                assert(rawType.conditions.times[0] >= 0 && rawType.conditions.times[0] <= constants_1.DAY_LENGTH, "Invalid time 1 '".concat(rawType.conditions.times[0], "'. Time 1 must be between 0 and ").concat(constants_1.DAY_LENGTH, " (inclusive)"));
                                assert(rawType.conditions.times[1] >= 0 && rawType.conditions.times[1] <= constants_1.DAY_LENGTH, "Invalid time 2 '".concat(rawType.conditions.times[1], "'. Time 2 must be between 0 and ").concat(constants_1.DAY_LENGTH, " (inclusive)"));
                            }
                        }
                        break;
                }
            }
        }
        else {
            assert(((_h = (_g = rawType.conditions.times) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0) === 0, 'No times comparator');
        }
    }
    return errors;
}
exports.validateDialogueTreeConditionsTab = validateDialogueTreeConditionsTab;
function validateDialogueTreeDialogueTab(rawType, localization, localizationKeys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    if (assert(rawType.dialogues.length > 0, 'No dialogue')) {
        var dialoguesById = {};
        for (var _i = 0, _b = rawType.dialogues; _i < _b.length; _i++) {
            var dialogue = _b[_i];
            if ((0, null_util_1.isNotNullish)(dialogue.id)) {
                dialoguesById[dialogue.id] = dialogue;
            }
        }
        if (assertNotNullish(rawType.startingDialogueId, 'No starting dialogue')) {
            assert(rawType.startingDialogueId in dialoguesById, "Starting dialogue: No dialogue with key '".concat(rawType.startingDialogueId, "'"));
        }
        validateDialogues(assert, assertNotNullish, rawType.key, rawType.dialogues, dialoguesById, localization, localizationKeys);
    }
    return errors;
}
exports.validateDialogueTreeDialogueTab = validateDialogueTreeDialogueTab;
function validateDialogues(assert, assertNotNullish, dialogueTreeKey, dialogues, dialoguesById, localization, localizationKeys) {
    var _a;
    var dialogueIdsSeen = [];
    for (var i = 0; i < dialogues.length; i++) {
        var dialogue = dialogues[i];
        validateDialogue(assert, assertNotNullish, dialogueTreeKey, dialogue, dialoguesById, localization, localizationKeys, dialogueIdsSeen, "Dialogue '".concat((_a = dialogue.key) !== null && _a !== void 0 ? _a : i, "'"));
        dialogueIdsSeen.push(dialogue.id);
    }
}
exports.validateDialogues = validateDialogues;
function validateDialogue(assert, assertNotNullish, dialogueTreeKey, dialogue, dialoguesById, localization, localizationKeys, dialogueIdsSeen, header) {
    if (assertNotNullish(dialogue.id, "".concat(header, " No id")) && assert(dialogue.id != 0, "".concat(header, " Id must be greater than 0"))) {
        assert(!dialogueIdsSeen.includes(dialogue.id), "".concat(header, " Duplicate id: ").concat(dialogue.id));
    }
    if ((0, null_util_1.isNotNullish)(dialogueTreeKey) && assertNotNullish(dialogue.key, "".concat(header, " No key")) && localization) {
        assert((0, string_util_1.isNotEmpty)((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('dialogue-tree', "dialogue-".concat(dialogue.key.toLowerCase(), "-text"), dialogueTreeKey))), 'No text');
    }
    if (dialogue.responses.length > 0) {
        validateDialogueResponses(assert, assertNotNullish, dialogueTreeKey, dialogue.key, dialogue.responses, dialoguesById, localization, localizationKeys, header);
    }
    if ((0, null_util_1.isNotNullish)(dialogue.nextDialogId)) {
        assert(dialogue.nextDialogId in dialoguesById, "".concat(header, " Invalid next dialogue: ").concat(dialogue.nextDialogId));
    }
    assert(dialogue.responses.length == 0 || (0, null_util_1.isNullish)(dialogue.nextDialogId), "".concat(header, " Cannot have both responses and next dialogue"));
}
exports.validateDialogue = validateDialogue;
function validateDialogueResponses(assert, assertNotNullish, dialogueTreeKey, dialogueKey, responses, dialoguesById, localization, localizationKeys, header) {
    var _a;
    var responseIdsSeen = [];
    for (var i = 0; i < responses.length; i++) {
        var response = responses[i];
        validateDialogueResponse(assert, assertNotNullish, dialogueTreeKey, dialogueKey, response, dialoguesById, localization, localizationKeys, responseIdsSeen, "".concat(header, " Response '").concat((_a = response.key) !== null && _a !== void 0 ? _a : i, "'"));
        responseIdsSeen.push(response.id);
    }
}
exports.validateDialogueResponses = validateDialogueResponses;
function validateDialogueResponse(assert, assertNotNullish, dialogueTreeKey, dialogueKey, response, dialoguesById, localization, localizationKeys, responseIdsSeen, header) {
    if (assertNotNullish(response.id, "".concat(header, " No id")) && assert(response.id != 0, "".concat(header, " Id cannot be 0"))) {
        assert(!responseIdsSeen.includes(response.id), "".concat(header, " Duplicate id: ").concat(response.id));
    }
    if ((0, null_util_1.isNotNullish)(dialogueTreeKey) && (0, null_util_1.isNotNullish)(dialogueKey) && assertNotNullish(response.key, "".concat(header, " No key")) && localization) {
        assert((0, string_util_1.isNotEmpty)((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('dialogue-tree', "dialogue-".concat(dialogueKey.toLowerCase(), "-response-").concat(response.key.toLowerCase(), "-text"), dialogueTreeKey))), 'No text');
    }
    if ((0, null_util_1.isNotNullish)(response.nextDialogId)) {
        assert(response.nextDialogId in dialoguesById, "".concat(header, " Invalid next dialogue: ").concat(response.nextDialogId));
    }
}
exports.validateDialogueResponse = validateDialogueResponse;
/**
 * Event Log
 */
function validateEventLogs(allErrors, rawEventLogs, localization, localizationKeys) {
    var _a, _b;
    var eventLogs = [];
    var eventLogsById = {};
    var eventLogsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawEventLogs)) {
        return { eventLogs: eventLogs, eventLogsById: eventLogsById, eventLogsByKey: eventLogsByKey };
    }
    var evengLogErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawEventLogs_1 = rawEventLogs; _i < rawEventLogs_1.length; _i++) {
        var rawType = rawEventLogs_1[_i];
        var errors = validateEventLog(rawType, localization, localizationKeys, idsSeen);
        if ((0, null_util_1.isNotNullish)(rawType.id) && rawType.id > 0) {
            var type = (0, converters_util_1.toEventLog)(rawType);
            eventLogs.push(type);
            eventLogsById[type.id] = type;
            eventLogsByKey[type.key] = type;
            idsSeen.push(type.id);
        }
        if (errors.length > 0) {
            evengLogErrors[(_b = (_a = rawType.key) !== null && _a !== void 0 ? _a : rawType.id) !== null && _b !== void 0 ? _b : "Event Log ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(evengLogErrors).length > 0) {
        allErrors[constants_1.EVENTS_DATA_FILE] = evengLogErrors;
    }
    return { eventLogs: eventLogs, eventLogsById: eventLogsById, eventLogsByKey: eventLogsByKey };
}
exports.validateEventLogs = validateEventLogs;
function validateEventLog(rawType, localization, localizationKeys, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish;
    if (assertNotNullish(rawType.id, 'No id') && assert(rawType.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawType.id), "Duplicate id: ".concat(rawType.id));
    }
    if (assertNotNullish(rawType.key, 'No key') && localization) {
        assert((0, string_util_1.isNotEmpty)((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('event-log', 'flavor-text', rawType.key))), 'No flavor text');
    }
    return errors;
}
exports.validateEventLog = validateEventLog;
/**
 * World Settings
 */
function validateWorldSettings(allErrors, rawWorldSettings) {
    var worldSettings = (0, converters_util_1.toWorldSettings)((0, converters_util_1.toProcessedRawWorldSettings)(undefined));
    if (!(0, null_util_1.isNotNullish)(rawWorldSettings)) {
        return worldSettings;
    }
    validateWorldSettingsWeatherTab(allErrors, rawWorldSettings.weather);
    return worldSettings;
}
exports.validateWorldSettings = validateWorldSettings;
function validateWorldSettingsWeatherTab(allErrors, weather) {
    var _a;
    var _b;
    var _c = (0, assert_util_1.createAssert)(), errors = _c.errors, assert = _c.assert;
    assert(weather.rainChance > 0, 'Rain chance must be greater than 0');
    assert(weather.rainChance <= 100, 'Rain chance must be less than or equal to 100');
    assert(weather.snowChance > 0, 'Snow chance must be greater than 0');
    assert(weather.snowChance <= 100, 'Snow chance must be less than or equal to 100');
    if (errors.length > 0) {
        allErrors[constants_1.WORLD_DATA_FILE] = __assign(__assign({}, ((_b = allErrors[constants_1.WORLD_DATA_FILE]) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[constants_1.ERROR_SECTION_PLAYER_WORLD_WEATHER] = errors, _a));
    }
}
exports.validateWorldSettingsWeatherTab = validateWorldSettingsWeatherTab;
/**
 * Fishing Zones
 */
function validateFishingZones(allErrors, rawFishingZones, lootTablesByKey) {
    var _a;
    var _b, _c;
    var fishingZones = [];
    var fishingZonesById = {};
    if (!(0, null_util_1.isNotNullish)(rawFishingZones)) {
        return { fishingZones: fishingZones, fishingZonesById: fishingZonesById };
    }
    var fishingZonesErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawFishingZones_1 = rawFishingZones; _i < rawFishingZones_1.length; _i++) {
        var rawFishingZone = rawFishingZones_1[_i];
        var errors = validateFishingZone(rawFishingZone, lootTablesByKey, idsSeen);
        if ((0, null_util_1.isNotNullish)(rawFishingZone.id) && rawFishingZone.id > 0) {
            var fishingZone = (0, converters_util_1.toFishingZone)(rawFishingZone);
            fishingZones.push(fishingZone);
            fishingZonesById[fishingZone.id] = fishingZone;
            idsSeen.push(fishingZone.id);
        }
        if (errors.length > 0) {
            fishingZonesErrors[(_c = (_b = rawFishingZone.key) !== null && _b !== void 0 ? _b : rawFishingZone.id) !== null && _c !== void 0 ? _c : "Fishing Zone ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(fishingZonesErrors).length > 0) {
        allErrors[constants_1.FISHING_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.FISHING_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_FISHING_ZONES] = fishingZonesErrors, _a));
    }
    return { fishingZones: fishingZones, fishingZonesById: fishingZonesById };
}
exports.validateFishingZones = validateFishingZones;
function validateFishingZone(rawFishingZone, lootTablesByKey, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawFishingZone.id, 'No id') && assert(rawFishingZone.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawFishingZone.id), "Duplicate id: ".concat(rawFishingZone.id));
    }
    assertNotEmpty(rawFishingZone.key, 'No key');
    if (assertNotEmpty(rawFishingZone.lootTableKey, 'No loot table key')) {
        assert(rawFishingZone.lootTableKey in lootTablesByKey, "No loot table with key ".concat(rawFishingZone.lootTableKey, " exists"));
    }
    return errors;
}
exports.validateFishingZone = validateFishingZone;
/**
 * Skills
 */
function validateSkills(allErrors, rawSkills, localization, localizationKeys) {
    var _a;
    var _b, _c;
    var skills = [];
    var skillsById = {};
    var skillsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawSkills)) {
        return { skills: skills, skillsById: skillsById, skillsByKey: skillsByKey };
    }
    var skillErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawSkills_1 = rawSkills; _i < rawSkills_1.length; _i++) {
        var rawSkill = rawSkills_1[_i];
        var errors = validateSkill(rawSkill, localization, localizationKeys, idsSeen);
        if ((0, null_util_1.isNotNullish)(rawSkill.key) && (0, null_util_1.isNotNullish)(rawSkill.id) && rawSkill.id > 0) {
            var fishingZone = (0, converters_util_1.toSkill)(rawSkill);
            skills.push(fishingZone);
            skillsById[fishingZone.id] = fishingZone;
            skillsByKey[fishingZone.key] = fishingZone;
            idsSeen.push(fishingZone.id);
        }
        if (errors.length > 0) {
            skillErrors[(_c = (_b = rawSkill.key) !== null && _b !== void 0 ? _b : rawSkill.id) !== null && _c !== void 0 ? _c : "Skill ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(skillErrors).length > 0) {
        allErrors[constants_1.SKILLS_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.SKILLS_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_SKILLS] = skillErrors, _a));
    }
    return { skills: skills, skillsById: skillsById, skillsByKey: skillsByKey };
}
exports.validateSkills = validateSkills;
function validateSkill(rawSkill, localization, localizationKeys, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawSkill.id, 'No id') && assert(rawSkill.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawSkill.id), "Duplicate id: ".concat(rawSkill.id));
    }
    if (assertNotNullish(rawSkill.key, 'No key') && localization) {
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('skill', 'name', rawSkill.key)), 'No name');
    }
    assert(rawSkill.levels.length > 0, 'No levels');
    assert(rawSkill.levels.length <= 5, 'Too many levels. Skills can only have 5 levels');
    for (var i = 0; i < rawSkill.levels.length; i++) {
        assertSkillLevel(assert, assertNotNullish, rawSkill.key, rawSkill.levels[i], localization, localizationKeys, i);
    }
    return errors;
}
exports.validateSkill = validateSkill;
function assertSkillLevel(assert, assertNotNullish, skillKey, skillLevel, localization, localizationKeys, index) {
    var _a;
    var header = (_a = skillLevel.key) !== null && _a !== void 0 ? _a : "Skill Level ".concat(index);
    if ((0, null_util_1.isNotNullish)(skillKey) && assertNotNullish(skillLevel.key, "".concat(header, " No key")) && localization) {
        assert((0, string_util_1.isNotEmpty)((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('skill', "skill-level-".concat(skillLevel.key.toLowerCase(), "-name"), skillKey))), "".concat(header, " No name"));
        assert((0, string_util_1.isNotEmpty)((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('skill', "skill-level-".concat(skillLevel.key.toLowerCase(), "-description"), skillKey))), "".concat(header, " No description"));
    }
    assert(skillLevel.damageIncrease >= 0 && skillLevel.damageIncrease <= 250, "".concat(header, " Damage increase must be between 0 and 250, inclusive"));
    assert(skillLevel.healthRegenIncrease >= 0 && skillLevel.healthRegenIncrease <= 250, "".concat(header, " Health regen increase must be between 0 and 250, inclusive"));
    assert(skillLevel.energyRegenIncrease >= 0 && skillLevel.energyRegenIncrease <= 250, "".concat(header, " Energy regen increase must be between 0 and 250, inclusive"));
    assert(skillLevel.energyUseDescrease >= 0 && skillLevel.energyUseDescrease <= 100, "".concat(header, " Energy regen increase must be between 0 and 100, inclusive"));
    assert(skillLevel.craftingSpeedIncrease >= 0 && skillLevel.craftingSpeedIncrease <= 250, "".concat(header, " Crafting speed increase must be between 0 and 250, inclusive"));
    assert(skillLevel.monsterLootIncrease >= 0 && skillLevel.monsterLootIncrease <= 250, "".concat(header, " Monster loot drop rate increase must be between 0 and 250, inclusive"));
    assert(skillLevel.damageReduction >= 0 && skillLevel.damageReduction <= 100, "".concat(header, " Damage reduction must be between 0 and 100, inclusive"));
    assert(skillLevel.doubleCropChance >= 0 && skillLevel.doubleCropChance <= 100, "".concat(header, " Double crop chance must be between 0 and 100, inclusive"));
    assert(skillLevel.fishSizeChanceIncrease >= 0 && skillLevel.fishSizeChanceIncrease <= 250, "".concat(header, " Fish size chance increase must be between 0 and 250, inclusive"));
    assert(skillLevel.fishBiteSpeedIncrease >= 0 && skillLevel.fishBiteSpeedIncrease <= 250, "".concat(header, " Fish bite speed increase must be between 0 and 250, inclusive"));
    assert(skillLevel.sellPriceIncrease >= 0 && skillLevel.sellPriceIncrease <= 250, "".concat(header, " Sell price increase must be between 0 and 250, inclusive"));
    assert(skillLevel.buyDiscount >= 0 && skillLevel.buyDiscount <= 100, "".concat(header, " Buy discount must be between 0 and 100, inclusive"));
}
exports.assertSkillLevel = assertSkillLevel;
/**
 * Localizations
 */
function validateLocalizationKeys(allErrors, rawLocalizationKeys) {
    var _a;
    var localizationKeys = [];
    var localizationKeysErrors = {};
    if (!(0, null_util_1.isNotNullish)(rawLocalizationKeys)) {
        return { localizationKeys: localizationKeys };
    }
    var i = 1;
    for (var _i = 0, rawLocalizationKeys_1 = rawLocalizationKeys; _i < rawLocalizationKeys_1.length; _i++) {
        var key = rawLocalizationKeys_1[_i];
        var errors = validateLocalizationKey(key, i);
        if ((0, string_util_1.isNotEmpty)(key)) {
            localizationKeys.push(key);
        }
        if (errors.length > 0) {
            localizationKeysErrors["Localization Key ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(localizationKeysErrors).length > 0) {
        allErrors[constants_1.LOCALIZATION_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.LOCALIZATION_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_LOCALIZATION_KEYS] = localizationKeysErrors, _a));
    }
    return { localizationKeys: localizationKeys };
}
exports.validateLocalizationKeys = validateLocalizationKeys;
function validateLocalizationKey(key, index) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assertNotEmpty = _a.assertNotEmpty;
    assertNotEmpty(key, "Key ".concat(index, " cannot be empty"));
    return errors;
}
exports.validateLocalizationKey = validateLocalizationKey;
function validateLocalizations(allErrors, rawLocalizations, keys) {
    var _a;
    var _b, _c;
    var localizations = [];
    var localizationsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawLocalizations)) {
        return { localizations: localizations, localizationsByKey: localizationsByKey };
    }
    var localizationsErrors = {};
    var i = 1;
    for (var _i = 0, rawLocalizations_1 = rawLocalizations; _i < rawLocalizations_1.length; _i++) {
        var rawLocalization = rawLocalizations_1[_i];
        var errors = validateLocalization(rawLocalization, keys);
        if ((0, string_util_1.isNotEmpty)(rawLocalization.key)) {
            var localization = (0, converters_util_1.toLocalization)(rawLocalization);
            localizations.push(localization);
            localizationsByKey[localization.key] = localization;
        }
        if (errors.length > 0) {
            localizationsErrors[(_c = (_b = rawLocalization.key) !== null && _b !== void 0 ? _b : rawLocalization.name) !== null && _c !== void 0 ? _c : "Localization ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(localizationsErrors).length > 0) {
        allErrors[constants_1.LOCALIZATION_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.LOCALIZATION_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_LOCALIZATIONS] = localizationsErrors, _a));
    }
    return { localizations: localizations, localizationsByKey: localizationsByKey };
}
exports.validateLocalizations = validateLocalizations;
function validateLocalization(localization, keys) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotEmpty = _a.assertNotEmpty;
    assertNotEmpty(localization.key, 'No key');
    assertNotEmpty(localization.name, 'No name');
    keys.forEach(function (key) {
        if (assert(key in localization.values, "No value for key '".concat(key, "'"))) {
            assertNotEmpty(localization.values[key], "Value for key '".concat(key, "' is empty"));
        }
    });
    return errors;
}
exports.validateLocalization = validateLocalization;
/**
 * Quests
 */
function validateQuests(allErrors, rawQuests, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys) {
    var _a;
    var _b;
    var quests = [];
    var questsById = {};
    var questsByKey = {};
    if (!(0, null_util_1.isNotNullish)(rawQuests)) {
        return { quests: quests, questsById: questsById, questsByKey: questsByKey };
    }
    var questsErrors = {};
    var i = 1;
    var idsSeen = [];
    for (var _i = 0, rawQuests_1 = rawQuests; _i < rawQuests_1.length; _i++) {
        var rawQuest = rawQuests_1[_i];
        var errors = validateQuest(rawQuest, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys, idsSeen);
        if ((0, string_util_1.isNotEmpty)(rawQuest.key)) {
            var quest = (0, converters_util_1.toQuest)(rawQuest);
            quests.push(quest);
            idsSeen.push(quest.id);
            questsById[quest.id] = quest;
            questsByKey[quest.key] = quest;
        }
        if (errors.length > 0) {
            questsErrors[(_b = rawQuest.key) !== null && _b !== void 0 ? _b : "Quest ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(questsErrors).length > 0) {
        allErrors[constants_1.QUESTS_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.QUESTS_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_QUESTS] = questsErrors, _a));
    }
    return { quests: quests, questsById: questsById, questsByKey: questsByKey };
}
exports.validateQuests = validateQuests;
function validateQuest(quest, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys, idsSeen) {
    return __spreadArray(__spreadArray(__spreadArray([], validateQuestGeneralTab(quest, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys, idsSeen), true), validateQuestTasksTab(quest, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey), true), validateQuestRewardsTab(quest, itemsByKey), true);
}
exports.validateQuest = validateQuest;
function validateQuestGeneralTab(quest, creaturesByKey, dialogueTreesByKey, eventLogsByKey, localization, localizationKeys, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(quest.id, 'No id')) {
        assert(quest.id > 0 && quest.id % 1 === 0, 'Id must be a positive whole number greater than 0');
        assert(!idsSeen.includes(quest.id), "Duplicate id: ".concat(quest.id));
    }
    if (assertNotNullish(quest.key, 'No key') && localization) {
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('quest', 'name', quest.key)), 'No name');
        assertNotEmpty((0, localization_util_1.getLocalizedValue)(localization, localizationKeys, (0, localization_util_1.getLocalizationKey)('quest', 'text', quest.key)), 'No text');
    }
    quest.prerequisiteEventKeys.forEach(function (eventKey) {
        assert(eventKey in eventLogsByKey, "No event log with key ".concat(eventKey, " exists"));
    });
    if ((0, string_util_1.isNotEmpty)(quest.source)) {
        assert(constants_1.QUEST_SOURCES.includes(quest.source), "Invalid source '".concat(quest.source, "'"));
        switch (quest.source) {
            case constants_1.QUEST_SOURCE_CREATURE:
                if (assertNotEmpty(quest.sourceCreatureTypeKey, 'Source: No creature type key')) {
                    assert(quest.sourceCreatureTypeKey in creaturesByKey, "Source: No creature with key ".concat(quest.sourceCreatureTypeKey, " exists"));
                }
                if ((0, string_util_1.isNotEmpty)(quest.sourceCreatureDialogueTreeKey)) {
                    assert(quest.sourceCreatureDialogueTreeKey in dialogueTreesByKey, "Source: No dialogue tree with key ".concat(quest.sourceCreatureDialogueTreeKey, " exists"));
                    if (quest.sourceCreatureDialogueTreeKey in dialogueTreesByKey) {
                        var dialogueTree = dialogueTreesByKey[quest.sourceCreatureDialogueTreeKey];
                        assert(dialogueTree.creatureKey === quest.sourceCreatureTypeKey, 'Source: Creature type key and dialogue tree creature key do not match');
                    }
                }
                break;
            default:
                break;
        }
    }
    if (assertNotEmpty(quest.completionTrigger, 'No completion trigger')) {
        assert(constants_1.QUEST_COMPLETION_TRIGGERS.includes(quest.completionTrigger), "Invalid completion trigger '".concat(quest.completionTrigger, "'"));
        switch (quest.completionTrigger) {
            case constants_1.QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
                if (assertNotEmpty(quest.completionCreatureTypeKey, 'Completion Trigger: No creature type key')) {
                    assert(quest.completionCreatureTypeKey in creaturesByKey, "Completion Trigger: No creature with key ".concat(quest.completionCreatureTypeKey, " exists"));
                }
                if ((0, string_util_1.isNotEmpty)(quest.completionCreatureDialogueTreeKey)) {
                    assert(quest.completionCreatureDialogueTreeKey in dialogueTreesByKey, "Completion Trigger: No dialogue tree with key ".concat(quest.completionCreatureDialogueTreeKey, " exists"));
                    if (quest.completionCreatureDialogueTreeKey in dialogueTreesByKey) {
                        var dialogueTree = dialogueTreesByKey[quest.completionCreatureDialogueTreeKey];
                        assert(dialogueTree.creatureKey === quest.completionCreatureTypeKey, 'Completion Trigger: Creature type key and dialogue tree creature key do not match');
                    }
                }
                break;
            default:
                break;
        }
    }
    return errors;
}
exports.validateQuestGeneralTab = validateQuestGeneralTab;
function validateQuestTasksTab(quest, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    assert(quest.tasks.length > 0, 'There must be at least one task');
    var taskIdsSeen = [];
    quest.tasks.forEach(function (task, index) {
        assertQuestTask(assert, assertNotNullish, assertNotEmpty, task, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, taskIdsSeen, "Task ".concat(index + 1));
        if ((0, null_util_1.isNotNullish)(task.id)) {
            taskIdsSeen.push(task.id);
        }
    });
    return errors;
}
exports.validateQuestTasksTab = validateQuestTasksTab;
function assertQuestTask(assert, assertNotNullish, assertNotEmpty, task, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, idsSeen, header) {
    if (assertNotNullish(task.id, "".concat(header, ": No id"))) {
        assert(task.id > 0 && task.id % 1 === 0, "".concat(header, ": Id must be a positive whole number greater than 0"));
        assert(!idsSeen.includes(task.id), "".concat(header, ": Duplicate id: ").concat(task.id));
    }
    assertNotEmpty(task.key, "".concat(header, ": No key"));
    assert(task.objectives.length > 0, "".concat(header, ": There must be at least one objective"));
    assert(task.objectives.length <= 5, "".concat(header, ": There can only be a max of five objectives per task"));
    task.objectives.forEach(function (objective, index) {
        assertQuestObjective(assert, assertNotNullish, assertNotEmpty, objective, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, "".concat(header, " / Objective ").concat(index + 1));
    });
}
exports.assertQuestTask = assertQuestTask;
function assertQuestObjective(assert, assertNotNullish, assertNotEmpty, objective, itemsByKey, craftingRecipesByKey, creaturesByKey, dialogueTreesByKey, header) {
    if (assertNotEmpty(objective.objectiveType, "".concat(header, ": No objective type"))) {
        assert(constants_1.QUEST_OBJECTIVE_TYPES.includes(objective.objectiveType), "".concat(header, ": Invalid objective type '").concat(objective.objectiveType, "'"));
        switch (objective.objectiveType) {
            case constants_1.QUEST_OBJECTIVE_TYPE_GATHER:
                if (assertNotEmpty(objective.itemTypeKey, "".concat(header, ": No item type key"))) {
                    assert(objective.itemTypeKey in itemsByKey, "".concat(header, ": No item with key ").concat(objective.itemTypeKey, " exists"));
                }
                if (assertNotNullish(objective.itemAmount, "".concat(header, ": No item amount"))) {
                    assert(objective.itemAmount > 0 && objective.itemAmount % 1 == 0, "".concat(header, ": Item amount must be a positive whole number greater than 0"));
                }
                break;
            case constants_1.QUEST_OBJECTIVE_TYPE_CRAFT:
                if (assertNotEmpty(objective.craftingRecipeKey, "".concat(header, ": No crafting recipe key"))) {
                    assert(objective.craftingRecipeKey in craftingRecipesByKey, "".concat(header, ": No crafting recipe with key ").concat(objective.craftingRecipeKey, " exists"));
                }
                if (assertNotNullish(objective.craftingAmount, "".concat(header, ": No crafting amount"))) {
                    assert(objective.craftingAmount > 0 && objective.craftingAmount % 1 == 0, "".concat(header, ": Crafting amount must be a positive whole number greater than 0"));
                }
                break;
            case constants_1.QUEST_OBJECTIVE_TYPE_DESTINATION:
                if (assertNotNullish(objective.destinationPosition, "".concat(header, ": No destination position"))) {
                    assertNotNullish(objective.destinationPosition.x, "".concat(header, ": No destination position x coordinate"));
                    assertNotNullish(objective.destinationPosition.y, "".concat(header, ": No destination position y coordinate"));
                }
                break;
            case constants_1.QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
                if (assertNotEmpty(objective.creatureTypeKey, "".concat(header, ": No creature type key"))) {
                    assert(objective.creatureTypeKey in creaturesByKey, "".concat(header, ": No creature with key ").concat(objective.creatureTypeKey, " exists"));
                }
                if ((0, string_util_1.isNotEmpty)(objective.creatureDialogueTreeKey)) {
                    if (assert(objective.creatureDialogueTreeKey in dialogueTreesByKey, "".concat(header, ": No dialogue tree with key ").concat(objective.creatureDialogueTreeKey, " exists"))) {
                        var dialogueTree = dialogueTreesByKey[objective.creatureDialogueTreeKey];
                        assert(dialogueTree.creatureKey === objective.creatureTypeKey, "".concat(header, ": Creature type key and dialogue tree creature key do not match"));
                    }
                }
                break;
            default:
                break;
        }
    }
}
exports.assertQuestObjective = assertQuestObjective;
function validateQuestRewardsTab(quest, itemsByKey) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert;
    assert(quest.experienceReward > 0, 'No experience reward');
    if ((0, null_util_1.isNotNullish)(quest.itemRewards)) {
        Object.keys(quest.itemRewards).forEach(function (itemTypeKey, index) {
            var header = "Item Reward ".concat(index + 1);
            if ((0, string_util_1.isNotEmpty)(itemTypeKey)) {
                assert(itemTypeKey in itemsByKey, "".concat(header, ": No item with key ").concat(itemTypeKey, " exists"));
            }
            var itemAmount = quest.itemRewards[itemTypeKey];
            assert(itemAmount > 0 && itemAmount % 1 == 0, "".concat(header, ": Amount must be a positive whole number greater than 0"));
        });
    }
    return errors;
}
exports.validateQuestRewardsTab = validateQuestRewardsTab;
/**
 * World Zones
 */
function validateWorldZones(allErrors, rawWorldZones, creaturesByKey) {
    var _a;
    var _b, _c;
    var worldZones = [];
    var worldZonesById = {};
    if (!(0, null_util_1.isNotNullish)(rawWorldZones)) {
        return { worldZones: worldZones, worldZonesById: worldZonesById };
    }
    var worldZonesErrors = {};
    var idsSeen = [];
    var i = 1;
    for (var _i = 0, rawWorldZones_1 = rawWorldZones; _i < rawWorldZones_1.length; _i++) {
        var rawWorldZone = rawWorldZones_1[_i];
        var errors = validateWorldZone(rawWorldZone, creaturesByKey, idsSeen);
        if ((0, null_util_1.isNotNullish)(rawWorldZone.id) && rawWorldZone.id > 0) {
            var worldZone = (0, converters_util_1.toWorldZone)(rawWorldZone);
            worldZones.push(worldZone);
            worldZonesById[worldZone.id] = worldZone;
            idsSeen.push(worldZone.id);
        }
        if (errors.length > 0) {
            worldZonesErrors[(_c = (_b = rawWorldZone.key) !== null && _b !== void 0 ? _b : rawWorldZone.id) !== null && _c !== void 0 ? _c : "World Zone ".concat(i)] = errors;
        }
        i++;
    }
    if (Object.keys(worldZonesErrors).length > 0) {
        allErrors[constants_1.WORLD_ZONES_DATA_FILE] = __assign(__assign({}, allErrors[constants_1.WORLD_ZONES_DATA_FILE]), (_a = {}, _a[constants_1.ERROR_SECTION_WORLD_ZONES] = worldZonesErrors, _a));
    }
    return { worldZones: worldZones, worldZonesById: worldZonesById };
}
exports.validateWorldZones = validateWorldZones;
function validateWorldZone(rawWorldZone, creaturesByKey, idsSeen) {
    var _a = (0, assert_util_1.createAssert)(), errors = _a.errors, assert = _a.assert, assertNotNullish = _a.assertNotNullish, assertNotEmpty = _a.assertNotEmpty;
    if (assertNotNullish(rawWorldZone.id, 'No id') && assert(rawWorldZone.id != 0, 'Id cannot be 0')) {
        assert(!idsSeen.includes(rawWorldZone.id), "Duplicate id: ".concat(rawWorldZone.id));
    }
    assertNotEmpty(rawWorldZone.key, 'No key');
    rawWorldZone.spawns.forEach(function (spawn, index) {
        return assertWorldZoneSpawn(assert, assertNotNullish, spawn, creaturesByKey, "World zone spawn ".concat(index));
    });
    return errors;
}
exports.validateWorldZone = validateWorldZone;
function assertWorldZoneSpawn(assert, assertNotNullish, worldZoneSpawn, creatureTypesByKey, header) {
    if (assertNotNullish(worldZoneSpawn.creatureKey, "".concat(header, ": No creature key"))) {
        assert(worldZoneSpawn.creatureKey in creatureTypesByKey, "No creature with key ".concat(worldZoneSpawn.creatureKey, " exists"));
    }
    assert(worldZoneSpawn.probability > 0, "".concat(header, ": Probability must be greater than 0"));
    assert(worldZoneSpawn.probability <= 100, "".concat(header, ": Probability must be less than or equal to 100"));
    assert(worldZoneSpawn.limit > 0, "".concat(header, ": Limit must be greater than 0"));
    assert(worldZoneSpawn.limit <= 250, "".concat(header, ": Limit must be less than or equal to 250"));
    assert(worldZoneSpawn.limit % 1 === 0, 'Limit be a whole number');
}
exports.assertWorldZoneSpawn = assertWorldZoneSpawn;
