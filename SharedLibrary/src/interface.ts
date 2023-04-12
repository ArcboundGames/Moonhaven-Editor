import type {
  ALL_SEASONS,
  CRAFTING_RECIPES_DATA_FILE,
  CREATURES_DATA_FILE,
  DIALOGUE_DATA_FILE,
  ERROR_SECTION_CRAFTING_RECIPES,
  ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES,
  ERROR_SECTION_CREATURES,
  ERROR_SECTION_CREATURE_CATEGORIES,
  ERROR_SECTION_DIALOGUE_TREES,
  ERROR_SECTION_FISHING_ZONES,
  ERROR_SECTION_ITEMS,
  ERROR_SECTION_ITEM_CATEGORIES,
  ERROR_SECTION_LOCALIZATIONS,
  ERROR_SECTION_LOCALIZATION_KEYS,
  ERROR_SECTION_OBJECTS,
  ERROR_SECTION_OBJECT_CATEGORIES,
  ERROR_SECTION_OBJECT_SUB_CATEGORIES,
  ERROR_SECTION_PLAYER_LEVELS,
  ERROR_SECTION_PLAYER_STARTING_ITEMS,
  ERROR_SECTION_PLAYER_STATS,
  ERROR_SECTION_PLAYER_WORLD_WEATHER,
  ERROR_SECTION_QUESTS,
  ERROR_SECTION_SKILLS,
  ERROR_SECTION_UI_OBJECT_DESTRUCTION_MENU,
  EVENTS_DATA_FILE,
  FISHING_DATA_FILE,
  ITEMS_DATA_FILE,
  LOCALIZATION_DATA_FILE,
  LOOT_TABLES_DATA_FILE,
  OBJECTS_DATA_FILE,
  PLAYER_DATA_FILE,
  QUESTS_DATA_FILE,
  SKILLS_DATA_FILE,
  UI_DATA_FILE,
  WORLD_DATA_FILE
} from './constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepNullish<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepNullish<T[P]> | null } : T;

export interface GameData {
  creatures: CreatureType[];
  creaturesByKey: Record<string, CreatureType>;
  creatureCategories: CreatureCategory[];
  creatureCategoriesByKey: Record<string, CreatureCategory>;
  items: ItemType[];
  itemsById: Record<number, ItemType>;
  itemsByKey: Record<string, ItemType>;
  itemCategories: ItemCategory[];
  itemCategoriesByKey: Record<string, ItemCategory>;
  lootTables: LootTable[];
  lootTablesByKey: Record<string, LootTable>;
  craftingRecipeCategories: CraftingRecipeCategory[];
  craftingRecipeCategoriesByKey: Record<string, CraftingRecipeCategory>;
  craftingRecipes: CraftingRecipe[];
  craftingRecipesByKey: Record<string, CraftingRecipe>;
  craftingRecipesByCategory: Record<string, CraftingRecipe[]>;
  objects: ObjectType[];
  objectsByKey: Record<string, ObjectType>;
  objectCategories: ObjectCategory[];
  objectCategoriesByKey: Record<string, ObjectCategory>;
  objectSubCategories: ObjectSubCategory[];
  objectSubCategoriesByKey: Record<string, ObjectSubCategory>;
  playerData: PlayerData;
  ui: UiDataFile;
  dialogueTrees: DialogueTree[];
  dialogueTreesByKey: Record<string, DialogueTree>;
  eventLogs: EventLog[];
  eventLogsById: Record<number, EventLog>;
  worldData: WorldSettings;
  fishingZones: FishingZone[];
  fishingZonesById: Record<number, FishingZone>;
  skills: Skill[];
  skillsById: Record<number, Skill>;
}

export interface AllErrors {
  [CREATURES_DATA_FILE]?: {
    [ERROR_SECTION_CREATURES]?: Record<string, string[]>;
    [ERROR_SECTION_CREATURE_CATEGORIES]?: Record<string, string[]>;
  };
  [ITEMS_DATA_FILE]?: {
    [ERROR_SECTION_ITEMS]?: Record<string, string[]>;
    [ERROR_SECTION_ITEM_CATEGORIES]?: Record<string, string[]>;
  };
  [OBJECTS_DATA_FILE]?: {
    [ERROR_SECTION_OBJECT_CATEGORIES]?: Record<string, string[]>;
    [ERROR_SECTION_OBJECT_SUB_CATEGORIES]?: Record<string, string[]>;
    [ERROR_SECTION_OBJECTS]?: Record<string, string[]>;
  };
  [CRAFTING_RECIPES_DATA_FILE]?: {
    [ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES]?: Record<string, string[]>;
    [ERROR_SECTION_CRAFTING_RECIPES]?: Record<string, string[]>;
  };
  [LOOT_TABLES_DATA_FILE]?: Record<string, string[]>;
  [PLAYER_DATA_FILE]?: {
    [ERROR_SECTION_PLAYER_STATS]?: string[];
    [ERROR_SECTION_PLAYER_STARTING_ITEMS]?: string[];
    [ERROR_SECTION_PLAYER_LEVELS]?: string[];
  };
  [UI_DATA_FILE]?: {
    [ERROR_SECTION_UI_OBJECT_DESTRUCTION_MENU]?: string[];
  };
  [DIALOGUE_DATA_FILE]?: {
    [ERROR_SECTION_DIALOGUE_TREES]?: Record<string, string[]>;
  };
  [EVENTS_DATA_FILE]?: Record<string, string[]>;
  [WORLD_DATA_FILE]?: {
    [ERROR_SECTION_PLAYER_WORLD_WEATHER]?: string[];
  };
  [FISHING_DATA_FILE]?: {
    [ERROR_SECTION_FISHING_ZONES]?: Record<string, string[]>;
  };
  [SKILLS_DATA_FILE]?: {
    [ERROR_SECTION_SKILLS]?: Record<string, string[]>;
  };
  [LOCALIZATION_DATA_FILE]?: {
    [ERROR_SECTION_LOCALIZATION_KEYS]?: Record<string, string[]>;
    [ERROR_SECTION_LOCALIZATIONS]?: Record<string, string[]>;
  };
  [QUESTS_DATA_FILE]?: {
    [ERROR_SECTION_QUESTS]?: Record<string, string[]>;
  };
}

export type Section =
  | 'creature'
  | 'creature-category'
  | 'object'
  | 'object-category'
  | 'object-sub-category'
  | 'item'
  | 'item-category'
  | 'loot-table'
  | 'crafting-recipe'
  | 'crafting-recipe-category'
  | 'starting-item'
  | 'ui'
  | 'dialogue-tree'
  | 'player-data'
  | 'event-log'
  | 'world-settings'
  | 'fishing-zone'
  | 'skill'
  | 'localization-key'
  | 'localization'
  | 'quest';

export interface ItemDataFile {
  categories?: (RawItemCategory | undefined | null)[] | null;
  items?: (RawItemType | undefined | null)[] | null;
}

export type RawItemType = DeepNullish<ItemType>;
export interface ProcessedRawItemType extends Omit<ItemType, 'key' | 'settings' | 'filledFromType'> {
  key?: string;

  filledFromType?: string;
  settings?: ProcessedRawItemSettings;
}

export interface LocalizedItemType extends ItemType {
  name: string;
}

export interface ItemType {
  id: number;
  key: string;
  maxStackSize: number;
  categoryKey?: string;
  objectTypeKey?: string;
  damage: number;
  durability: number;
  hungerIncrease: number;
  thirstIncrease: number;
  energyIncrease: number;
  edibleLeftoverItemTypeKey?: string;
  filledLevel: number;
  filledItemTypeKey?: string;
  sellPrice: number;
  lightLevel?: number;
  lightPosition?: Vector2;
  animationSampleRate?: number;

  // Arc
  damageArcRadius: number;

  // Projectile
  projectileSpeed: number;
  projectileDistance: number;

  settings?: ItemSettings;

  // Fishing - Pole
  fishingPoleAnchorPointsNorth?: FishingPoleAnchorPoints;
  fishingPoleAnchorPointsEast?: FishingPoleAnchorPoints;
  fishingPoleAnchorPointsSouth?: FishingPoleAnchorPoints;
  fishingPoleAnchorPointsWest?: FishingPoleAnchorPoints;

  // Fishing - Fish
  fishExperience: number;
}

export interface FishingPoleAnchorPoints {
  idle: Vector2;
  casting: Vector2;
  pulling: Vector2;
}

export type RawItemCategory = DeepNullish<ItemCategory>;
export interface ProcessedRawItemCategory extends Omit<ItemCategory, 'key' | 'settings'> {
  key?: string;

  settings?: ProcessedRawItemSettings;
}

export interface ItemCategory {
  key: string;

  settings?: ItemSettings;
}

export type WeaponType = 'NONE' | 'POINT' | 'ARC' | 'PROJECTILE_LAUNCHER' | 'PROJECTILE';
export type FilledFromType = 'NONE' | 'WATER' | 'SAND';
export type FishingItemType = 'NONE' | 'POLE' | 'LURE' | 'FISH';

export type RawItemSettings = DeepNullish<ProcessedRawItemSettings>;

export interface ProcessedRawItemSettings extends Omit<ItemSettings, 'filledFromType' | 'weaponType' | 'fishingItemType'> {
  weaponType?: string;
  filledFromType?: string;
  fishingItemType?: string;
}

export interface ItemSettings {
  placeable?: boolean;
  requiredObjectCategoryKey?: string;
  watersGround?: boolean;
  createsFarmland?: boolean;
  destroysFarmland?: boolean;
  weaponType?: WeaponType;
  hasCombatPriority?: boolean;
  resetTriggerOnAttack?: boolean;
  damagesObjectCategoryKeys?: string[];
  damagesObjectSubCategoryKeys?: string[];
  damagesObjectKeys?: string[];
  damagesCreatureCategoryKeys?: string[];
  damagesCreatureKeys?: string[];
  hasDurability?: boolean;
  isEdible?: boolean;
  filledFromType?: FilledFromType;
  fishingItemType?: FishingItemType;
  hasLight?: boolean;

  // Projectile Launcher
  projectileItemCategoryKeys?: string[];
  projectileItemKeys?: string[];

  // Skills
  damagedIncreasedBySkillKey?: string;
}

export interface ObjectDataFile {
  categories?: (RawObjectCategory | undefined | null)[] | null;
  subCategories?: (RawObjectSubCategory | undefined | null)[] | null;
  objects?: (RawObjectType | undefined | null)[] | null;
}

export interface RawObjectCategory extends DeepNullish<Omit<ProcessedRawObjectCategory, 'settings' | 'colliders' | 'sprite'>> {
  settings?: RawObjectSettings | null;
  colliders?: (RawCollider | undefined | null)[] | null;
  sprite?: RawObjectCategorySprite | null;
}

export interface ProcessedRawObjectCategory extends Omit<ObjectCategory, 'key' | 'settings' | 'colliders' | 'sprite'> {
  key?: string;
  settings?: ProcessedRawObjectSettings;
  colliders?: ProcessedRawCollider[];
  sprite?: ProcessedRawObjectCategorySprite;
}

export interface ObjectCategory {
  key: string;

  colliders?: Collider[];
  sprite?: ObjectCategorySprite;

  settings?: ObjectSettings;
}

export interface RawObjectCategorySprite {
  sprites?: Record<string, RawSprite | undefined | null> | null;
}

export interface ProcessedRawObjectCategorySprite {
  sprites?: Record<string, ProcessedRawSprite>;
}

export interface ObjectCategorySprite {
  sprites?: Record<string, Sprite>;
}

export interface RawObjectSubCategory
  extends Omit<DeepNullish<ProcessedRawObjectSubCategory>, 'settings' | 'colliders' | 'sprite' | 'rulesets'> {
  settings?: RawObjectSettings | null;
  colliders?: (RawCollider | undefined | null)[] | null;
  sprite?: RawObjectCategorySprite | null;
  rulesets?: (RawObjectSpriteRuleset | undefined | null)[] | null;
}

export interface ProcessedRawObjectSubCategory extends Omit<ObjectSubCategory, 'key' | 'settings' | 'colliders' | 'sprite' | 'rulesets'> {
  key?: string;
  settings?: ProcessedRawObjectSettings;
  colliders?: ProcessedRawCollider[];
  sprite?: ProcessedRawObjectCategorySprite;
  rulesets?: ProcessedRawObjectSpriteRuleset[];
}

export interface ObjectSubCategory extends ObjectCategory {
  categoryKey?: string;
  rulesets?: ObjectSpriteRuleset[];
}

export interface RawObjectSpriteRuleset extends Omit<DeepNullish<ProcessedRawObjectSpriteRuleset>, 'rules'> {
  rules?: (RawObjectSpriteRule | undefined | null)[] | null;
}

export interface ProcessedRawObjectSpriteRuleset extends Omit<DeepNullish<ObjectSpriteRuleset>, 'rules'> {
  rules?: ProcessedRawObjectSpriteRule[];
}

export interface ObjectSpriteRuleset {
  rules?: ObjectSpriteRule[];
  defaultSprite: number;
}

export type RawObjectSpriteRule = DeepNullish<ProcessedRawObjectSpriteRule>;

export interface ProcessedRawObjectSpriteRule extends Omit<ObjectSpriteRule, 'conditions'> {
  conditions?: Record<string, boolean>;
}

export type ObjectSpriteRulePosition = 'UP' | 'UP_RIGHT' | 'RIGHT' | 'DOWN_RIGHT' | 'DOWN' | 'DOWN_LEFT' | 'LEFT' | 'UP_LEFT';

export interface ObjectSpriteRule {
  sprites?: number[];
  conditions?: Record<ObjectSpriteRulePosition, boolean>;
}

export interface RawObjectType extends Omit<DeepNullish<ObjectType>, 'settings' | 'colliders' | 'sprite' | 'stages'> {
  settings?: RawObjectSettings | null;
  colliders?: (RawCollider | undefined | null)[] | null;
  sprite?: RawObjectSprites | null;
  stages?: (RawObjectTypeStage | undefined | null)[] | null;
}

export interface ProcessedRawObjectType extends Omit<ObjectType, 'key' | 'settings' | 'colliders' | 'sprite' | 'stages' | 'season'> {
  key?: string;
  settings?: ProcessedRawObjectSettings;
  colliders?: ProcessedRawCollider[];
  sprite: ProcessedRawObjectSprites;
  stages?: ProcessedRawObjectTypeStage[];
  season?: string;
}

export type StagesType = 'NONE' | 'GROWABLE' | 'GROWABLE_WITH_HEALTH' | 'BREAKABLE';
export type LootType = 'NONE' | 'DROP' | 'STAGE_DROP';
export type PlacementPosition = 'CENTER' | 'EDGE';
export type PlacementLayer = 'IN_GROUND' | 'ON_GROUND' | 'IN_AIR';
export type SpawningCondition = 'FARMLAND' | 'GRASSLAND' | 'INSIDE';
export type AccentType = SpawningCondition;
export type InventoryType = 'NONE' | 'SMALL' | 'LARGE';

export interface LocalizedObjectType extends ObjectType {
  name: string;
}

export interface ObjectType {
  id: number;
  key: string;
  categoryKey?: string;
  subCategoryKey?: string;
  health: number;
  lootTableKey?: string;
  sprite: ObjectSprites;
  stages?: ObjectTypeStage[];
  expireChance: number;
  colliders?: Collider[];
  settings?: ObjectSettings;
  worldSize: Vector2;
  experience: number;
  season?: Season | typeof ALL_SEASONS;
  craftingSpeedIncreaseSkillKey?: string;
  lightLevel?: number;
  lightPosition?: Vector2;
}

export interface RawObjectSprites extends DeepNullish<Omit<ObjectSprites, 'sprites'>> {
  sprites?: Record<string, RawSprite | null> | null;
}

export interface ProcessedRawObjectSprites extends Omit<ObjectSprites, 'sprites'> {
  sprites?: Record<string, ProcessedRawSprite>;
}

export interface ObjectSprites {
  defaultSprite: number;
  width: number;
  height: number;
  pivotOffset?: Vector2;

  sprites?: Record<string, Sprite>;
}

export interface RawSprite extends DeepNullish<Omit<Sprite, 'colliders'>> {
  colliders?: (RawCollider | undefined | null)[];
}

export interface ProcessedRawSprite extends Omit<Sprite, 'colliders' | 'placementLayer'> {
  colliders?: ProcessedRawCollider[];
  placementLayer?: string | undefined;
}

export interface Sprite {
  colliders?: Collider[];
  pivotOffset?: Vector2;
  spriteOffset?: Vector2;
  placementLayer?: PlacementLayer | undefined;
}

export type RawCollider = DeepNullish<ProcessedRawCollider>;

export type ColliderType = 'POLYGON' | 'AUTO_BOX' | 'BOX';

export interface ProcessedRawCollider extends Omit<Collider, 'type'> {
  type?: string;
}

export interface Collider {
  isTrigger: boolean;
  usedByComposite: boolean;
  type?: ColliderType;
  offset?: Vector2;
  size?: Vector2;
  padding?: number;
}

export type RawObjectTypeStage = DeepNullish<ProcessedRawObjectTypeStage>;

export interface ProcessedRawObjectTypeStage extends Omit<ObjectTypeStage, 'jumpCondition'> {
  jumpCondition?: string;
}

export type StageJumpCondition = 'TIME' | 'HARVEST';

export interface ObjectTypeStage {
  growthDays: number;
  health: number;
  lootTableKey?: string;
  threshold: number;
  harvestable: boolean;
  pause: boolean;
  jumpToStage?: number;
  jumpCondition?: StageJumpCondition;
}

export type RawObjectSettings = DeepNullish<ProcessedRawObjectSettings>;

export interface ProcessedRawObjectSettings
  extends Omit<
    ObjectSettings,
    'lootType' | 'stagesType' | 'placementPosition' | 'placementLayer' | 'spawningConditions' | 'inventoryType'
  > {
  lootType?: string;
  stagesType?: string;
  placementPosition?: string;
  placementLayer?: string;
  spawningConditions?: string[];
  inventoryType?: string;
}

export interface ObjectSettings {
  lootType?: LootType;
  hasHealth?: boolean;
  requiresWater?: boolean;
  stagesType?: StagesType;
  isWorkstation?: boolean;
  placementPosition?: PlacementPosition;
  placementLayer?: PlacementLayer;
  destroyOnHarvest?: boolean;
  canHarvestWithHand?: boolean;
  spawningConditions?: SpawningCondition[];
  requiredBelowObjectCategoryKeys?: string[];
  requiredBelowObjectSubCategoryKeys?: string[];
  requiredBelowObjectKeys?: string[];
  requiredAdjacentObjectCategoryKeys?: string[];
  requiredAdjacentObjectSubCategoryKeys?: string[];
  requiredAdjacentObjectKeys?: string[];
  breakable?: boolean;
  inventoryType?: InventoryType;
  canOpen?: boolean;
  changesSpritesWithSeason?: boolean;
  hasLight?: boolean;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface LootTableDataFile {
  lootTables: (RawLootTable | undefined | null)[];
}

export interface RawLootTable extends Omit<ProcessedRawLootTable, 'groups' | 'defaultGroup'> {
  defaultGroup?: RawLootTableComponentGroup | undefined | null;
  groups?: (RawLootTableComponentGroup | undefined | null)[] | undefined | null;
}

export interface ProcessedRawLootTable extends Omit<LootTable, 'key' | 'groups' | 'defaultGroup'> {
  key?: string;
  defaultGroup: ProcessedRawLootTableComponentGroup;
  groups: ProcessedRawLootTableComponentGroup[];
}

export interface LootTable {
  key: string;
  defaultGroup: LootTableComponentGroup;
  groups: LootTableComponentGroup[];
}

export interface RawLootTableComponentGroup extends DeepNullish<Omit<ProcessedRawLootTableComponentGroup, 'components'>> {
  components?: (RawLootTableComponent | undefined | null)[] | undefined | null;
}

export interface ProcessedRawLootTableComponentGroup extends Omit<LootTableComponentGroup, 'components'> {
  components: ProcessedRawLootTableComponent[];
}

export interface LootTableComponentGroup {
  probability: number;
  components: LootTableComponent[];
}

export type RawLootTableComponent = DeepNullish<ProcessedRawLootTableComponent>;

export type ProcessedRawLootTableComponent = LootTableComponent;

export interface LootTableComponent {
  min: number;
  max: number;
  probability: number;
  typeKey?: string;
}

export interface CraftingRecipeDataFile {
  categories?: (RawCraftingRecipeCategory | undefined | null)[] | null;
  recipes?: (RawCraftingRecipe | undefined | null)[] | null;
}

export type RawCraftingRecipeCategory = DeepNullish<CraftingRecipeCategory>;
export interface ProcessedRawCraftingRecipeCategory extends Omit<CraftingRecipeCategory, 'key'> {
  key?: string;
}
export interface CraftingRecipeCategory {
  key: string;
}

export type RawCraftingRecipe = DeepNullish<CraftingRecipe>;
export interface ProcessedRawCraftingRecipe extends Omit<CraftingRecipe, 'key'> {
  key?: string;
}

export interface LocalizedCraftingRecipe extends CraftingRecipe {
  name: string;
}

export interface CraftingRecipe {
  key: string;
  searchCategories?: string[];
  itemTypeKey?: string;
  amount: number;
  hiddenResultsTypeKeys?: string[];
  categoryKey?: string;
  craftingTime: number;
  craftingAttribute?: string;
  workstation?: string;
  ingredients?: Record<string, number>;
  requiredSkillKey?: string;
  requiredSkillLevelKey?: string;
}

/**
 * UI File
 */
export interface RawUiDataFile {
  objectDestructionMenu?: RawDestructionMenu | null;
}

export interface ProcessedRawUiDataFile {
  objectDestructionMenu?: ProcessedRawDestructionMenu;
}

export type UiSection = 'objectDestructionMenu';

export interface UiDataFile {
  objectDestructionMenu?: DestructionMenu;
}

export interface RawDestructionMenu extends DeepNullish<Omit<DestructionMenu, 'buttons'>> {
  buttons?: (RawDestructionMenuButton | undefined | null)[] | null;
}

export interface ProcessedRawDestructionMenu extends Omit<DestructionMenu, 'buttons'> {
  buttons?: ProcessedRawDestructionMenuButton[];
}

export interface DestructionMenu {
  diameter: number;
  buttons?: DestructionMenuButton[];
}

export interface RawDestructionMenuButton
  extends DeepNullish<Omit<DestructionMenuButton, 'placementLayer' | 'categories' | 'subCategories' | 'objects'>> {
  placementLayer?: string | null;
  categories?: RawDestructionMenuButtonConditions;
  subCategories?: RawDestructionMenuButtonConditions;
  objects?: RawDestructionMenuButtonConditions;
}

export interface ProcessedRawDestructionMenuButton extends Omit<DestructionMenuButton, 'placementLayer'> {
  placementLayer?: string;
}

export interface DestructionMenuButton {
  placementLayer?: PlacementLayer;
  categories?: DestructionMenuButtonConditions;
  subCategories?: DestructionMenuButtonConditions;
  objects?: DestructionMenuButtonConditions;
}

export type RawDestructionMenuButtonConditions = DeepNullish<DestructionMenuButtonConditions>;

export interface DestructionMenuButtonConditions {
  include?: string[];
  exclude?: string[];
}

//#region Creatures
export interface CreatureDataFile {
  categories?: (RawCreatureCategory | undefined | null)[] | null;
  creatures?: (RawCreatureType | undefined | null)[] | null;
}

export interface RawCreatureType
  extends DeepNullish<Omit<ProcessedRawCreatureType, 'colliders' | 'sprite' | 'settings' | 'shop' | 'campSpawns'>> {
  colliders?: (RawCollider | undefined | null)[] | null;
  sprite?: RawCreatureSprites | null;

  shop?: RawCreatureShop | null;

  settings?: RawCreatureSettings;

  campSpawns?: (RawCampSpawn | undefined | null)[] | null;
}

export interface ProcessedRawCreatureType extends Omit<CreatureType, 'key' | 'colliders' | 'sprite' | 'settings' | 'shop' | 'campSpawns'> {
  key?: string;
  colliders?: ProcessedRawCollider[];
  sprite: ProcessedRawCreatureSprites;

  shop?: ProcessedRawCreatureShop;

  settings?: ProcessedRawCreatureSettings;

  campSpawns: ProcessedRawCampSpawn[];
}

export interface LocalizedCreatureType extends CreatureType {
  name: string;
}

export interface CreatureType {
  id: number;
  key: string;

  categoryKey?: string;
  sprite: CreatureSprites;
  colliders?: Collider[];
  shop?: CreatureShop;

  health: number;
  lootTableKey?: string;
  experience: number;

  settings?: CreatureSettings;

  // Behavior
  walkSpeed: number;
  runSpeed: number;

  wanderBehaviorEnabled: boolean;
  wanderTime: number;
  wanderRadius: number;
  wanderUseCustomAnchor: boolean;
  wanderUseSpawnAnchor: boolean;
  wanderAnchor: Vector2;
  wanderUseHardLeash: boolean;
  wanderHardLeashRange: number;

  dangerBehaviorEnabled: boolean;
  dangerRadius: number;
  dangerTolerance: number;
  dangerFromPlayers: boolean;
  dangerCreatureCategoryKeys: string[];
  dangerCreatureKeys: string[];

  attackBehaviorEnabled: boolean;
  attackRadius: number;
  attackDesiredRangeMin: number;
  attackDesiredRangeMax: number;
  attackTargetPlayers: boolean;
  attackTargetCreatureCategoryKeys: string[];
  attackTargetCreatureKeys: string[];
  attackUseStrafing: boolean;
  attackStrafingTimeMin: number;
  attackStrafingTimeMax: number;

  // Spawning
  randomSpawnsEnabled: boolean;
  spawnDistanceFromPlayers: number;
  maxPopulation: number;

  campSpawns: CampSpawn[];
}

export type RawCampSpawn = DeepNullish<ProcessedRawCampSpawn>;

export type ProcessedRawCampSpawn = CampSpawn;

export interface CampSpawn {
  position: Vector2;
  maxPopulation: number;
}

export type RawCreatureShop = DeepNullish<ProcessedRawCreatureShop>;

export type ProcessedRawCreatureShop = CreatureShop;

export interface CreatureShop {
  openingEvent?: string;
  prices: Record<string, number>;
  openTimes: number[];
  closeTimes: number[];
}

export type RawCreatureSettings = DeepNullish<ProcessedRawCreatureSettings>;

export type ProcessedRawCreatureSettings = CreatureSettings;

export interface CreatureSettings {
  hasDialogue?: boolean;
  isShopkeeper?: boolean;
  hasHealth?: boolean;
}

export interface RawCreatureSprites extends DeepNullish<Omit<CreatureSprites, 'sprites'>> {
  sprites?: Record<string, RawSprite | null | undefined> | null | undefined;
}

export interface ProcessedRawCreatureSprites extends Omit<CreatureSprites, 'sprites'> {
  sprites?: Record<string, ProcessedRawSprite>;
}

export interface CreatureSprites {
  width: number;
  height: number;
  pivotOffset?: Vector2;

  sprites?: Record<string, Sprite>;
}

export interface RawCreatureCategory extends DeepNullish<Omit<CreatureCategory, 'settings'>> {
  settings?: RawCreatureSettings;
}

export interface ProcessedRawCreatureCategory extends Omit<CreatureCategory, 'key' | 'settings'> {
  key?: string;

  settings?: ProcessedRawCreatureSettings;
}

export interface CreatureCategory {
  key: string;

  settings?: CreatureSettings;
}

//#endregion

//#region Dialogue

export interface DialogueDataFile {
  dialogueTrees?: (RawDialogueTree | undefined | null)[] | null;
}

export interface RawDialogueTree extends DeepNullish<Omit<ProcessedRawDialogueTree, 'dialogues' | 'conditions'>> {
  conditions?: RawDialogueConditions | undefined | null;
  dialogues?: (RawDialogue | undefined | null)[] | undefined | null;
}

export interface ProcessedRawDialogueTree extends Omit<DialogueTree, 'key' | 'dialogues' | 'conditions'> {
  key?: string;
  conditions?: ProcessedRawDialogueConditions;
  dialogues: ProcessedRawDialogue[];
}

export interface DialogueTree {
  id: number;
  key: string;

  creatureKey?: string;

  conditions?: DialogueConditions;
  dialogues: Dialogue[];

  startingDialogueId: number;
  priority: number;
  runOnlyOnce: boolean;
  completionEvent?: string;
}

export type TimeComparator = 'BEFORE' | 'AFTER' | 'BETWEEN';

export type RawDialogueConditions = DeepNullish<ProcessedRawDialogueConditions>;

export interface ProcessedRawDialogueConditions extends Omit<DialogueConditions, 'timesComparator'> {
  timesComparator?: string;
}

export interface DialogueConditions {
  days?: number[];
  times?: number[];
  timesComparator?: TimeComparator;
}

export interface RawDialogue extends DeepNullish<Omit<ProcessedRawDialogue, 'responses'>> {
  responses?: (RawDialogueResponse | undefined | null)[] | undefined | null;
}

export interface ProcessedRawDialogue extends Omit<Dialogue, 'key' | 'responses'> {
  key?: string;
  responses: ProcessedRawDialogueResponse[];
}

export interface Dialogue {
  id: number;
  key: string;

  responses: DialogueResponse[];
  nextDialogId?: number;
}

export type RawDialogueResponse = DeepNullish<ProcessedRawDialogueResponse>;

export interface ProcessedRawDialogueResponse extends Omit<DialogueResponse, 'key'> {
  key?: string;
}

export interface DialogueResponse {
  id: number;
  key: string;

  nextDialogId?: number;
}

export type Season = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';

/**
 * Player Data
 */
export type RawPlayerData = DeepNullish<ProcessedRawPlayerData>;

export type ProcessedRawPlayerData = PlayerData;

export interface PlayerData {
  health: number;
  healthMax: number;
  healthDepletionTime: number;
  healthRefillTime: number;
  healthRefillHungerDepletionRate: number;
  healthRefillThirstDepletionRate: number;
  hunger: number;
  hungerMax: number;
  hungerInitialDelay: number;
  hungerMaxedOutDelay: number;
  hungerDepletionRate: number;
  thirst: number;
  thirstMax: number;
  thirstInitialDelay: number;
  thirstMaxedOutDelay: number;
  thirstDepletionRate: number;
  energy: number;
  energyMax: number;
  energyBaseUsageRate: number;
  energyRefillRate: number;
  energyRefillHungerDepletionRate: number;
  energyRefillThirstDepletionRate: number;
  money: number;
  startingItems: Record<string, number>;
  nextLevelExp: number[];
}

/**
 * Event Log
 */
export interface EventsFile {
  eventLogs?: (RawEventLog | undefined | null)[] | null;
}

export type RawEventLog = DeepNullish<ProcessedRawEventLog>;

export type ProcessedRawEventLog = EventLog;

export interface EventLog {
  id: number;
  key: string;
}

/**
 * World Settings
 */
export interface RawWorldSettings extends DeepNullish<Omit<ProcessedRawWorldSettings, 'weather'>> {
  weather?: RawWeatherSettings | null | undefined;
}

export interface ProcessedRawWorldSettings extends Omit<WorldSettings, 'weather'> {
  weather: ProcessedRawWeatherSettings;
}

export interface WorldSettings {
  weather: WeatherSettings;
}

export type RawWeatherSettings = DeepNullish<ProcessedRawWeatherSettings>;

export type ProcessedRawWeatherSettings = WeatherSettings;

export interface WeatherSettings {
  rainChance: number;
}

/**
 * Fishing Zones
 */
export interface FishingDataFile {
  zones?: (RawFishingZone | undefined | null)[] | null;
}

export type RawFishingZone = DeepNullish<ProcessedRawFishingZone>;

export type ProcessedRawFishingZone = FishingZone;

export interface FishingZone {
  id: number;
  key: string;
  lootTableKey: string;
}

/**
 * Skills
 */
export interface SkillDataFile {
  skills?: (RawFishingZone | undefined | null)[] | null;
}

export interface RawSkill extends DeepNullish<Omit<ProcessedRawSkill, 'levels'>> {
  levels?: (RawSkillLevel | undefined | null)[] | null;
}

export interface ProcessedRawSkill extends Omit<Skill, 'id' | 'key' | 'levels'> {
  id?: number;
  key?: string;
  levels: ProcessedRawSkillLevel[];
}

export interface LocalizedSkill extends Skill {
  name: string;
}

export interface Skill {
  id: number;
  key: string;
  levels: SkillLevel[];
}

export type RawSkillLevel = DeepNullish<ProcessedRawSkillLevel>;

export interface ProcessedRawSkillLevel extends Omit<SkillLevel, 'key'> {
  key?: string;
}

export interface SkillLevel {
  key: string;
  damageIncrease: number;
  healthRegenIncrease: number;
  energyRegenIncrease: number;
  energyUseDescrease: number;
  craftingSpeedIncrease: number;
  monsterLootIncrease: number;
  damageReduction: number;
  doubleCropChance: number;
  fishSizeChanceIncrease: number;
  fishBiteSpeedIncrease: number;
  sellPriceIncrease: number;
  buyDiscount: number;
}

/**
 * Localization
 */
export interface RawLocalizationFile extends DeepNullish<Omit<ProcessedRawLocalizationFile, 'keys' | 'localizations'>> {
  keys: (string | undefined | null)[] | undefined | null;
  localizations: (RawLocalization | undefined | null)[] | undefined | null;
}

export interface ProcessedRawLocalizationFile extends Omit<LocalizationFile, 'localizations'> {
  localizations: ProcessedRawLocalization[];
}

export interface LocalizationFile {
  keys: string[];
  localizations: Localization[];
}

export interface RawLocalization extends DeepNullish<Omit<ProcessedRawLocalization, 'values'>> {
  values: Record<string, string | undefined | null> | undefined | null;
}

export type ProcessedRawLocalization = Localization;

export interface Localization {
  key: string;
  name: string;
  values: Record<string, string>;
}

/**
 * Quests
 */
export type QuestObjectiveType = 'GATHER' | 'CRAFT' | 'DESTINATION' | 'TALK_TO_CREATURE';
export type QuestSource = 'CREATURE';
export type QuestCompletionTrigger = 'AUTO_COMPLETE' | 'TALK_TO_CREATURE';

export interface QuestDataFile {
  quests?: (RawQuest | null | undefined)[] | null | undefined;
}

export interface RawQuest extends DeepNullish<Omit<ProcessedRawQuest, 'objectives'>> {
  tasks: (RawQuestTask | null | undefined)[] | null | undefined;
}

export interface ProcessedRawQuest extends Omit<Quest, 'id' | 'key' | 'tasks' | 'completionTrigger'> {
  id?: number;
  key?: string;

  tasks: ProcessedRawQuestTask[];

  completionTrigger?: string;
}

export interface LocalizedQuest extends Quest {
  name: string;
  text: string;
}

export interface Quest {
  id: number;
  key: string;

  tasks: QuestTask[];

  prerequisiteEventKeys: string[];

  source?: QuestSource;
  sourceCreatureTypeKey?: string;
  sourceCreatureDialogueTreeKey?: string;

  completionTrigger?: QuestCompletionTrigger;
  completionCreatureTypeKey?: string;
  completionCreatureDialogueTreeKey?: string;

  experienceReward: number;
  itemRewards: Record<string, number>;
}

export interface RawQuestTask extends DeepNullish<Omit<ProcessedRawQuestTask, 'objectives'>> {
  objectives: (RawQuestObjective | null | undefined)[] | null | undefined;
}

export interface ProcessedRawQuestTask extends Omit<QuestTask, 'id' | 'key' | 'objectives'> {
  id?: number;
  key?: string;
  objectives: ProcessedRawQuestObjective[];
}

export interface QuestTask {
  id: number;
  key: string;
  objectives: QuestObjective[];
}

export type RawQuestObjective = DeepNullish<ProcessedRawQuestObjective>;

export interface ProcessedRawQuestObjective extends Omit<QuestObjective, 'id' | 'key' | 'objectiveType'> {
  objectiveType?: string;
}

export interface QuestObjective {
  objectiveType?: QuestObjectiveType;
  itemTypeKey?: string;
  itemAmount?: number;
  craftingRecipeKey?: string;
  destinationPosition?: Vector2;
  destinationRadius?: number;
  creatureTypeKey?: string;
  creatureDialogueTreeKey?: string;
}
