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
exports.toObjectSpriteRule = exports.toProcessedRawObjectSpriteRule = exports.toObjectSpriteRules = exports.toProcessedRawObjectSpriteRules = exports.toSpriteColliders = exports.toProcessedRawSpriteColliders = exports.toCategorySprite = exports.toProcessedRawCategorySprite = exports.toColliders = exports.toProcessedRawColliders = exports.toObjectCollider = exports.toProcessedRawObjectCollider = exports.toSprite = exports.toSprites = exports.toProcessedRawSprite = exports.toProcessedRawSprites = exports.createObjectSprite = exports.toObjectSprites = exports.toProcessedRawObjectSprites = exports.createObjectSprites = exports.toProcessedRawObjectType = exports.toObjectType = exports.toProcessedRawObjectSubCategory = exports.toObjectSubCategory = exports.toProcessedRawObjectCategory = exports.toObjectCategory = exports.toProcessedRawCraftingRecipe = exports.toCraftingRecipe = exports.toProcessedRawCraftingRecipeCategory = exports.toCraftingRecipeCategory = exports.toProcessedRawLootTable = exports.toLootTable = exports.toProcessedRawItemType = exports.toItemType = exports.toProcessedRawItemCategory = exports.toItemCategory = exports.createCreatureSprites = exports.toCreatureSprites = exports.toProcessedRawCreatureSprites = exports.toCreatureShop = exports.createCreatureShop = exports.toProcessedRawCreatureShop = exports.toCampSpawn = exports.toProcessedRawCampSpawn = exports.createCampSpawn = exports.toProcessedRawCreatureType = exports.toCreatureType = exports.toProcessedRawCreatureCategory = exports.toCreatureCategory = exports.toDataObject = void 0;
exports.toPlacementLayer = exports.toPlacementPosition = exports.toStagesType = exports.toLootType = exports.createVector2 = exports.toProcessedRawQuestObjective = exports.toQuestObjective = exports.createQuestObjective = exports.toProcessedRawQuestTask = exports.toQuestTask = exports.createQuestTask = exports.toProcessedRawQuest = exports.toQuest = exports.toProcessedRawLocalization = exports.toLocalization = exports.toProcessedRawLocalizationFile = exports.toLocalizationFile = exports.toProcessedRawSkillLevel = exports.toSkillLevel = exports.toProcessedRawSkill = exports.toSkill = exports.toProcessedRawFishingZone = exports.toFishingZone = exports.toProcessedRawWorldZoneSpawn = exports.toWorldZoneSpawn = exports.toProcessedRawWorldZone = exports.toWorldZone = exports.toProcessedRawWeatherSettings = exports.toWeatherSettings = exports.toProcessedRawWorldSettings = exports.toWorldSettings = exports.toProcessedRawEventLog = exports.toEventLog = exports.toProcessedRawPlayerData = exports.toPlayerData = exports.toProcessedRawDialogueResponse = exports.toDialogueResponse = exports.toProcessedRawDialogue = exports.toDialogue = exports.toProcessedRawDialogueConditions = exports.toDialogueConditions = exports.toProcessedRawDialogueTree = exports.toDialogueTree = exports.toLootTableComponent = exports.toProcessedRawLootTableComponent = exports.toLootTableComponentGroup = exports.toProcessedRawLootTableComponentGroup = exports.createObjectTypeStage = exports.toProcessedRawObjectTypeStage = exports.toObjectTypeStage = void 0;
exports.mapTypedKeyRecord = exports.toTypedKeyRecord = exports.toTypedArray = exports.fromNullishRecord = exports.fromNullishArray = exports.fromNullish = exports.toFishingPoleAnchorPoints = exports.toVector2 = exports.toAttackType = exports.toMovementType = exports.toCreatureSettings = exports.toProcessedRawCreatureSettings = exports.toItemSettings = exports.toProcessedRawItemSettings = exports.toObjectSettings = exports.toProcessedRawObjectSettings = exports.toGroundType = exports.toQuestSource = exports.toQuestCompletionTrigger = exports.toQuestObjectiveType = exports.toSeason = exports.toFishingItemType = exports.toWeaponType = exports.toTimeComparator = exports.toFilledFromType = exports.toInventoryType = exports.toSpawningCondition = exports.toStageJumpCondition = exports.toObjectSpriteRulePosition = exports.toColliderType = void 0;
var constants_1 = require("../constants");
var null_util_1 = require("./null.util");
function toDataObject(section, fileSection, raw) {
    switch (section) {
        case 'creature':
            return toCreatureType(raw);
        case 'creature-category':
            return toCreatureCategory(raw);
        case 'object-category':
            return toObjectCategory(raw);
        case 'object-sub-category':
            return toObjectSubCategory(raw);
        case 'item':
            return toItemType(raw);
        case 'item-category':
            return toItemCategory(raw);
        case 'loot-table':
            return toLootTable(raw);
        case 'crafting-recipe':
            return toCraftingRecipe(raw);
        case 'crafting-recipe-category':
            return toCraftingRecipeCategory(raw);
        case 'dialogue-tree':
            return toDialogueTree(raw);
        case 'player-data':
            return toPlayerData(raw);
        case 'event-log':
            return toEventLog(raw);
        case 'world-settings':
            return toWorldSettings(raw);
        case 'fishing-zone':
            return toFishingZone(raw);
        case 'skill':
            return toSkill(raw);
        case 'localization-key':
            return raw;
        case 'localization':
            return toLocalization(raw);
        case 'quest':
            return toQuest(raw);
        case 'world-zone':
            return toWorldZone(raw);
        default:
            return toObjectType(raw);
    }
}
exports.toDataObject = toDataObject;
function toCreatureCategory(processedRawCategory, index) {
    var _a;
    return __assign(__assign({}, processedRawCategory), { key: (_a = processedRawCategory.key) !== null && _a !== void 0 ? _a : (index ? "CREATURE_CATEGORY_".concat(index) : 'UNKNOWN_CREATURE_CATEGORY'), settings: toCreatureSettings(processedRawCategory === null || processedRawCategory === void 0 ? void 0 : processedRawCategory.settings) });
}
exports.toCreatureCategory = toCreatureCategory;
function toProcessedRawCreatureCategory(rawCreatureCategory) {
    return __assign(__assign({}, rawCreatureCategory), { key: fromNullish(rawCreatureCategory === null || rawCreatureCategory === void 0 ? void 0 : rawCreatureCategory.key), settings: toProcessedRawCreatureSettings(rawCreatureCategory === null || rawCreatureCategory === void 0 ? void 0 : rawCreatureCategory.settings) });
}
exports.toProcessedRawCreatureCategory = toProcessedRawCreatureCategory;
function toCreatureType(processedRawCreature, index) {
    var _a;
    return __assign(__assign({}, processedRawCreature), { key: (_a = processedRawCreature.key) !== null && _a !== void 0 ? _a : (index ? "CREATURE_".concat(index) : 'UNKNOWN_CREATURE'), colliders: (0, null_util_1.isNullish)(processedRawCreature.colliders) ? undefined : toColliders(processedRawCreature.colliders), sprite: toCreatureSprites(processedRawCreature.sprite), settings: toCreatureSettings(processedRawCreature === null || processedRawCreature === void 0 ? void 0 : processedRawCreature.settings), shop: toCreatureShop(processedRawCreature === null || processedRawCreature === void 0 ? void 0 : processedRawCreature.shop), campSpawns: processedRawCreature === null || processedRawCreature === void 0 ? void 0 : processedRawCreature.campSpawns.map(toCampSpawn) });
}
exports.toCreatureType = toCreatureType;
function toProcessedRawCreatureType(rawCreatureType) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    return __assign(__assign({}, rawCreatureType), { id: (_a = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.key), categoryKey: fromNullish(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.categoryKey), colliders: (0, null_util_1.isNullish)(rawCreatureType) || (0, null_util_1.isNullish)(rawCreatureType.colliders) ? undefined : toProcessedRawColliders(rawCreatureType.colliders), sprite: toProcessedRawCreatureSprites(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.sprite), settings: toProcessedRawCreatureSettings(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.settings), shop: toProcessedRawCreatureShop(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.shop), health: (_b = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.health) !== null && _b !== void 0 ? _b : 0, lootTableKey: fromNullish(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.lootTableKey), experience: (_c = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.experience) !== null && _c !== void 0 ? _c : 0, walkSpeed: (_d = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.walkSpeed) !== null && _d !== void 0 ? _d : 0, runSpeed: (_e = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.runSpeed) !== null && _e !== void 0 ? _e : 0, jumpMinWaitTime: (_f = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMinWaitTime) !== null && _f !== void 0 ? _f : 0, jumpMaxWaitTime: (_g = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMaxWaitTime) !== null && _g !== void 0 ? _g : 0, jumpMoveStartSpriteIndex: (_h = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMoveStartSpriteIndex) !== null && _h !== void 0 ? _h : 0, jumpMoveEndSpriteIndex: (_j = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMoveEndSpriteIndex) !== null && _j !== void 0 ? _j : 0, jumpMinDistance: (_k = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMinDistance) !== null && _k !== void 0 ? _k : 0, jumpMaxDistance: (_l = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.jumpMaxDistance) !== null && _l !== void 0 ? _l : 0, wanderBehaviorEnabled: (_m = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderBehaviorEnabled) !== null && _m !== void 0 ? _m : false, wanderTime: (_o = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderTime) !== null && _o !== void 0 ? _o : 0, wanderRadius: (_p = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderRadius) !== null && _p !== void 0 ? _p : 0, wanderUseCustomAnchor: (_q = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderUseCustomAnchor) !== null && _q !== void 0 ? _q : false, wanderUseSpawnAnchor: (_r = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderUseSpawnAnchor) !== null && _r !== void 0 ? _r : false, wanderAnchor: toVector2(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderAnchor, { x: 0, y: 0 }), wanderUseHardLeash: (_s = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderUseHardLeash) !== null && _s !== void 0 ? _s : false, wanderHardLeashRange: (_t = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.wanderHardLeashRange) !== null && _t !== void 0 ? _t : 0, dangerBehaviorEnabled: (_u = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerBehaviorEnabled) !== null && _u !== void 0 ? _u : false, dangerRadius: (_v = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerRadius) !== null && _v !== void 0 ? _v : 0, dangerTolerance: (_w = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerTolerance) !== null && _w !== void 0 ? _w : 0, dangerFromPlayers: (_x = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerFromPlayers) !== null && _x !== void 0 ? _x : false, dangerCreatureCategoryKeys: (_y = fromNullishArray(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerCreatureCategoryKeys, function (value) { return value !== null && value !== void 0 ? value : ''; })) !== null && _y !== void 0 ? _y : [], dangerCreatureKeys: (_z = fromNullishArray(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.dangerCreatureKeys, function (value) { return value !== null && value !== void 0 ? value : ''; })) !== null && _z !== void 0 ? _z : [], attackBehaviorEnabled: (_0 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackBehaviorEnabled) !== null && _0 !== void 0 ? _0 : false, attackRadius: (_1 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackRadius) !== null && _1 !== void 0 ? _1 : 0, attackDesiredRangeMin: (_2 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackDesiredRangeMin) !== null && _2 !== void 0 ? _2 : 0, attackDesiredRangeMax: (_3 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackDesiredRangeMax) !== null && _3 !== void 0 ? _3 : 0, attackTargetPlayers: (_4 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackTargetPlayers) !== null && _4 !== void 0 ? _4 : false, attackTargetCreatureCategoryKeys: (_5 = fromNullishArray(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackTargetCreatureCategoryKeys, function (value) { return value !== null && value !== void 0 ? value : ''; })) !== null && _5 !== void 0 ? _5 : [], attackTargetCreatureKeys: (_6 = fromNullishArray(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackTargetCreatureKeys, function (value) { return value !== null && value !== void 0 ? value : ''; })) !== null && _6 !== void 0 ? _6 : [], attackUseStrafing: (_7 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackUseStrafing) !== null && _7 !== void 0 ? _7 : false, attackStrafingTimeMin: (_8 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackStrafingTimeMin) !== null && _8 !== void 0 ? _8 : 0, attackStrafingTimeMax: (_9 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackStrafingTimeMax) !== null && _9 !== void 0 ? _9 : 0, attackDamage: (_10 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackDamage) !== null && _10 !== void 0 ? _10 : 0, attackKnockbackModifier: (_11 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.attackKnockbackModifier) !== null && _11 !== void 0 ? _11 : 0, randomSpawnsEnabled: (_12 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.randomSpawnsEnabled) !== null && _12 !== void 0 ? _12 : false, spawnDistanceMinFromPlayers: (_13 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.spawnDistanceMinFromPlayers) !== null && _13 !== void 0 ? _13 : 0, spawnDistanceMaxFromPlayers: (_14 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.spawnDistanceMaxFromPlayers) !== null && _14 !== void 0 ? _14 : 0, despawnDistanceFromPlayers: (_15 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.despawnDistanceFromPlayers) !== null && _15 !== void 0 ? _15 : 0, spawnDeadZoneRadius: (_16 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.spawnDeadZoneRadius) !== null && _16 !== void 0 ? _16 : 0, maxPopulation: (_17 = rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.maxPopulation) !== null && _17 !== void 0 ? _17 : 0, campSpawns: (_18 = fromNullishArray(rawCreatureType === null || rawCreatureType === void 0 ? void 0 : rawCreatureType.campSpawns, toProcessedRawCampSpawn)) !== null && _18 !== void 0 ? _18 : [] });
}
exports.toProcessedRawCreatureType = toProcessedRawCreatureType;
function createCampSpawn() {
    return {
        position: { x: 0, y: 0 },
        maxPopulation: 0
    };
}
exports.createCampSpawn = createCampSpawn;
function toProcessedRawCampSpawn(rawCampSpawn) {
    var _a;
    return __assign(__assign({}, rawCampSpawn), { position: toVector2(rawCampSpawn === null || rawCampSpawn === void 0 ? void 0 : rawCampSpawn.position, { x: 0, y: 0 }), maxPopulation: (_a = rawCampSpawn === null || rawCampSpawn === void 0 ? void 0 : rawCampSpawn.maxPopulation) !== null && _a !== void 0 ? _a : 0 });
}
exports.toProcessedRawCampSpawn = toProcessedRawCampSpawn;
function toCampSpawn(processedRawCampSpawn) {
    return __assign({}, processedRawCampSpawn);
}
exports.toCampSpawn = toCampSpawn;
function toProcessedRawCreatureShop(rawCreatureShop) {
    if ((0, null_util_1.isNullish)(rawCreatureShop)) {
        return undefined;
    }
    return __assign(__assign({}, rawCreatureShop), { openingEvent: fromNullish(rawCreatureShop.openingEvent), prices: fromNullishRecord(rawCreatureShop === null || rawCreatureShop === void 0 ? void 0 : rawCreatureShop.prices, function (seasonPrices) { return fromNullishRecord(seasonPrices, function (price) { return price !== null && price !== void 0 ? price : 0; }) || {}; }) || {}, openTimes: fromNullishArray(rawCreatureShop === null || rawCreatureShop === void 0 ? void 0 : rawCreatureShop.openTimes, function (time) { return time !== null && time !== void 0 ? time : -1; }) || Array(constants_1.DAYS_IN_A_WEEK), closeTimes: fromNullishArray(rawCreatureShop === null || rawCreatureShop === void 0 ? void 0 : rawCreatureShop.closeTimes, function (time) { return time !== null && time !== void 0 ? time : -1; }) || Array(constants_1.DAYS_IN_A_WEEK) });
}
exports.toProcessedRawCreatureShop = toProcessedRawCreatureShop;
function createCreatureShop() {
    return {
        prices: {},
        openTimes: Array(constants_1.DAYS_IN_A_WEEK),
        closeTimes: Array(constants_1.DAYS_IN_A_WEEK)
    };
}
exports.createCreatureShop = createCreatureShop;
function toCreatureShop(processedRawCreatureShop) {
    if ((0, null_util_1.isNullish)(processedRawCreatureShop)) {
        return undefined;
    }
    return __assign({}, processedRawCreatureShop);
}
exports.toCreatureShop = toCreatureShop;
function toProcessedRawCreatureSprites(creatureSprites) {
    var _a, _b, _c, _d, _e;
    return __assign(__assign({}, creatureSprites), { width: (_a = creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.width) !== null && _a !== void 0 ? _a : 0, height: (_b = creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.height) !== null && _b !== void 0 ? _b : 0, pivotOffset: (0, null_util_1.isNullish)(creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.pivotOffset)
            ? undefined
            : {
                x: (_c = creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.pivotOffset.x) !== null && _c !== void 0 ? _c : 0,
                y: (_e = (_d = creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.pivotOffset) === null || _d === void 0 ? void 0 : _d.y) !== null && _e !== void 0 ? _e : 0
            }, sprites: toProcessedRawSprites(creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.sprites), idleSprites: toProcessedRawSprites(creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.idleSprites), deathSprites: toProcessedRawSprites(creatureSprites === null || creatureSprites === void 0 ? void 0 : creatureSprites.deathSprites) });
}
exports.toProcessedRawCreatureSprites = toProcessedRawCreatureSprites;
function toCreatureSprites(objectSprites) {
    return __assign(__assign({}, objectSprites), { sprites: toSprites(objectSprites.sprites), idleSprites: toSprites(objectSprites.idleSprites), deathSprites: toSprites(objectSprites.deathSprites) });
}
exports.toCreatureSprites = toCreatureSprites;
function createCreatureSprites() {
    return {
        width: 0,
        height: 0
    };
}
exports.createCreatureSprites = createCreatureSprites;
function toItemCategory(processedRawCategory, index) {
    var _a;
    return __assign(__assign({}, processedRawCategory), { key: (_a = processedRawCategory.key) !== null && _a !== void 0 ? _a : (index ? "ITEM_CATEGORY_".concat(index) : 'UNKNOWN_ITEM_CATEGORY'), settings: toItemSettings(processedRawCategory === null || processedRawCategory === void 0 ? void 0 : processedRawCategory.settings) });
}
exports.toItemCategory = toItemCategory;
function toProcessedRawItemCategory(rawItemCategory) {
    return __assign(__assign({}, rawItemCategory), { key: fromNullish(rawItemCategory === null || rawItemCategory === void 0 ? void 0 : rawItemCategory.key), settings: toProcessedRawItemSettings(rawItemCategory === null || rawItemCategory === void 0 ? void 0 : rawItemCategory.settings) });
}
exports.toProcessedRawItemCategory = toProcessedRawItemCategory;
function toItemType(processedRawItem, index) {
    var _a;
    return __assign(__assign({}, processedRawItem), { key: (_a = processedRawItem.key) !== null && _a !== void 0 ? _a : (index ? "ITEM_".concat(index) : 'UNKNOWN_ITEM'), settings: toItemSettings(processedRawItem === null || processedRawItem === void 0 ? void 0 : processedRawItem.settings) });
}
exports.toItemType = toItemType;
function toProcessedRawItemType(rawItemType) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __assign(__assign({}, rawItemType), { id: (_a = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.key), categoryKey: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.categoryKey), objectTypeKey: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.objectTypeKey), maxStackSize: (_b = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.maxStackSize) !== null && _b !== void 0 ? _b : 0, creatureDamage: (_c = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.creatureDamage) !== null && _c !== void 0 ? _c : 0, objectDamage: (_d = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.objectDamage) !== null && _d !== void 0 ? _d : 0, launcherDamage: (_e = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.launcherDamage) !== null && _e !== void 0 ? _e : 0, damageArcRadius: (_f = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.damageArcRadius) !== null && _f !== void 0 ? _f : 0, settings: toProcessedRawItemSettings(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.settings), durability: (_g = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.durability) !== null && _g !== void 0 ? _g : 0, hungerIncrease: (_h = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.hungerIncrease) !== null && _h !== void 0 ? _h : 0, thirstIncrease: (_j = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.thirstIncrease) !== null && _j !== void 0 ? _j : 0, energyIncrease: (_k = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.energyIncrease) !== null && _k !== void 0 ? _k : 0, edibleLeftoverItemTypeKey: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.edibleLeftoverItemTypeKey), filledLevel: (_l = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.filledLevel) !== null && _l !== void 0 ? _l : 0, filledItemTypeKey: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.filledItemTypeKey), sellPrice: (_m = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.sellPrice) !== null && _m !== void 0 ? _m : 0, lightLevel: fromNullish(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.lightLevel), lightPosition: toVector2(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.lightPosition), animationSampleRate: (_o = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.animationSampleRate) !== null && _o !== void 0 ? _o : constants_1.PLAYER_ANIMATION_SAMPLE_RATE, projectileSpeed: (_p = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.projectileSpeed) !== null && _p !== void 0 ? _p : 0, projectileDistance: (_q = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.projectileDistance) !== null && _q !== void 0 ? _q : 0, fishingPoleAnchorPointsNorth: toFishingPoleAnchorPoints(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.fishingPoleAnchorPointsNorth), fishingPoleAnchorPointsEast: toFishingPoleAnchorPoints(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.fishingPoleAnchorPointsEast), fishingPoleAnchorPointsSouth: toFishingPoleAnchorPoints(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.fishingPoleAnchorPointsSouth), fishingPoleAnchorPointsWest: toFishingPoleAnchorPoints(rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.fishingPoleAnchorPointsWest), fishExperience: (_r = rawItemType === null || rawItemType === void 0 ? void 0 : rawItemType.fishExperience) !== null && _r !== void 0 ? _r : 0 });
}
exports.toProcessedRawItemType = toProcessedRawItemType;
function toLootTable(rawLootTable, index) {
    var _a;
    return __assign(__assign({}, rawLootTable), { key: (_a = rawLootTable.key) !== null && _a !== void 0 ? _a : (index ? "LOOT_TABLE_".concat(index) : 'UNKNOWN_LOOT_TABLE'), defaultGroup: toLootTableComponentGroup(rawLootTable.defaultGroup), groups: rawLootTable.groups.map(toLootTableComponentGroup) });
}
exports.toLootTable = toLootTable;
function toProcessedRawLootTable(rawLootTable) {
    if ((0, null_util_1.isNullish)(rawLootTable)) {
        return {
            defaultGroup: toProcessedRawLootTableComponentGroup(null),
            groups: []
        };
    }
    return __assign(__assign({}, rawLootTable), { key: (0, null_util_1.isNullish)(rawLootTable.key) ? undefined : rawLootTable.key, defaultGroup: toProcessedRawLootTableComponentGroup(rawLootTable.defaultGroup), groups: (0, null_util_1.isNullish)(rawLootTable.groups) ? [] : rawLootTable.groups.map(toProcessedRawLootTableComponentGroup) });
}
exports.toProcessedRawLootTable = toProcessedRawLootTable;
function toCraftingRecipeCategory(rawCraftingRecipeCategory, index) {
    var _a;
    return __assign(__assign({}, rawCraftingRecipeCategory), { key: (_a = rawCraftingRecipeCategory.key) !== null && _a !== void 0 ? _a : (index ? "CRAFTING_RECIPE_CATEGORY_".concat(index) : 'UNKNOWN_CRAFTING_RECIPE_CATEGORY') });
}
exports.toCraftingRecipeCategory = toCraftingRecipeCategory;
function toProcessedRawCraftingRecipeCategory(rawCraftingRecipeCategory) {
    return __assign(__assign({}, rawCraftingRecipeCategory), { key: fromNullish(rawCraftingRecipeCategory === null || rawCraftingRecipeCategory === void 0 ? void 0 : rawCraftingRecipeCategory.key) });
}
exports.toProcessedRawCraftingRecipeCategory = toProcessedRawCraftingRecipeCategory;
function toCraftingRecipe(rawCraftingRecipe, index) {
    var _a;
    return __assign(__assign({}, rawCraftingRecipe), { key: (_a = rawCraftingRecipe.key) !== null && _a !== void 0 ? _a : (index ? "CRAFTING_RECIPE_".concat(index) : 'UNKNOWN_CRAFTING_RECIPE') });
}
exports.toCraftingRecipe = toCraftingRecipe;
function toProcessedRawCraftingRecipe(rawCraftingRecipe) {
    var _a, _b;
    return __assign(__assign({}, rawCraftingRecipe), { key: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.key), categoryKey: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.categoryKey), itemTypeKey: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.itemTypeKey), amount: (_a = rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.amount) !== null && _a !== void 0 ? _a : 0, hiddenResultsTypeKeys: fromNullishArray(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.hiddenResultsTypeKeys, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), craftingAttribute: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.craftingAttribute), workstation: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.workstation), craftingTime: (_b = fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.craftingTime)) !== null && _b !== void 0 ? _b : 0, searchCategories: fromNullishArray(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.searchCategories, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), ingredients: fromNullishRecord(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.ingredients, function (value) { return value !== null && value !== void 0 ? value : 0; }), requiredSkillKey: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.requiredSkillKey), requiredSkillLevelKey: fromNullish(rawCraftingRecipe === null || rawCraftingRecipe === void 0 ? void 0 : rawCraftingRecipe.requiredSkillLevelKey) });
}
exports.toProcessedRawCraftingRecipe = toProcessedRawCraftingRecipe;
function toObjectCategory(rawObjectCategory, index) {
    var _a;
    return __assign(__assign({}, rawObjectCategory), { key: (_a = rawObjectCategory.key) !== null && _a !== void 0 ? _a : (index ? "OBJECT_CATEGORY_".concat(index) : 'UNKNOWN_OBJECT_CATEGORY'), settings: toObjectSettings(rawObjectCategory.settings), colliders: (0, null_util_1.isNullish)(rawObjectCategory.colliders) ? undefined : toColliders(rawObjectCategory.colliders), sprite: toCategorySprite(rawObjectCategory.sprite) });
}
exports.toObjectCategory = toObjectCategory;
function toProcessedRawObjectCategory(rawObjectCategory) {
    return __assign(__assign({}, rawObjectCategory), { key: fromNullish(rawObjectCategory === null || rawObjectCategory === void 0 ? void 0 : rawObjectCategory.key), settings: (0, null_util_1.isNullish)(rawObjectCategory === null || rawObjectCategory === void 0 ? void 0 : rawObjectCategory.settings) ? undefined : toProcessedRawObjectSettings(rawObjectCategory === null || rawObjectCategory === void 0 ? void 0 : rawObjectCategory.settings), colliders: (0, null_util_1.isNullish)(rawObjectCategory) || (0, null_util_1.isNullish)(rawObjectCategory.colliders)
            ? undefined
            : toProcessedRawColliders(rawObjectCategory.colliders), sprite: toProcessedRawCategorySprite(rawObjectCategory === null || rawObjectCategory === void 0 ? void 0 : rawObjectCategory.sprite) });
}
exports.toProcessedRawObjectCategory = toProcessedRawObjectCategory;
function toObjectSubCategory(rawObjectSubCategory, index) {
    var _a;
    return __assign(__assign({}, rawObjectSubCategory), { key: (_a = rawObjectSubCategory.key) !== null && _a !== void 0 ? _a : (index ? "OBJECT_SUB_CATEGORY_".concat(index) : 'UNKNOWN_OBJECT_SUB_CATEGORY'), settings: toObjectSettings(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.settings), colliders: (0, null_util_1.isNullish)(rawObjectSubCategory.colliders) ? undefined : toColliders(rawObjectSubCategory.colliders), sprite: toCategorySprite(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.sprite), rulesets: (0, null_util_1.isNullish)(rawObjectSubCategory.rulesets) ? undefined : rawObjectSubCategory.rulesets.map(toObjectSpriteRules) });
}
exports.toObjectSubCategory = toObjectSubCategory;
function toProcessedRawObjectSubCategory(rawObjectSubCategory) {
    return __assign(__assign({}, rawObjectSubCategory), { key: fromNullish(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.key), settings: (0, null_util_1.isNullish)(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.settings) ? undefined : toProcessedRawObjectSettings(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.settings), colliders: (0, null_util_1.isNullish)(rawObjectSubCategory) || (0, null_util_1.isNullish)(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.colliders)
            ? undefined
            : toProcessedRawColliders(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.colliders), sprite: toProcessedRawCategorySprite(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.sprite), categoryKey: (0, null_util_1.isNullish)(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.categoryKey) ? undefined : rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.categoryKey, rulesets: (0, null_util_1.isNullish)(rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.rulesets) ? undefined : rawObjectSubCategory === null || rawObjectSubCategory === void 0 ? void 0 : rawObjectSubCategory.rulesets.map(toProcessedRawObjectSpriteRules) });
}
exports.toProcessedRawObjectSubCategory = toProcessedRawObjectSubCategory;
function toObjectType(rawObjectType, index) {
    var _a;
    return __assign(__assign({}, rawObjectType), { key: (_a = rawObjectType.key) !== null && _a !== void 0 ? _a : (index ? "OBJECT_".concat(index) : 'UNKNOWN_OBJECT'), settings: toObjectSettings(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.settings), colliders: (0, null_util_1.isNullish)(rawObjectType.colliders) ? undefined : toColliders(rawObjectType.colliders), sprite: toObjectSprites(rawObjectType.sprite), stages: (0, null_util_1.isNullish)(rawObjectType.stages) ? undefined : rawObjectType.stages.map(toObjectTypeStage), season: toSeason(rawObjectType.season) });
}
exports.toObjectType = toObjectType;
function toProcessedRawObjectType(rawObjectType) {
    var _a, _b, _c, _d, _e, _f;
    return __assign(__assign({}, rawObjectType), { id: (_a = rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.key), categoryKey: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.categoryKey), subCategoryKey: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.subCategoryKey), lootTableKey: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.lootTableKey), health: (_b = fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.health)) !== null && _b !== void 0 ? _b : 0, expireChance: (_c = fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.expireChance)) !== null && _c !== void 0 ? _c : 0, settings: toProcessedRawObjectSettings(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.settings), stages: (_d = rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.stages) === null || _d === void 0 ? void 0 : _d.map(toProcessedRawObjectTypeStage), colliders: (0, null_util_1.isNotNullish)(rawObjectType) && (0, null_util_1.isNotNullish)(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.colliders) ? toProcessedRawColliders(rawObjectType.colliders) : undefined, sprite: toProcessedRawObjectSprites(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.sprite), worldSize: toVector2(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.worldSize, { x: 1, y: 1 }), experience: (_e = rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.experience) !== null && _e !== void 0 ? _e : 0, season: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.season), craftingSpeedIncreaseSkillKey: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.craftingSpeedIncreaseSkillKey), lightLevel: fromNullish(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.lightLevel), lightPosition: toVector2(rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.lightPosition), animationSampleRate: (_f = rawObjectType === null || rawObjectType === void 0 ? void 0 : rawObjectType.animationSampleRate) !== null && _f !== void 0 ? _f : 0 });
}
exports.toProcessedRawObjectType = toProcessedRawObjectType;
function createObjectSprites() {
    return {
        defaultSprite: 0,
        width: 0,
        height: 0
    };
}
exports.createObjectSprites = createObjectSprites;
function toProcessedRawObjectSprites(objectSprites) {
    var _a, _b, _c, _d, _e, _f;
    return __assign(__assign({}, objectSprites), { defaultSprite: (_a = objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.defaultSprite) !== null && _a !== void 0 ? _a : 0, width: (_b = objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.width) !== null && _b !== void 0 ? _b : 0, height: (_c = objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.height) !== null && _c !== void 0 ? _c : 0, pivotOffset: (0, null_util_1.isNullish)(objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.pivotOffset)
            ? undefined
            : {
                x: (_d = objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.pivotOffset.x) !== null && _d !== void 0 ? _d : 0,
                y: (_f = (_e = objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.pivotOffset) === null || _e === void 0 ? void 0 : _e.y) !== null && _f !== void 0 ? _f : 0
            }, sprites: toProcessedRawSprites(objectSprites === null || objectSprites === void 0 ? void 0 : objectSprites.sprites) });
}
exports.toProcessedRawObjectSprites = toProcessedRawObjectSprites;
function toObjectSprites(objectSprites) {
    return __assign(__assign({}, objectSprites), { sprites: toSprites(objectSprites.sprites) });
}
exports.toObjectSprites = toObjectSprites;
function createObjectSprite() {
    return {};
}
exports.createObjectSprite = createObjectSprite;
function toProcessedRawSprites(sprites) {
    return fromNullishRecord(sprites, toProcessedRawSprite);
}
exports.toProcessedRawSprites = toProcessedRawSprites;
function toProcessedRawSprite(objectSprite) {
    return __assign(__assign({}, objectSprite), { pivotOffset: toVector2(objectSprite === null || objectSprite === void 0 ? void 0 : objectSprite.pivotOffset), spriteOffset: toVector2(objectSprite === null || objectSprite === void 0 ? void 0 : objectSprite.spriteOffset, { x: 0, y: 0 }), placementLayer: fromNullish(objectSprite === null || objectSprite === void 0 ? void 0 : objectSprite.placementLayer), colliders: (0, null_util_1.isNullish)(objectSprite === null || objectSprite === void 0 ? void 0 : objectSprite.colliders) ? undefined : objectSprite === null || objectSprite === void 0 ? void 0 : objectSprite.colliders.map(toProcessedRawObjectCollider) });
}
exports.toProcessedRawSprite = toProcessedRawSprite;
function toSprites(sprites) {
    return (0, null_util_1.isNullish)(sprites)
        ? undefined
        : Object.keys(sprites).reduce(function (spriteSettings, sprite) {
            var objectSprite = sprites === null || sprites === void 0 ? void 0 : sprites[sprite];
            if ((0, null_util_1.isNotNullish)(objectSprite)) {
                spriteSettings[sprite] = toSprite(objectSprite);
            }
            return spriteSettings;
        }, {});
}
exports.toSprites = toSprites;
function toSprite(objectSprite) {
    return __assign(__assign({}, objectSprite), { placementLayer: toPlacementLayer(objectSprite.placementLayer), colliders: (0, null_util_1.isNullish)(objectSprite.colliders) ? undefined : objectSprite.colliders.map(toObjectCollider) });
}
exports.toSprite = toSprite;
function toProcessedRawObjectCollider(rawObjectCollider) {
    var _a, _b, _c;
    return __assign(__assign({}, rawObjectCollider), { isTrigger: (_a = fromNullish(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.isTrigger)) !== null && _a !== void 0 ? _a : false, usedByComposite: (_b = fromNullish(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.usedByComposite)) !== null && _b !== void 0 ? _b : false, type: fromNullish(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.type), size: toVector2(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.size), offset: toVector2(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.offset), padding: (_c = fromNullish(rawObjectCollider === null || rawObjectCollider === void 0 ? void 0 : rawObjectCollider.padding)) !== null && _c !== void 0 ? _c : 0 });
}
exports.toProcessedRawObjectCollider = toProcessedRawObjectCollider;
function toObjectCollider(processedRawObjectCollider) {
    return __assign(__assign({}, processedRawObjectCollider), { type: toColliderType(processedRawObjectCollider.type) });
}
exports.toObjectCollider = toObjectCollider;
function toProcessedRawColliders(rawObjectCollider) {
    return rawObjectCollider.map(toProcessedRawObjectCollider);
}
exports.toProcessedRawColliders = toProcessedRawColliders;
function toColliders(processedRawObjectCollider) {
    return processedRawObjectCollider.map(toObjectCollider);
}
exports.toColliders = toColliders;
function toProcessedRawCategorySprite(rawCategorySprite) {
    return {
        sprites: toProcessedRawSprites(rawCategorySprite === null || rawCategorySprite === void 0 ? void 0 : rawCategorySprite.sprites)
    };
}
exports.toProcessedRawCategorySprite = toProcessedRawCategorySprite;
function toCategorySprite(processedRawCategorySprite) {
    if ((0, null_util_1.isNullish)(processedRawCategorySprite)) {
        return undefined;
    }
    return {
        sprites: toSprites(processedRawCategorySprite.sprites)
    };
}
exports.toCategorySprite = toCategorySprite;
function toProcessedRawSpriteColliders(rawSpriteColliders) {
    if ((0, null_util_1.isNullish)(rawSpriteColliders)) {
        return {};
    }
    return Object.keys(rawSpriteColliders).reduce(function (spriteColliders, sprite) {
        var _a, _b;
        spriteColliders[sprite] = (_b = (_a = rawSpriteColliders === null || rawSpriteColliders === void 0 ? void 0 : rawSpriteColliders[sprite]) === null || _a === void 0 ? void 0 : _a.map(toProcessedRawObjectCollider)) !== null && _b !== void 0 ? _b : [];
        return spriteColliders;
    }, {});
}
exports.toProcessedRawSpriteColliders = toProcessedRawSpriteColliders;
function toSpriteColliders(rawSpriteColliders) {
    if ((0, null_util_1.isNullish)(rawSpriteColliders)) {
        return {};
    }
    return Object.keys(rawSpriteColliders).reduce(function (spriteColliders, sprite) {
        var _a, _b;
        spriteColliders[sprite] = (_b = (_a = rawSpriteColliders === null || rawSpriteColliders === void 0 ? void 0 : rawSpriteColliders[sprite]) === null || _a === void 0 ? void 0 : _a.map(toObjectCollider)) !== null && _b !== void 0 ? _b : [];
        return spriteColliders;
    }, {});
}
exports.toSpriteColliders = toSpriteColliders;
function toProcessedRawObjectSpriteRules(rawRulset) {
    var _a, _b;
    return __assign(__assign({}, rawRulset), { rules: (_a = fromNullish(rawRulset === null || rawRulset === void 0 ? void 0 : rawRulset.rules)) === null || _a === void 0 ? void 0 : _a.map(toProcessedRawObjectSpriteRule), defaultSprite: (_b = fromNullish(rawRulset === null || rawRulset === void 0 ? void 0 : rawRulset.defaultSprite)) !== null && _b !== void 0 ? _b : 0 });
}
exports.toProcessedRawObjectSpriteRules = toProcessedRawObjectSpriteRules;
function toObjectSpriteRules(rawRulset) {
    var _a, _b;
    return __assign(__assign({}, rawRulset), { rules: (_a = rawRulset === null || rawRulset === void 0 ? void 0 : rawRulset.rules) === null || _a === void 0 ? void 0 : _a.map(toObjectSpriteRule), defaultSprite: (_b = rawRulset === null || rawRulset === void 0 ? void 0 : rawRulset.defaultSprite) !== null && _b !== void 0 ? _b : 0 });
}
exports.toObjectSpriteRules = toObjectSpriteRules;
function toProcessedRawObjectSpriteRule(rawRule) {
    return __assign(__assign({}, rawRule), { sprites: fromNullishArray(rawRule === null || rawRule === void 0 ? void 0 : rawRule.sprites, function (entry) { return entry !== null && entry !== void 0 ? entry : 0; }), conditions: fromNullishRecord(rawRule === null || rawRule === void 0 ? void 0 : rawRule.conditions, function (value) { return value !== null && value !== void 0 ? value : false; }) });
}
exports.toProcessedRawObjectSpriteRule = toProcessedRawObjectSpriteRule;
function toObjectSpriteRule(rule) {
    return __assign(__assign({}, rule), { conditions: toTypedKeyRecord(rule === null || rule === void 0 ? void 0 : rule.conditions, toObjectSpriteRulePosition) });
}
exports.toObjectSpriteRule = toObjectSpriteRule;
function toObjectTypeStage(rawStage) {
    return __assign(__assign({}, rawStage), { jumpCondition: toStageJumpCondition(rawStage.jumpCondition) });
}
exports.toObjectTypeStage = toObjectTypeStage;
function toProcessedRawObjectTypeStage(rawStage) {
    var _a, _b, _c, _d, _e;
    return __assign(__assign({}, rawStage), { lootTableKey: fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.lootTableKey), growthDays: (_a = fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.growthDays)) !== null && _a !== void 0 ? _a : 0, health: (_b = fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.health)) !== null && _b !== void 0 ? _b : 0, threshold: (_c = fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.threshold)) !== null && _c !== void 0 ? _c : 0, harvestable: (_d = fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.harvestable)) !== null && _d !== void 0 ? _d : false, pause: (_e = fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.pause)) !== null && _e !== void 0 ? _e : false, jumpToStage: fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.jumpToStage), jumpCondition: fromNullish(rawStage === null || rawStage === void 0 ? void 0 : rawStage.jumpCondition) });
}
exports.toProcessedRawObjectTypeStage = toProcessedRawObjectTypeStage;
function createObjectTypeStage() {
    return {
        growthDays: 0,
        health: 0,
        threshold: 0,
        harvestable: false,
        pause: false
    };
}
exports.createObjectTypeStage = createObjectTypeStage;
function toProcessedRawLootTableComponentGroup(rawLootTableComponentGroup) {
    if ((0, null_util_1.isNullish)(rawLootTableComponentGroup)) {
        return {
            probability: 0,
            components: []
        };
    }
    return __assign(__assign({}, rawLootTableComponentGroup), { probability: (0, null_util_1.isNotNullish)(rawLootTableComponentGroup === null || rawLootTableComponentGroup === void 0 ? void 0 : rawLootTableComponentGroup.probability) ? rawLootTableComponentGroup === null || rawLootTableComponentGroup === void 0 ? void 0 : rawLootTableComponentGroup.probability : 0, components: (0, null_util_1.isNullish)(rawLootTableComponentGroup.components)
            ? []
            : rawLootTableComponentGroup.components.map(toProcessedRawLootTableComponent) });
}
exports.toProcessedRawLootTableComponentGroup = toProcessedRawLootTableComponentGroup;
function toLootTableComponentGroup(processedRawLootTableComponentGroup) {
    return __assign(__assign({}, processedRawLootTableComponentGroup), { components: processedRawLootTableComponentGroup.components.map(toLootTableComponent) });
}
exports.toLootTableComponentGroup = toLootTableComponentGroup;
function toProcessedRawLootTableComponent(rawLootTableComponent) {
    if ((0, null_util_1.isNullish)(rawLootTableComponent)) {
        return {
            min: 0,
            max: 0,
            probability: 0
        };
    }
    return __assign(__assign({}, rawLootTableComponent), { typeKey: (0, null_util_1.isNullish)(rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.typeKey) ? undefined : rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.typeKey, min: (0, null_util_1.isNotNullish)(rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.min) ? rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.min : 0, max: (0, null_util_1.isNotNullish)(rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.max) ? rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.max : 0, probability: (0, null_util_1.isNotNullish)(rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.probability) ? rawLootTableComponent === null || rawLootTableComponent === void 0 ? void 0 : rawLootTableComponent.probability : 0 });
}
exports.toProcessedRawLootTableComponent = toProcessedRawLootTableComponent;
function toLootTableComponent(processedRawLootTableComponent) {
    return __assign({}, processedRawLootTableComponent);
}
exports.toLootTableComponent = toLootTableComponent;
function toDialogueTree(processedRawDialogueTree) {
    var _a;
    return __assign(__assign({}, processedRawDialogueTree), { key: (_a = processedRawDialogueTree.key) !== null && _a !== void 0 ? _a : (processedRawDialogueTree.id ? "DIALOG_TREE_".concat(processedRawDialogueTree.id) : 'UNKNOWN_DIALOG_TREE'), conditions: toDialogueConditions(processedRawDialogueTree.conditions), dialogues: processedRawDialogueTree.dialogues.map(toDialogue) });
}
exports.toDialogueTree = toDialogueTree;
function toProcessedRawDialogueTree(rawDialogueTree) {
    var _a, _b, _c, _d, _e;
    return __assign(__assign({}, rawDialogueTree), { id: (_a = rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.key), creatureKey: fromNullish(rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.creatureKey), conditions: toProcessedRawDialogueConditions(rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.conditions), dialogues: (_b = fromNullishArray(rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.dialogues, toProcessedRawDialogue)) !== null && _b !== void 0 ? _b : [], startingDialogueId: (_c = rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.startingDialogueId) !== null && _c !== void 0 ? _c : 0, priority: (_d = rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.priority) !== null && _d !== void 0 ? _d : 0, runOnlyOnce: (_e = rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.runOnlyOnce) !== null && _e !== void 0 ? _e : false, completionEvent: fromNullish(rawDialogueTree === null || rawDialogueTree === void 0 ? void 0 : rawDialogueTree.completionEvent) });
}
exports.toProcessedRawDialogueTree = toProcessedRawDialogueTree;
function toDialogueConditions(processedRawDialogueConditions) {
    if (!processedRawDialogueConditions) {
        return undefined;
    }
    return __assign(__assign({}, processedRawDialogueConditions), { timesComparator: toTimeComparator(processedRawDialogueConditions === null || processedRawDialogueConditions === void 0 ? void 0 : processedRawDialogueConditions.timesComparator) });
}
exports.toDialogueConditions = toDialogueConditions;
function toProcessedRawDialogueConditions(rawDialogueConditions) {
    if (!rawDialogueConditions) {
        return undefined;
    }
    return __assign(__assign({}, rawDialogueConditions), { days: fromNullishArray(rawDialogueConditions === null || rawDialogueConditions === void 0 ? void 0 : rawDialogueConditions.days, function (value) { return value !== null && value !== void 0 ? value : 0; }), times: fromNullishArray(rawDialogueConditions === null || rawDialogueConditions === void 0 ? void 0 : rawDialogueConditions.times, function (value) { return value !== null && value !== void 0 ? value : 0; }), timesComparator: fromNullish(rawDialogueConditions === null || rawDialogueConditions === void 0 ? void 0 : rawDialogueConditions.timesComparator) });
}
exports.toProcessedRawDialogueConditions = toProcessedRawDialogueConditions;
function toDialogue(processedRawDialogue) {
    var _a;
    return __assign(__assign({}, processedRawDialogue), { key: (_a = processedRawDialogue.key) !== null && _a !== void 0 ? _a : (processedRawDialogue.id ? "DIALOG_".concat(processedRawDialogue.id) : 'UNKNOWN_DIALOG'), responses: processedRawDialogue.responses.map(toDialogueResponse) });
}
exports.toDialogue = toDialogue;
function toProcessedRawDialogue(rawDialogue) {
    var _a, _b;
    return __assign(__assign({}, rawDialogue), { id: (_a = rawDialogue === null || rawDialogue === void 0 ? void 0 : rawDialogue.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawDialogue === null || rawDialogue === void 0 ? void 0 : rawDialogue.key), responses: (_b = fromNullishArray(rawDialogue === null || rawDialogue === void 0 ? void 0 : rawDialogue.responses, toProcessedRawDialogueResponse)) !== null && _b !== void 0 ? _b : [], nextDialogId: fromNullish(rawDialogue === null || rawDialogue === void 0 ? void 0 : rawDialogue.nextDialogId) });
}
exports.toProcessedRawDialogue = toProcessedRawDialogue;
function toDialogueResponse(processedRawDialogueResponse) {
    var _a;
    return __assign(__assign({}, processedRawDialogueResponse), { key: (_a = processedRawDialogueResponse.key) !== null && _a !== void 0 ? _a : (processedRawDialogueResponse.id ? "DIALOG_RESPONSE_".concat(processedRawDialogueResponse.id) : 'UNKNOWN_DIALOG_RESPONSE') });
}
exports.toDialogueResponse = toDialogueResponse;
function toProcessedRawDialogueResponse(rawDialogueResponse) {
    var _a;
    return __assign(__assign({}, rawDialogueResponse), { id: (_a = rawDialogueResponse === null || rawDialogueResponse === void 0 ? void 0 : rawDialogueResponse.id) !== null && _a !== void 0 ? _a : 0, key: fromNullish(rawDialogueResponse === null || rawDialogueResponse === void 0 ? void 0 : rawDialogueResponse.key), nextDialogId: fromNullish(rawDialogueResponse === null || rawDialogueResponse === void 0 ? void 0 : rawDialogueResponse.nextDialogId) });
}
exports.toProcessedRawDialogueResponse = toProcessedRawDialogueResponse;
function toPlayerData(processedRawPlayerData) {
    return __assign({}, processedRawPlayerData);
}
exports.toPlayerData = toPlayerData;
function toProcessedRawPlayerData(rawPlayerData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    return __assign(__assign({}, rawPlayerData), { health: (_a = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.health) !== null && _a !== void 0 ? _a : 0, healthMax: (_b = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.healthMax) !== null && _b !== void 0 ? _b : 0, healthDepletionTime: (_c = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.healthDepletionTime) !== null && _c !== void 0 ? _c : 0, healthRefillTime: (_d = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.healthRefillTime) !== null && _d !== void 0 ? _d : 0, healthRefillHungerDepletionRate: (_e = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.healthRefillHungerDepletionRate) !== null && _e !== void 0 ? _e : 0, healthRefillThirstDepletionRate: (_f = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.healthRefillThirstDepletionRate) !== null && _f !== void 0 ? _f : 0, hunger: (_g = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.hunger) !== null && _g !== void 0 ? _g : 0, hungerMax: (_h = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.hungerMax) !== null && _h !== void 0 ? _h : 0, hungerInitialDelay: (_j = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.hungerInitialDelay) !== null && _j !== void 0 ? _j : 0, hungerMaxedOutDelay: (_k = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.hungerMaxedOutDelay) !== null && _k !== void 0 ? _k : 0, hungerDepletionRate: (_l = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.hungerDepletionRate) !== null && _l !== void 0 ? _l : 0, thirst: (_m = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.thirst) !== null && _m !== void 0 ? _m : 0, thirstMax: (_o = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.thirstMax) !== null && _o !== void 0 ? _o : 0, thirstInitialDelay: (_p = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.thirstInitialDelay) !== null && _p !== void 0 ? _p : 0, thirstMaxedOutDelay: (_q = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.thirstMaxedOutDelay) !== null && _q !== void 0 ? _q : 0, thirstDepletionRate: (_r = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.thirstDepletionRate) !== null && _r !== void 0 ? _r : 0, energy: (_s = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energy) !== null && _s !== void 0 ? _s : 0, energyMax: (_t = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energyMax) !== null && _t !== void 0 ? _t : 0, energyBaseUsageRate: (_u = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energyBaseUsageRate) !== null && _u !== void 0 ? _u : 0, energyRefillRate: (_v = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energyRefillRate) !== null && _v !== void 0 ? _v : 0, energyRefillHungerDepletionRate: (_w = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energyRefillHungerDepletionRate) !== null && _w !== void 0 ? _w : 0, energyRefillThirstDepletionRate: (_x = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.energyRefillThirstDepletionRate) !== null && _x !== void 0 ? _x : 0, money: (_y = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.money) !== null && _y !== void 0 ? _y : 0, startingItems: (_z = fromNullishRecord(rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.startingItems, function (value) { return value !== null && value !== void 0 ? value : 0; })) !== null && _z !== void 0 ? _z : {}, nextLevelExp: (_0 = fromNullishArray(rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.nextLevelExp, function (exp) { return exp !== null && exp !== void 0 ? exp : 0; })) !== null && _0 !== void 0 ? _0 : [], damageImmunityTime: (_1 = rawPlayerData === null || rawPlayerData === void 0 ? void 0 : rawPlayerData.damageImmunityTime) !== null && _1 !== void 0 ? _1 : 0 });
}
exports.toProcessedRawPlayerData = toProcessedRawPlayerData;
function toEventLog(processedRawEventLog) {
    return __assign({}, processedRawEventLog);
}
exports.toEventLog = toEventLog;
function toProcessedRawEventLog(rawEventLog) {
    var _a, _b;
    return __assign(__assign({}, rawEventLog), { id: (_a = rawEventLog === null || rawEventLog === void 0 ? void 0 : rawEventLog.id) !== null && _a !== void 0 ? _a : 0, key: (_b = fromNullish(rawEventLog === null || rawEventLog === void 0 ? void 0 : rawEventLog.key)) !== null && _b !== void 0 ? _b : 'UNKNOWN_EVENT_LOG' });
}
exports.toProcessedRawEventLog = toProcessedRawEventLog;
function toWorldSettings(processedRawWorldSettings) {
    return __assign(__assign({}, processedRawWorldSettings), { weather: toWeatherSettings(processedRawWorldSettings === null || processedRawWorldSettings === void 0 ? void 0 : processedRawWorldSettings.weather) });
}
exports.toWorldSettings = toWorldSettings;
function toProcessedRawWorldSettings(rawWorldSettings) {
    return __assign(__assign({}, rawWorldSettings), { weather: toProcessedRawWeatherSettings(rawWorldSettings === null || rawWorldSettings === void 0 ? void 0 : rawWorldSettings.weather) });
}
exports.toProcessedRawWorldSettings = toProcessedRawWorldSettings;
function toWeatherSettings(processedRawWeatherSettings) {
    return __assign({}, processedRawWeatherSettings);
}
exports.toWeatherSettings = toWeatherSettings;
function toProcessedRawWeatherSettings(rawWeatherSettings) {
    var _a, _b;
    return __assign(__assign({}, rawWeatherSettings), { rainChance: (_a = rawWeatherSettings === null || rawWeatherSettings === void 0 ? void 0 : rawWeatherSettings.rainChance) !== null && _a !== void 0 ? _a : 0, snowChance: (_b = rawWeatherSettings === null || rawWeatherSettings === void 0 ? void 0 : rawWeatherSettings.snowChance) !== null && _b !== void 0 ? _b : 0 });
}
exports.toProcessedRawWeatherSettings = toProcessedRawWeatherSettings;
function toWorldZone(processedRawWorldZone) {
    return __assign(__assign({}, processedRawWorldZone), { spawns: processedRawWorldZone.spawns.map(toWorldZoneSpawn) });
}
exports.toWorldZone = toWorldZone;
function toProcessedRawWorldZone(rawWorldZone) {
    var _a, _b, _c;
    return __assign(__assign({}, rawWorldZone), { id: (_a = rawWorldZone === null || rawWorldZone === void 0 ? void 0 : rawWorldZone.id) !== null && _a !== void 0 ? _a : 0, key: (_b = fromNullish(rawWorldZone === null || rawWorldZone === void 0 ? void 0 : rawWorldZone.key)) !== null && _b !== void 0 ? _b : 'UNKNOWN_WORLD_ZONE', spawns: (_c = fromNullishArray(rawWorldZone === null || rawWorldZone === void 0 ? void 0 : rawWorldZone.spawns, toProcessedRawWorldZoneSpawn)) !== null && _c !== void 0 ? _c : [] });
}
exports.toProcessedRawWorldZone = toProcessedRawWorldZone;
function toWorldZoneSpawn(processedRawWorldZoneSpawn) {
    return __assign({}, processedRawWorldZoneSpawn);
}
exports.toWorldZoneSpawn = toWorldZoneSpawn;
function toProcessedRawWorldZoneSpawn(rawWorldZoneSpawn) {
    var _a, _b;
    return __assign(__assign({}, rawWorldZoneSpawn), { creatureKey: fromNullish(rawWorldZoneSpawn === null || rawWorldZoneSpawn === void 0 ? void 0 : rawWorldZoneSpawn.creatureKey), probability: (_a = rawWorldZoneSpawn === null || rawWorldZoneSpawn === void 0 ? void 0 : rawWorldZoneSpawn.probability) !== null && _a !== void 0 ? _a : 0, limit: (_b = rawWorldZoneSpawn === null || rawWorldZoneSpawn === void 0 ? void 0 : rawWorldZoneSpawn.limit) !== null && _b !== void 0 ? _b : 0 });
}
exports.toProcessedRawWorldZoneSpawn = toProcessedRawWorldZoneSpawn;
function toFishingZone(processedRawFishingZone) {
    return __assign({}, processedRawFishingZone);
}
exports.toFishingZone = toFishingZone;
function toProcessedRawFishingZone(rawFishingZone) {
    var _a, _b, _c;
    return __assign(__assign({}, rawFishingZone), { id: (_a = rawFishingZone === null || rawFishingZone === void 0 ? void 0 : rawFishingZone.id) !== null && _a !== void 0 ? _a : 0, key: (_b = fromNullish(rawFishingZone === null || rawFishingZone === void 0 ? void 0 : rawFishingZone.key)) !== null && _b !== void 0 ? _b : 'UNKNOWN_FISHING_ZONE', lootTableKey: (_c = fromNullish(rawFishingZone === null || rawFishingZone === void 0 ? void 0 : rawFishingZone.lootTableKey)) !== null && _c !== void 0 ? _c : '' });
}
exports.toProcessedRawFishingZone = toProcessedRawFishingZone;
function toSkill(processedRawSkill) {
    var _a, _b;
    return __assign(__assign({}, processedRawSkill), { id: (_a = processedRawSkill.id) !== null && _a !== void 0 ? _a : 0, key: (_b = processedRawSkill.key) !== null && _b !== void 0 ? _b : 'UNKNOWN_SKILL', levels: processedRawSkill.levels.map(toSkillLevel) });
}
exports.toSkill = toSkill;
function toProcessedRawSkill(rawSkill) {
    var _a;
    return __assign(__assign({}, rawSkill), { id: fromNullish(rawSkill === null || rawSkill === void 0 ? void 0 : rawSkill.id), key: fromNullish(rawSkill === null || rawSkill === void 0 ? void 0 : rawSkill.key), levels: (_a = fromNullishArray(rawSkill === null || rawSkill === void 0 ? void 0 : rawSkill.levels, toProcessedRawSkillLevel)) !== null && _a !== void 0 ? _a : [] });
}
exports.toProcessedRawSkill = toProcessedRawSkill;
function toSkillLevel(processedRawSkillLevel) {
    var _a;
    return __assign(__assign({}, processedRawSkillLevel), { key: (_a = processedRawSkillLevel === null || processedRawSkillLevel === void 0 ? void 0 : processedRawSkillLevel.key) !== null && _a !== void 0 ? _a : 'UNKNOWN_SKILL_LEVEL' });
}
exports.toSkillLevel = toSkillLevel;
function toProcessedRawSkillLevel(rawSkillLevel) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __assign(__assign({}, rawSkillLevel), { key: fromNullish(rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.key), damageIncrease: (_a = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.damageIncrease) !== null && _a !== void 0 ? _a : 0, healthRegenIncrease: (_b = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.healthRegenIncrease) !== null && _b !== void 0 ? _b : 0, energyRegenIncrease: (_c = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.energyRegenIncrease) !== null && _c !== void 0 ? _c : 0, energyUseDescrease: (_d = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.energyUseDescrease) !== null && _d !== void 0 ? _d : 0, craftingSpeedIncrease: (_e = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.craftingSpeedIncrease) !== null && _e !== void 0 ? _e : 0, monsterLootIncrease: (_f = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.monsterLootIncrease) !== null && _f !== void 0 ? _f : 0, damageReduction: (_g = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.damageReduction) !== null && _g !== void 0 ? _g : 0, doubleCropChance: (_h = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.doubleCropChance) !== null && _h !== void 0 ? _h : 0, fishSizeChanceIncrease: (_j = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.fishSizeChanceIncrease) !== null && _j !== void 0 ? _j : 0, fishBiteSpeedIncrease: (_k = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.fishBiteSpeedIncrease) !== null && _k !== void 0 ? _k : 0, sellPriceIncrease: (_l = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.sellPriceIncrease) !== null && _l !== void 0 ? _l : 0, buyDiscount: (_m = rawSkillLevel === null || rawSkillLevel === void 0 ? void 0 : rawSkillLevel.buyDiscount) !== null && _m !== void 0 ? _m : 0 });
}
exports.toProcessedRawSkillLevel = toProcessedRawSkillLevel;
function toLocalizationFile(localizationFile) {
    return __assign(__assign({}, localizationFile), { localizations: localizationFile.localizations.map(toLocalization) });
}
exports.toLocalizationFile = toLocalizationFile;
function toProcessedRawLocalizationFile(localizationFile) {
    var _a, _b;
    return __assign(__assign({}, localizationFile), { keys: (_a = fromNullishArray(localizationFile === null || localizationFile === void 0 ? void 0 : localizationFile.keys, function (value) { return value !== null && value !== void 0 ? value : ''; })) !== null && _a !== void 0 ? _a : [], localizations: (_b = fromNullishArray(localizationFile === null || localizationFile === void 0 ? void 0 : localizationFile.localizations, toProcessedRawLocalization)) !== null && _b !== void 0 ? _b : [] });
}
exports.toProcessedRawLocalizationFile = toProcessedRawLocalizationFile;
function toLocalization(localization) {
    return __assign({}, localization);
}
exports.toLocalization = toLocalization;
function toProcessedRawLocalization(localization) {
    var _a, _b;
    return __assign(__assign({}, localization), { key: (_a = localization === null || localization === void 0 ? void 0 : localization.key) !== null && _a !== void 0 ? _a : '', name: (_b = localization === null || localization === void 0 ? void 0 : localization.name) !== null && _b !== void 0 ? _b : '', values: fromNullishRecord(localization === null || localization === void 0 ? void 0 : localization.values, function (value) { return value !== null && value !== void 0 ? value : ''; }) || {} });
}
exports.toProcessedRawLocalization = toProcessedRawLocalization;
function toQuest(quest) {
    var _a, _b;
    return __assign(__assign({}, quest), { id: (_a = quest.id) !== null && _a !== void 0 ? _a : 0, key: (_b = quest.key) !== null && _b !== void 0 ? _b : '', tasks: quest.tasks.map(toQuestTask), source: toQuestSource(quest.source), completionTrigger: toQuestCompletionTrigger(quest.completionTrigger) });
}
exports.toQuest = toQuest;
function toProcessedRawQuest(quest) {
    var _a, _b, _c;
    return __assign(__assign({}, quest), { id: fromNullish(quest === null || quest === void 0 ? void 0 : quest.id), key: fromNullish(quest === null || quest === void 0 ? void 0 : quest.key), tasks: (_a = fromNullishArray(quest === null || quest === void 0 ? void 0 : quest.tasks, toProcessedRawQuestTask)) !== null && _a !== void 0 ? _a : [], prerequisiteEventKeys: fromNullishArray(quest === null || quest === void 0 ? void 0 : quest.prerequisiteEventKeys, function (value) { return value !== null && value !== void 0 ? value : ''; }) || [], source: fromNullish(quest === null || quest === void 0 ? void 0 : quest.source), sourceCreatureTypeKey: fromNullish(quest === null || quest === void 0 ? void 0 : quest.sourceCreatureTypeKey), sourceCreatureDialogueTreeKey: fromNullish(quest === null || quest === void 0 ? void 0 : quest.sourceCreatureDialogueTreeKey), completionTrigger: fromNullish(quest === null || quest === void 0 ? void 0 : quest.completionTrigger), completionCreatureTypeKey: fromNullish(quest === null || quest === void 0 ? void 0 : quest.completionCreatureTypeKey), completionCreatureDialogueTreeKey: fromNullish(quest === null || quest === void 0 ? void 0 : quest.completionCreatureDialogueTreeKey), experienceReward: (_b = quest === null || quest === void 0 ? void 0 : quest.experienceReward) !== null && _b !== void 0 ? _b : 0, itemRewards: (_c = fromNullishRecord(quest === null || quest === void 0 ? void 0 : quest.itemRewards, function (value) { return value !== null && value !== void 0 ? value : 0; })) !== null && _c !== void 0 ? _c : {} });
}
exports.toProcessedRawQuest = toProcessedRawQuest;
function createQuestTask() {
    return {
        id: 0,
        key: 'NEW_TASK',
        objectives: [{}]
    };
}
exports.createQuestTask = createQuestTask;
function toQuestTask(questTask) {
    var _a, _b;
    return __assign(__assign({}, questTask), { id: (_a = questTask === null || questTask === void 0 ? void 0 : questTask.id) !== null && _a !== void 0 ? _a : 0, key: (_b = questTask === null || questTask === void 0 ? void 0 : questTask.key) !== null && _b !== void 0 ? _b : '', objectives: questTask.objectives.map(toQuestObjective) });
}
exports.toQuestTask = toQuestTask;
function toProcessedRawQuestTask(questTask) {
    return __assign(__assign({}, questTask), { id: fromNullish(questTask === null || questTask === void 0 ? void 0 : questTask.id), key: fromNullish(questTask === null || questTask === void 0 ? void 0 : questTask.key), objectives: fromNullishArray(questTask === null || questTask === void 0 ? void 0 : questTask.objectives, toProcessedRawQuestObjective) || [] });
}
exports.toProcessedRawQuestTask = toProcessedRawQuestTask;
function createQuestObjective() {
    return {};
}
exports.createQuestObjective = createQuestObjective;
function toQuestObjective(questObjective) {
    return __assign(__assign({}, questObjective), { objectiveType: toQuestObjectiveType(questObjective.objectiveType) });
}
exports.toQuestObjective = toQuestObjective;
function toProcessedRawQuestObjective(questObjective) {
    return __assign(__assign({}, questObjective), { objectiveType: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.objectiveType), itemTypeKey: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.itemTypeKey), itemAmount: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.itemAmount), craftingRecipeKey: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.craftingRecipeKey), craftingAmount: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.craftingAmount), destinationPosition: toVector2(questObjective === null || questObjective === void 0 ? void 0 : questObjective.destinationPosition), destinationRadius: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.destinationRadius), creatureTypeKey: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.creatureTypeKey), creatureDialogueTreeKey: fromNullish(questObjective === null || questObjective === void 0 ? void 0 : questObjective.creatureDialogueTreeKey) });
}
exports.toProcessedRawQuestObjective = toProcessedRawQuestObjective;
function createVector2() {
    return {
        x: 0,
        y: 0
    };
}
exports.createVector2 = createVector2;
function toLootType(rawLootType) {
    var lootType = undefined;
    switch (rawLootType) {
        case constants_1.LOOT_TYPE_NONE:
        case constants_1.LOOT_TYPE_DROP:
        case constants_1.LOOT_TYPE_STAGE_DROP:
            lootType = rawLootType;
            break;
        default:
            break;
    }
    return lootType;
}
exports.toLootType = toLootType;
function toStagesType(rawStagesType) {
    var stagesType = undefined;
    switch (rawStagesType) {
        case constants_1.STAGES_TYPE_NONE:
        case constants_1.STAGES_TYPE_GROWABLE:
        case constants_1.STAGES_TYPE_GROWABLE_WITH_HEALTH:
        case constants_1.STAGES_TYPE_BREAKABLE:
            stagesType = rawStagesType;
            break;
        default:
            break;
    }
    return stagesType;
}
exports.toStagesType = toStagesType;
function toPlacementPosition(rawPlacementPosition) {
    var placementPosition = undefined;
    switch (rawPlacementPosition) {
        case constants_1.PLACEMENT_POSITION_CENTER:
        case constants_1.PLACEMENT_POSITION_EDGE:
            placementPosition = rawPlacementPosition;
            break;
        default:
            break;
    }
    return placementPosition;
}
exports.toPlacementPosition = toPlacementPosition;
function toPlacementLayer(rawPlacementLayer) {
    var placementLayer = undefined;
    switch (rawPlacementLayer) {
        case constants_1.PLACEMENT_LAYER_IN_GROUND:
        case constants_1.PLACEMENT_LAYER_ON_GROUND:
        case constants_1.PLACEMENT_LAYER_IN_AIR:
            placementLayer = rawPlacementLayer;
            break;
        default:
            break;
    }
    return placementLayer;
}
exports.toPlacementLayer = toPlacementLayer;
function toColliderType(rawColliderType) {
    var colliderType = undefined;
    switch (rawColliderType) {
        case constants_1.POLYGON_COLLIDER_TYPE:
        case constants_1.AUTO_BOX_COLLIDER_TYPE:
        case constants_1.BOX_COLLIDER_TYPE:
            colliderType = rawColliderType;
            break;
        default:
            break;
    }
    return colliderType;
}
exports.toColliderType = toColliderType;
function toObjectSpriteRulePosition(rawObjectSpriteRulePosition) {
    var objectSpriteRulePosition = undefined;
    switch (rawObjectSpriteRulePosition) {
        case constants_1.SPRITE_RULE_DIRECTION_UP:
        case constants_1.SPRITE_RULE_DIRECTION_UP_RIGHT:
        case constants_1.SPRITE_RULE_DIRECTION_RIGHT:
        case constants_1.SPRITE_RULE_DIRECTION_DOWN_RIGHT:
        case constants_1.SPRITE_RULE_DIRECTION_DOWN:
        case constants_1.SPRITE_RULE_DIRECTION_DOWN_LEFT:
        case constants_1.SPRITE_RULE_DIRECTION_LEFT:
        case constants_1.SPRITE_RULE_DIRECTION_UP_LEFT:
            objectSpriteRulePosition = rawObjectSpriteRulePosition;
            break;
        default:
            break;
    }
    return objectSpriteRulePosition;
}
exports.toObjectSpriteRulePosition = toObjectSpriteRulePosition;
function toStageJumpCondition(rawStageJumpCondition) {
    var stageJumpCondition = undefined;
    switch (rawStageJumpCondition) {
        case constants_1.STAGE_JUMP_CONDITION_TIME:
        case constants_1.STAGE_JUMP_CONDITION_HARVEST:
            stageJumpCondition = rawStageJumpCondition;
            break;
        default:
            break;
    }
    return stageJumpCondition;
}
exports.toStageJumpCondition = toStageJumpCondition;
function toSpawningCondition(rawSpawningCondition) {
    var spawningCondition = undefined;
    switch (rawSpawningCondition) {
        case constants_1.FARMLAND_CONDITION:
        case constants_1.EMPTY_GROUND_CONDITION:
        case constants_1.INSIDE_CONDITION:
            spawningCondition = rawSpawningCondition;
            break;
        default:
            break;
    }
    return spawningCondition;
}
exports.toSpawningCondition = toSpawningCondition;
function toInventoryType(rawInventoryType) {
    var inventoryType = undefined;
    switch (rawInventoryType) {
        case constants_1.INVENTORY_TYPE_NONE:
        case constants_1.INVENTORY_TYPE_SMALL:
        case constants_1.INVENTORY_TYPE_LARGE:
            inventoryType = rawInventoryType;
            break;
        default:
            break;
    }
    return inventoryType;
}
exports.toInventoryType = toInventoryType;
function toFilledFromType(rawFilledFromType) {
    var filledFromType = undefined;
    switch (rawFilledFromType) {
        case constants_1.FILLED_FROM_TYPE_NONE:
        case constants_1.FILLED_FROM_TYPE_WATER:
        case constants_1.FILLED_FROM_TYPE_SAND:
            filledFromType = rawFilledFromType;
            break;
        default:
            break;
    }
    return filledFromType;
}
exports.toFilledFromType = toFilledFromType;
function toTimeComparator(rawTimeComparator) {
    var timeComparator = undefined;
    switch (rawTimeComparator) {
        case constants_1.TIME_COMPARATOR_BEFORE:
        case constants_1.TIME_COMPARATOR_AFTER:
        case constants_1.TIME_COMPARATOR_BETWEEN:
            timeComparator = rawTimeComparator;
            break;
        default:
            break;
    }
    return timeComparator;
}
exports.toTimeComparator = toTimeComparator;
function toWeaponType(rawWeaponType) {
    var weaponType = undefined;
    switch (rawWeaponType) {
        case constants_1.WEAPON_TYPE_NONE:
        case constants_1.WEAPON_TYPE_POINT:
        case constants_1.WEAPON_TYPE_ARC:
        case constants_1.WEAPON_TYPE_PROJECTILE_LAUNCHER:
        case constants_1.WEAPON_TYPE_PROJECTILE:
            weaponType = rawWeaponType;
            break;
        default:
            break;
    }
    return weaponType;
}
exports.toWeaponType = toWeaponType;
function toFishingItemType(rawFishingItemType) {
    var fishingItemType = undefined;
    switch (rawFishingItemType) {
        case constants_1.FISHING_ITEM_TYPE_NONE:
        case constants_1.FISHING_ITEM_TYPE_POLE:
        case constants_1.FISHING_ITEM_TYPE_LURE:
        case constants_1.FISHING_ITEM_TYPE_FISH:
            fishingItemType = rawFishingItemType;
            break;
        default:
            break;
    }
    return fishingItemType;
}
exports.toFishingItemType = toFishingItemType;
function toSeason(rawSeason) {
    var season = undefined;
    switch (rawSeason) {
        case constants_1.SPRING:
        case constants_1.SUMMER:
        case constants_1.FALL:
        case constants_1.WINTER:
        case constants_1.ALL_SEASONS:
            season = rawSeason;
            break;
        default:
            break;
    }
    return season;
}
exports.toSeason = toSeason;
function toQuestObjectiveType(rawQuestObjectiveType) {
    var questObjectiveType = undefined;
    switch (rawQuestObjectiveType) {
        case constants_1.QUEST_OBJECTIVE_TYPE_GATHER:
        case constants_1.QUEST_OBJECTIVE_TYPE_CRAFT:
        case constants_1.QUEST_OBJECTIVE_TYPE_DESTINATION:
        case constants_1.QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE:
            questObjectiveType = rawQuestObjectiveType;
            break;
        default:
            break;
    }
    return questObjectiveType;
}
exports.toQuestObjectiveType = toQuestObjectiveType;
function toQuestCompletionTrigger(rawQuestCompletionTrigger) {
    var questCompletionTrigger = undefined;
    switch (rawQuestCompletionTrigger) {
        case constants_1.QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE:
        case constants_1.QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE:
            questCompletionTrigger = rawQuestCompletionTrigger;
            break;
        default:
            break;
    }
    return questCompletionTrigger;
}
exports.toQuestCompletionTrigger = toQuestCompletionTrigger;
function toQuestSource(rawQuestSource) {
    var questSource = undefined;
    switch (rawQuestSource) {
        case constants_1.QUEST_SOURCE_CREATURE:
        case constants_1.QUEST_SOURCE_AUTO_START:
            questSource = rawQuestSource;
            break;
        default:
            break;
    }
    return questSource;
}
exports.toQuestSource = toQuestSource;
function toGroundType(rawGroundType) {
    var groundType = undefined;
    switch (rawGroundType) {
        case constants_1.GROUND_TYPE_GRASS:
        case constants_1.GROUND_TYPE_SAND:
        case constants_1.GROUND_TYPE_FARMLAND:
        case constants_1.GROUND_TYPE_INSIDE:
            groundType = rawGroundType;
            break;
        default:
            break;
    }
    return groundType;
}
exports.toGroundType = toGroundType;
function toProcessedRawObjectSettings(rawObjectSettings) {
    var _a, _b, _c, _d, _e, _f, _g;
    if ((0, null_util_1.isNullish)(rawObjectSettings)) {
        return {};
    }
    return __assign(__assign({}, rawObjectSettings), { lootType: fromNullish(rawObjectSettings.lootType), hasHealth: fromNullish(rawObjectSettings.hasHealth), requiresWater: fromNullish(rawObjectSettings.requiresWater), stagesType: fromNullish(rawObjectSettings.stagesType), isWorkstation: fromNullish(rawObjectSettings.isWorkstation), placementPosition: fromNullish(rawObjectSettings.placementPosition), placementLayer: fromNullish(rawObjectSettings.placementLayer), blocksPlacement: fromNullish(rawObjectSettings.blocksPlacement), requiredBelowObjectCategoryKeys: (_a = fromNullish(rawObjectSettings.requiredBelowObjectCategoryKeys)) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), requiredBelowObjectSubCategoryKeys: (_b = fromNullish(rawObjectSettings.requiredBelowObjectSubCategoryKeys)) === null || _b === void 0 ? void 0 : _b.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), requiredBelowObjectKeys: (_c = fromNullish(rawObjectSettings.requiredBelowObjectKeys)) === null || _c === void 0 ? void 0 : _c.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), requiredAdjacentObjectCategoryKeys: (_d = fromNullish(rawObjectSettings.requiredAdjacentObjectCategoryKeys)) === null || _d === void 0 ? void 0 : _d.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), requiredAdjacentObjectSubCategoryKeys: (_e = fromNullish(rawObjectSettings.requiredAdjacentObjectSubCategoryKeys)) === null || _e === void 0 ? void 0 : _e.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), requiredAdjacentObjectKeys: (_f = fromNullish(rawObjectSettings.requiredAdjacentObjectKeys)) === null || _f === void 0 ? void 0 : _f.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), spawningConditions: (_g = fromNullish(rawObjectSettings.spawningConditions)) === null || _g === void 0 ? void 0 : _g.map(function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), destroyOnHarvest: fromNullish(rawObjectSettings.destroyOnHarvest), canHarvestWithHand: fromNullish(rawObjectSettings.canHarvestWithHand), breakable: fromNullish(rawObjectSettings.breakable), isPlayerDestructible: fromNullish(rawObjectSettings.isPlayerDestructible), inventoryType: fromNullish(rawObjectSettings.inventoryType), canOpen: fromNullish(rawObjectSettings.canOpen), canActivate: fromNullish(rawObjectSettings.canActivate), changesSpritesWithSeason: fromNullish(rawObjectSettings.changesSpritesWithSeason), hasLight: fromNullish(rawObjectSettings === null || rawObjectSettings === void 0 ? void 0 : rawObjectSettings.hasLight), fadesWhenPlayerBehind: fromNullish(rawObjectSettings.fadesWhenPlayerBehind) });
}
exports.toProcessedRawObjectSettings = toProcessedRawObjectSettings;
function toObjectSettings(processedRawObjectSettings) {
    if (!processedRawObjectSettings) {
        return undefined;
    }
    return __assign(__assign({}, processedRawObjectSettings), { lootType: toLootType(processedRawObjectSettings.lootType), stagesType: toStagesType(processedRawObjectSettings.stagesType), placementPosition: toPlacementPosition(processedRawObjectSettings.placementPosition), placementLayer: toPlacementLayer(processedRawObjectSettings.placementLayer), spawningConditions: toTypedArray(processedRawObjectSettings.spawningConditions, toSpawningCondition), inventoryType: toInventoryType(processedRawObjectSettings.inventoryType) });
}
exports.toObjectSettings = toObjectSettings;
function toProcessedRawItemSettings(rawItemSettings) {
    return __assign(__assign({}, rawItemSettings), { placeable: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.placeable), requiredObjectCategoryKey: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.requiredObjectCategoryKey), watersGround: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.watersGround), createsFarmland: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.createsFarmland), destroysFarmland: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.destroysFarmland), weaponType: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.weaponType), damagesObjectCategoryKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.damagesObjectCategoryKeys, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), damagesObjectSubCategoryKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.damagesObjectSubCategoryKeys, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), damagesObjectKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.damagesObjectKeys, function (objectKey) { return objectKey !== null && objectKey !== void 0 ? objectKey : ''; }), damagesCreatureCategoryKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.damagesCreatureCategoryKeys, function (objectKey) { return objectKey !== null && objectKey !== void 0 ? objectKey : ''; }), damagesCreatureKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.damagesCreatureKeys, function (objectKey) { return objectKey !== null && objectKey !== void 0 ? objectKey : ''; }), hasDurability: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.hasDurability), isEdible: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.isEdible), filledFromType: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.filledFromType), hasLight: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.hasLight), hasCombatPriority: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.hasCombatPriority), resetTriggerOnAttack: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.resetTriggerOnAttack), projectileItemCategoryKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.projectileItemCategoryKeys, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), projectileItemKeys: fromNullishArray(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.projectileItemKeys, function (entry) { return entry !== null && entry !== void 0 ? entry : ''; }), fishingItemType: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.fishingItemType), creatureDamageIncreasedBySkillKey: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.creatureDamageIncreasedBySkillKey), objectDamageIncreasedBySkillKey: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.objectDamageIncreasedBySkillKey), launcherDamageIncreasedBySkillKey: fromNullish(rawItemSettings === null || rawItemSettings === void 0 ? void 0 : rawItemSettings.launcherDamageIncreasedBySkillKey) });
}
exports.toProcessedRawItemSettings = toProcessedRawItemSettings;
function toItemSettings(processedRawItemSettings) {
    if (!processedRawItemSettings) {
        return undefined;
    }
    return __assign(__assign({}, processedRawItemSettings), { filledFromType: toFilledFromType(processedRawItemSettings === null || processedRawItemSettings === void 0 ? void 0 : processedRawItemSettings.filledFromType), weaponType: toWeaponType(processedRawItemSettings === null || processedRawItemSettings === void 0 ? void 0 : processedRawItemSettings.weaponType), fishingItemType: toFishingItemType(processedRawItemSettings === null || processedRawItemSettings === void 0 ? void 0 : processedRawItemSettings.fishingItemType) });
}
exports.toItemSettings = toItemSettings;
function toProcessedRawCreatureSettings(rawCreatureSettings) {
    if ((0, null_util_1.isNullish)(rawCreatureSettings)) {
        return {};
    }
    return __assign(__assign({}, rawCreatureSettings), { hasDialogue: fromNullish(rawCreatureSettings.hasDialogue), isShopkeeper: fromNullish(rawCreatureSettings.isShopkeeper), hasHealth: fromNullish(rawCreatureSettings.hasHealth), movementType: fromNullish(rawCreatureSettings.movementType), neutral: fromNullish(rawCreatureSettings.neutral), attackType: fromNullish(rawCreatureSettings.attackType) });
}
exports.toProcessedRawCreatureSettings = toProcessedRawCreatureSettings;
function toCreatureSettings(processedRawCreatureSettings) {
    if (!processedRawCreatureSettings) {
        return undefined;
    }
    return __assign(__assign({}, processedRawCreatureSettings), { movementType: toMovementType(processedRawCreatureSettings.movementType), attackType: toAttackType(processedRawCreatureSettings.attackType) });
}
exports.toCreatureSettings = toCreatureSettings;
function toMovementType(rawMovementType) {
    var movementType = undefined;
    switch (rawMovementType) {
        case constants_1.MOVEMENT_TYPE_JUMP:
        case constants_1.MOVEMENT_TYPE_WALK:
            movementType = rawMovementType;
            break;
        default:
            break;
    }
    return movementType;
}
exports.toMovementType = toMovementType;
function toAttackType(rawAttackType) {
    var attackType = undefined;
    switch (rawAttackType) {
        case constants_1.ATTACK_TYPE_NONE:
        case constants_1.ATTACK_TYPE_TOUCH:
        case constants_1.ATTACK_TYPE_ARC:
            attackType = rawAttackType;
            break;
        default:
            break;
    }
    return attackType;
}
exports.toAttackType = toAttackType;
function toVector2(rawVector, defaultValue) {
    var _a, _b, _c, _d;
    return rawVector
        ? {
            x: (_b = (_a = rawVector === null || rawVector === void 0 ? void 0 : rawVector.x) !== null && _a !== void 0 ? _a : defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.x) !== null && _b !== void 0 ? _b : 0,
            y: (_d = (_c = rawVector === null || rawVector === void 0 ? void 0 : rawVector.y) !== null && _c !== void 0 ? _c : defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.y) !== null && _d !== void 0 ? _d : 0
        }
        : defaultValue;
}
exports.toVector2 = toVector2;
function toFishingPoleAnchorPoints(raw) {
    return raw
        ? {
            idle: toVector2(raw.idle, { x: 0, y: 0 }),
            casting: toVector2(raw.casting, { x: 0, y: 0 }),
            pulling: toVector2(raw.pulling, { x: 0, y: 0 })
        }
        : undefined;
}
exports.toFishingPoleAnchorPoints = toFishingPoleAnchorPoints;
function fromNullish(input) {
    return (0, null_util_1.isNullish)(input) ? undefined : input;
}
exports.fromNullish = fromNullish;
function fromNullishArray(input, converter) {
    var _a;
    return (_a = fromNullish(input)) === null || _a === void 0 ? void 0 : _a.map(function (entry) { return converter(entry); });
}
exports.fromNullishArray = fromNullishArray;
function fromNullishRecord(input, converter) {
    var rawRecord = fromNullish(input);
    if (!rawRecord) {
        return undefined;
    }
    return Object.keys(rawRecord).reduce(function (record, key) {
        record[key] = converter(rawRecord[key]);
        return record;
    }, {});
}
exports.fromNullishRecord = fromNullishRecord;
function toTypedArray(input, converter) {
    if (!input) {
        return undefined;
    }
    return input.reduce(function (values, rawValue) {
        var value = converter(rawValue);
        if (value) {
            values.push(value);
        }
        return values;
    }, []);
}
exports.toTypedArray = toTypedArray;
function toTypedKeyRecord(input, converter) {
    if (!input) {
        return undefined;
    }
    return Object.keys(input).reduce(function (map, key) {
        var newKey = converter(key);
        if (newKey) {
            map[newKey] = input[key];
        }
        return map;
    }, {});
}
exports.toTypedKeyRecord = toTypedKeyRecord;
function mapTypedKeyRecord(input, converter) {
    return Object.keys(input).reduce(function (map, key) {
        map[key] = converter(input[key]);
        return map;
    }, {});
}
exports.mapTypedKeyRecord = mapTypedKeyRecord;
