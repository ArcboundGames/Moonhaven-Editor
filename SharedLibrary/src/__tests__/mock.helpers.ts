import type {
  CreatureCategory,
  CreatureType,
  ItemCategory,
  ItemType,
  ObjectCategory,
  ObjectSubCategory,
  ObjectType
} from '../interface';

/**
 * Creates a mock CreatureType with all required fields populated.
 * Override any field via the partial parameter.
 */
export function mockCreatureType(overrides: Partial<CreatureType> = {}): CreatureType {
  return {
    id: 1,
    key: 'MOCK_CREATURE',
    categoryKey: 'MOCK_CATEGORY',
    health: 50,
    experience: 10,
    sprite: { width: 16, height: 16 },
    walkSpeed: 1,
    runSpeed: 2,
    jumpMinWaitTime: 0,
    jumpMaxWaitTime: 0,
    jumpMoveStartSpriteIndex: 0,
    jumpMoveEndSpriteIndex: 0,
    jumpMinDistance: 0,
    jumpMaxDistance: 0,
    wanderBehaviorEnabled: false,
    wanderTime: 0,
    wanderRadius: 0,
    wanderUseCustomAnchor: false,
    wanderUseSpawnAnchor: false,
    wanderAnchor: { x: 0, y: 0 },
    wanderUseHardLeash: false,
    wanderHardLeashRange: 0,
    dangerBehaviorEnabled: false,
    dangerRadius: 0,
    dangerTolerance: 0,
    dangerFromPlayers: false,
    dangerCreatureCategoryKeys: [],
    dangerCreatureKeys: [],
    attackBehaviorEnabled: false,
    attackRadius: 0,
    attackDesiredRangeMin: 0,
    attackDesiredRangeMax: 0,
    attackTargetPlayers: false,
    attackTargetCreatureCategoryKeys: [],
    attackTargetCreatureKeys: [],
    attackUseStrafing: false,
    attackStrafingTimeMin: 0,
    attackStrafingTimeMax: 0,
    attackDamage: 0,
    attackKnockbackModifier: 0,
    randomSpawnsEnabled: false,
    spawnDistanceMinFromPlayers: 0,
    spawnDistanceMaxFromPlayers: 0,
    despawnDistanceFromPlayers: 0,
    spawnDeadZoneRadius: 0,
    maxPopulation: 0,
    campSpawns: [],
    ...overrides
  };
}

/**
 * Creates a mock CreatureCategory with all required fields populated.
 */
export function mockCreatureCategory(overrides: Partial<CreatureCategory> = {}): CreatureCategory {
  return {
    key: 'MOCK_CREATURE_CATEGORY',
    ...overrides
  };
}

/**
 * Creates a mock ItemType with all required fields populated.
 * Override any field via the partial parameter.
 */
export function mockItemType(overrides: Partial<ItemType> = {}): ItemType {
  return {
    id: 1,
    key: 'MOCK_ITEM',
    maxStackSize: 1,
    creatureDamage: 0,
    objectDamage: 0,
    launcherDamage: 0,
    durability: 0,
    hungerIncrease: 0,
    thirstIncrease: 0,
    energyIncrease: 0,
    filledLevel: 0,
    sellPrice: 0,
    damageArcRadius: 0,
    projectileSpeed: 0,
    projectileDistance: 0,
    fishExperience: 0,
    ...overrides
  };
}

/**
 * Creates a mock ItemCategory with all required fields populated.
 */
export function mockItemCategory(overrides: Partial<ItemCategory> = {}): ItemCategory {
  return {
    key: 'MOCK_ITEM_CATEGORY',
    ...overrides
  };
}

/**
 * Creates a mock ObjectType with all required fields populated.
 * Override any field via the partial parameter.
 */
export function mockObjectType(overrides: Partial<ObjectType> = {}): ObjectType {
  return {
    id: 1,
    key: 'MOCK_OBJECT',
    health: 0,
    sprite: { defaultSprite: 0, width: 16, height: 16 },
    expireChance: 0,
    worldSize: { x: 1, y: 1 },
    experience: 0,
    ...overrides
  };
}

/**
 * Creates a mock ObjectCategory with all required fields populated.
 */
export function mockObjectCategory(overrides: Partial<ObjectCategory> = {}): ObjectCategory {
  return {
    key: 'MOCK_OBJECT_CATEGORY',
    ...overrides
  };
}

/**
 * Creates a mock ObjectSubCategory with all required fields populated.
 */
export function mockObjectSubCategory(overrides: Partial<ObjectSubCategory> = {}): ObjectSubCategory {
  return {
    key: 'MOCK_SUB_CATEGORY',
    ...overrides
  };
}
