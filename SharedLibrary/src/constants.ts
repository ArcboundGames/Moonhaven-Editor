import type {
  AttackType,
  ColliderType,
  FilledFromType,
  FishingItemType,
  GroundType,
  InventoryType,
  LootType,
  MovementType,
  ObjectSpriteRulePosition,
  PlacementLayer,
  PlacementPosition,
  QuestCompletionTrigger,
  QuestObjectiveType,
  QuestSource,
  Season,
  SpawningCondition,
  StageJumpCondition,
  StagesType,
  TimeComparator,
  WeaponType
} from './interface';

export const PIXELS_PER_UNIT = 16;
export const PLAYER_SPRITE_OFFSET = 0.0625;
export const PLAYER_SPRITE_WIDTH = 48;
export const PLAYER_SPRITE_HEIGHT = 48;
export const PLAYER_ANIMATION_SAMPLE_RATE = 10;
export const ITEM_SPRITE_TARGET_SIZE = 128;
export const OBJECT_SPRITE_TARGET_SIZE = 256;

/**
 * Sprites
 */
export const SPRITE_PIVOT_X = 0.5;
export const SPRITE_PIVOT_Y = 0;
export const SPRITE_PIVOT_OFFSET_Y_IN_PIXELS = 2;

/**
 * Inventory
 */
export const DEFAULT_STACK_SIZE = 1;
export const INVENTORY_SIZE = 30;

/**
 * Save
 */
export const DATA_FILE_EXTENSION = '.json';
export const IMAGE_FILE_EXTENSION = '.png';

/**
 * Data Files
 */
export const DATA_FILE_PATH = '/data/';
export const CREATURES_DATA_FILE = 'creatures';
export const ITEMS_DATA_FILE = 'items';
export const OBJECTS_DATA_FILE = 'objects';
export const LOOT_TABLES_DATA_FILE = 'loot_tables';
export const CRAFTING_RECIPES_DATA_FILE = 'crafting_recipes';
export const PLAYER_DATA_FILE = 'player';
export const WORLD_DATA_FILE = 'world';
export const DIALOGUE_DATA_FILE = 'dialogue';
export const EVENTS_DATA_FILE = 'events';
export const FISHING_DATA_FILE = 'fishing';
export const SKILLS_DATA_FILE = 'skills';
export const LOCALIZATION_DATA_FILE = 'localizations';
export const QUESTS_DATA_FILE = 'quests';
export const SCRIPTS_FILE_PATH = '/scripts/';

/**
 * Error Sections
 */
export const ERROR_SECTION_CREATURES = 'creatures';
export const ERROR_SECTION_CREATURE_CATEGORIES = 'categories';
export const ERROR_SECTION_ITEMS = 'items';
export const ERROR_SECTION_ITEM_CATEGORIES = 'categories';
export const ERROR_SECTION_CRAFTING_RECIPES = 'recipes';
export const ERROR_SECTION_CRAFTING_RECIPE_CATEGORIES = 'categories';
export const ERROR_SECTION_OBJECTS = 'objects';
export const ERROR_SECTION_OBJECT_CATEGORIES = 'categories';
export const ERROR_SECTION_OBJECT_SUB_CATEGORIES = 'sub_categories';
export const ERROR_SECTION_DIALOGUE_TREES = 'dialogueTrees';
export const ERROR_SECTION_PLAYER_STARTING_ITEMS = 'starting_items';
export const ERROR_SECTION_PLAYER_STATS = 'stats';
export const ERROR_SECTION_PLAYER_LEVELS = 'levels';
export const ERROR_SECTION_PLAYER_WORLD_WEATHER = 'weather';
export const ERROR_SECTION_FISHING_ZONES = 'fishing_zones';
export const ERROR_SECTION_LOCALIZATION_KEYS = 'keys';
export const ERROR_SECTION_LOCALIZATIONS = 'localizations';
export const ERROR_SECTION_SKILLS = 'skills';
export const ERROR_SECTION_QUESTS = 'quests';

/**
 * Collider Types
 */
export const POLYGON_COLLIDER_TYPE = 'POLYGON';
export const AUTO_BOX_COLLIDER_TYPE = 'AUTO_BOX';
export const BOX_COLLIDER_TYPE = 'BOX';
export const COLLIDER_TYPES: ColliderType[] = [POLYGON_COLLIDER_TYPE, AUTO_BOX_COLLIDER_TYPE, BOX_COLLIDER_TYPE];

/**
 * Loot Types
 */
export const LOOT_TYPE_NONE = 'NONE';
export const LOOT_TYPE_DROP = 'DROP';
export const LOOT_TYPE_STAGE_DROP = 'STAGE_DROP';
export const LOOT_TYPES: LootType[] = [LOOT_TYPE_NONE, LOOT_TYPE_DROP, LOOT_TYPE_STAGE_DROP];

/**
 * Stages Types
 */
export const STAGES_TYPE_NONE = 'NONE';
export const STAGES_TYPE_GROWABLE = 'GROWABLE';
export const STAGES_TYPE_GROWABLE_WITH_HEALTH = 'GROWABLE_WITH_HEALTH';
export const STAGES_TYPE_BREAKABLE = 'BREAKABLE';
export const STAGES_TYPES: StagesType[] = [STAGES_TYPE_NONE, STAGES_TYPE_GROWABLE, STAGES_TYPE_GROWABLE_WITH_HEALTH, STAGES_TYPE_BREAKABLE];

/**
 * Stage Jump Conditions
 */
export const STAGE_JUMP_CONDITION_TIME = 'TIME';
export const STAGE_JUMP_CONDITION_HARVEST = 'HARVEST';
export const STAGE_JUMP_CONDITIONS: StageJumpCondition[] = [STAGE_JUMP_CONDITION_TIME, STAGE_JUMP_CONDITION_HARVEST];

/**
 * Placement Positions
 */
export const PLACEMENT_POSITION_CENTER = 'CENTER';
export const PLACEMENT_POSITION_EDGE = 'EDGE';
export const PLACEMENT_POSITIONS: PlacementPosition[] = [PLACEMENT_POSITION_CENTER, PLACEMENT_POSITION_EDGE];

/**
 * Placement Layer
 */
export const PLACEMENT_LAYER_IN_GROUND = 'IN_GROUND';
export const PLACEMENT_LAYER_ON_GROUND = 'ON_GROUND';
export const PLACEMENT_LAYER_IN_AIR = 'IN_AIR';
export const PLACEMENT_LAYERS: PlacementLayer[] = [PLACEMENT_LAYER_IN_GROUND, PLACEMENT_LAYER_ON_GROUND, PLACEMENT_LAYER_IN_AIR];

/**
 * Object Category Sprite Rule Condtions
 */
export const SPRITE_RULE_DIRECTION_UP = 'UP';
export const SPRITE_RULE_DIRECTION_UP_RIGHT = 'UP_RIGHT';
export const SPRITE_RULE_DIRECTION_RIGHT = 'RIGHT';
export const SPRITE_RULE_DIRECTION_DOWN_RIGHT = 'DOWN_RIGHT';
export const SPRITE_RULE_DIRECTION_DOWN = 'DOWN';
export const SPRITE_RULE_DIRECTION_DOWN_LEFT = 'DOWN_LEFT';
export const SPRITE_RULE_DIRECTION_LEFT = 'LEFT';
export const SPRITE_RULE_DIRECTION_UP_LEFT = 'UP_LEFT';
export const SPRITE_RULE_DIRECTIONS: ObjectSpriteRulePosition[] = [
  SPRITE_RULE_DIRECTION_UP,
  SPRITE_RULE_DIRECTION_UP_RIGHT,
  SPRITE_RULE_DIRECTION_RIGHT,
  SPRITE_RULE_DIRECTION_DOWN_RIGHT,
  SPRITE_RULE_DIRECTION_DOWN,
  SPRITE_RULE_DIRECTION_DOWN_LEFT,
  SPRITE_RULE_DIRECTION_LEFT,
  SPRITE_RULE_DIRECTION_UP_LEFT
];

/**
 * Conditions
 */
export const EMPTY_GROUND_CONDITION = 'EMPTY_GROUND';
export const FARMLAND_CONDITION = 'FARMLAND';
export const INSIDE_CONDITION = 'INSIDE';
export const CONDITIONS: SpawningCondition[] = [EMPTY_GROUND_CONDITION, FARMLAND_CONDITION, INSIDE_CONDITION];

/**
 * Accents
 */
export const GROUND_TYPE_GRASS = 'GRASS';
export const GROUND_TYPE_SAND = 'SAND';
export const GROUND_TYPE_FARMLAND = 'FARMLAND';
export const GROUND_TYPE_INSIDE = 'INSIDE';
export const GROUND_TYPES: GroundType[] = [GROUND_TYPE_GRASS, GROUND_TYPE_SAND, GROUND_TYPE_FARMLAND, GROUND_TYPE_INSIDE];

/**
 * Inventory Types
 */
export const INVENTORY_TYPE_NONE = 'NONE';
export const INVENTORY_TYPE_SMALL = 'SMALL';
export const INVENTORY_TYPE_LARGE = 'LARGE';
export const INVENTORY_TYPES: InventoryType[] = [INVENTORY_TYPE_NONE, INVENTORY_TYPE_SMALL, INVENTORY_TYPE_LARGE];

/**
 * Inventory Types
 */
export const FILLED_FROM_TYPE_NONE = 'NONE';
export const FILLED_FROM_TYPE_WATER = 'WATER';
export const FILLED_FROM_TYPE_SAND = 'SAND';
export const FILLED_FROM_TYPES: FilledFromType[] = [FILLED_FROM_TYPE_NONE, FILLED_FROM_TYPE_WATER, FILLED_FROM_TYPE_SAND];

/**
 * Time Comparator
 */
export const TIME_COMPARATOR_BEFORE = 'BEFORE';
export const TIME_COMPARATOR_AFTER = 'AFTER';
export const TIME_COMPARATOR_BETWEEN = 'BETWEEN';
export const TIME_COMPARATORS: TimeComparator[] = [TIME_COMPARATOR_BEFORE, TIME_COMPARATOR_AFTER, TIME_COMPARATOR_BETWEEN];

/**
 * Weapon Types
 */
export const WEAPON_TYPE_NONE = 'NONE';
export const WEAPON_TYPE_POINT = 'POINT';
export const WEAPON_TYPE_ARC = 'ARC';
export const WEAPON_TYPE_PROJECTILE_LAUNCHER = 'PROJECTILE_LAUNCHER';
export const WEAPON_TYPE_PROJECTILE = 'PROJECTILE';
export const WEAPON_TYPES: WeaponType[] = [
  WEAPON_TYPE_NONE,
  WEAPON_TYPE_POINT,
  WEAPON_TYPE_ARC,
  WEAPON_TYPE_PROJECTILE_LAUNCHER,
  WEAPON_TYPE_PROJECTILE
];

/**
 * Fishing Item Types
 */
export const FISHING_ITEM_TYPE_NONE = 'NONE';
export const FISHING_ITEM_TYPE_POLE = 'POLE';
export const FISHING_ITEM_TYPE_LURE = 'LURE';
export const FISHING_ITEM_TYPE_FISH = 'FISH';
export const FISHING_ITEM_TYPES: FishingItemType[] = [
  FISHING_ITEM_TYPE_NONE,
  FISHING_ITEM_TYPE_POLE,
  FISHING_ITEM_TYPE_LURE,
  FISHING_ITEM_TYPE_FISH
];

/**
 * Time
 */
export const DAY_LENGTH = 1080;
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;

export const DAYS_IN_A_WEEK = 7;
export const ONE_HOUR = DAY_LENGTH / HOURS_IN_DAY;
export const ONE_MINUTE = DAY_LENGTH / HOURS_IN_DAY / MINUTES_IN_HOUR;
export const NINE_AM = ONE_HOUR * 9;
export const FIVE_PM = ONE_HOUR * 17;

export const HOURS_IN_HALF_DAY = HOURS_IN_DAY / 2;
export const LENGTH_OF_HOUR = DAY_LENGTH / HOURS_IN_DAY;
export const LENGTH_OF_MINUTE = LENGTH_OF_HOUR / MINUTES_IN_HOUR;

/**
 * Item Icons
 */
export const ICON_WIDTH = 16;
export const ICON_HEIGHT = 16;

/**
 * Creature Portraits
 */
export const PORTRAIT_WIDTH = 64;
export const PORTRAIT_HEIGHT = 64;
export const PORTRAIT_RESIZE_FACTOR = 4;
export const PORTRAIT_DISPLAY_WIDTH = PORTRAIT_WIDTH * PORTRAIT_RESIZE_FACTOR;
export const PORTRAIT_DISPLAY_HEIGHT = PORTRAIT_HEIGHT * PORTRAIT_RESIZE_FACTOR;

/**
 * Days
 */
export const DAYS_OF_THE_WEEK: Record<number, { name: string; abbreviation: string }> = {
  0: {
    name: 'Sunday',
    abbreviation: 'Sun'
  },
  1: {
    name: 'Monday',
    abbreviation: 'Mon'
  },
  2: {
    name: 'Tuesday',
    abbreviation: 'Tue'
  },
  3: {
    name: 'Wednesday',
    abbreviation: 'Wed'
  },
  4: {
    name: 'Thursday',
    abbreviation: 'Thu'
  },
  5: {
    name: 'Friday',
    abbreviation: 'Fri'
  },
  6: {
    name: 'Saturday',
    abbreviation: 'Sat'
  }
};

/**
 * Seasons
 */
export const ALL_SEASONS = 'ALL';
export const SPRING = 'SPRING';
export const SUMMER = 'SUMMER';
export const FALL = 'FALL';
export const WINTER = 'WINTER';

export const SEASONS: Season[] = [SPRING, SUMMER, FALL, WINTER];

/**
 * Localizations
 */
export const ENGLISH_LOCALIZATION = 'en-US';

/**
 * Quests
 */
export const QUEST_OBJECTIVE_TYPE_GATHER = 'GATHER';
export const QUEST_OBJECTIVE_TYPE_CRAFT = 'CRAFT';
export const QUEST_OBJECTIVE_TYPE_DESTINATION = 'DESTINATION';
export const QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE = 'TALK_TO_CREATURE';

export const QUEST_OBJECTIVE_TYPES: QuestObjectiveType[] = [
  QUEST_OBJECTIVE_TYPE_GATHER,
  QUEST_OBJECTIVE_TYPE_CRAFT,
  QUEST_OBJECTIVE_TYPE_DESTINATION,
  QUEST_OBJECTIVE_TYPE_TALK_TO_CREATURE
];

export const QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE = 'AUTO_COMPLETE';
export const QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE = 'TALK_TO_CREATURE';

export const QUEST_COMPLETION_TRIGGERS: QuestCompletionTrigger[] = [
  QUEST_COMPLETION_TRIGGER_AUTO_COMPLETE,
  QUEST_COMPLETION_TRIGGER_TALK_TO_CREATURE
];

export const QUEST_SOURCE_CREATURE = 'CREATURE';
export const QUEST_SOURCE_AUTO_START = 'AUTO_START';

export const QUEST_SOURCES: QuestSource[] = [QUEST_SOURCE_CREATURE, QUEST_SOURCE_AUTO_START];

/**
 * Movement Type
 */
export const MOVEMENT_TYPE_WALK = 'WALK';
export const MOVEMENT_TYPE_JUMP = 'JUMP';

export const MOVEMENT_TYPES: MovementType[] = [MOVEMENT_TYPE_WALK, MOVEMENT_TYPE_JUMP];

/**
 * Attack Type
 */
export const ATTACK_TYPE_NONE = 'NONE';
export const ATTACK_TYPE_TOUCH = 'TOUCH';
export const ATTACK_TYPE_ARC = 'ARC';

export const ATTACK_TYPES: AttackType[] = [ATTACK_TYPE_NONE, ATTACK_TYPE_TOUCH, ATTACK_TYPE_ARC];
