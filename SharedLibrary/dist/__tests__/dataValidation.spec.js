"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var dataValidation = __importStar(require("../dataValidation"));
var assert_util_1 = require("../util/assert.util");
describe('dataValidation', function () {
    var assert;
    var assertNotNullish;
    var errors;
    var objectCategory;
    beforeEach(function () {
        var assertSetup = (0, assert_util_1.createAssert)();
        errors = assertSetup.errors;
        assert = assertSetup.assert;
        assertNotNullish = assertSetup.assertNotNullish;
        objectCategory = {
            sprite: {}
        };
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    describe('assertColliders', function () {
        var assertObjectSpriteColliders;
        var assertObjectColliders;
        beforeEach(function () {
            assertObjectSpriteColliders = jest.spyOn(dataValidation, 'assertObjectSpriteColliders').mockReturnValue();
            assertObjectColliders = jest.spyOn(dataValidation, 'assertObjectColliders').mockReturnValue();
        });
        afterEach(function () {
            assertObjectSpriteColliders.mockRestore();
            assertObjectColliders.mockRestore();
        });
        test('has colliders', function () {
            var colliders = [
                {
                    isTrigger: false,
                    usedByComposite: false
                },
                {
                    isTrigger: false,
                    usedByComposite: false
                }
            ];
            objectCategory.colliders = colliders;
            dataValidation.assertColliders(assert, assertNotNullish, objectCategory);
            expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(0);
            expect(assertObjectColliders).toHaveBeenCalledTimes(1);
            expect(assertObjectColliders).toHaveBeenLastCalledWith(assert, assertNotNullish, colliders, 'Generic collider');
            expect(errors.length).toBe(0);
        });
        test('has sprite colliders', function () {
            var spriteColliders = {};
            objectCategory.sprite = { sprites: spriteColliders };
            dataValidation.assertColliders(assert, assertNotNullish, objectCategory);
            expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(1);
            expect(assertObjectSpriteColliders).toHaveBeenLastCalledWith(assert, assertNotNullish, spriteColliders);
            expect(assertObjectColliders).toHaveBeenCalledTimes(0);
            expect(errors.length).toBe(0);
        });
        test('has colliders and sprite colliders', function () {
            var colliders = [
                {
                    isTrigger: false,
                    usedByComposite: false
                },
                {
                    isTrigger: false,
                    usedByComposite: false
                }
            ];
            objectCategory.colliders = colliders;
            var spriteColliders = {};
            objectCategory.sprite = { sprites: spriteColliders };
            dataValidation.assertColliders(assert, assertNotNullish, objectCategory);
            expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(1);
            expect(assertObjectSpriteColliders).toHaveBeenLastCalledWith(assert, assertNotNullish, spriteColliders);
            expect(assertObjectColliders).toHaveBeenCalledTimes(1);
            expect(assertObjectColliders).toHaveBeenLastCalledWith(assert, assertNotNullish, colliders, 'Generic collider');
            expect(errors.length).toBe(0);
        });
        test('no colliders', function () {
            dataValidation.assertColliders(assert, assertNotNullish, objectCategory);
            expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(0);
            expect(assertObjectColliders).toHaveBeenCalledTimes(0);
            expect(errors.length).toBe(0);
        });
    });
    describe('assertObjectSpriteColliders', function () {
        var assertObjectColliders;
        beforeEach(function () {
            assertObjectColliders = jest.spyOn(dataValidation, 'assertObjectColliders').mockReturnValue();
        });
        afterEach(function () {
            assertObjectColliders.mockRestore();
        });
        test('calls assert object colliders for each sprite collider', function () {
            var sprite5Colliders = [
                {
                    isTrigger: false,
                    usedByComposite: false
                },
                {
                    isTrigger: false,
                    usedByComposite: false
                }
            ];
            var sprite13Colliders = [
                {
                    isTrigger: false,
                    usedByComposite: false
                }
            ];
            var spriteColliders = {
                '5': {
                    colliders: sprite5Colliders
                },
                '13': {
                    colliders: sprite13Colliders
                }
            };
            dataValidation.assertObjectSpriteColliders(assert, assertNotNullish, spriteColliders);
            expect(assertObjectColliders).toHaveBeenCalledTimes(2);
            expect(assertObjectColliders).toHaveBeenNthCalledWith(1, assert, assertNotNullish, sprite5Colliders, 'Sprite 5 Collider');
            expect(assertObjectColliders).toHaveBeenNthCalledWith(2, assert, assertNotNullish, sprite13Colliders, 'Sprite 13 Collider');
            expect(errors.length).toBe(0);
        });
        test('no sprite colliders', function () {
            var spriteColliders = {};
            dataValidation.assertObjectSpriteColliders(assert, assertNotNullish, spriteColliders);
            expect(assertObjectColliders).toHaveBeenCalledTimes(0);
            expect(errors.length).toBe(0);
        });
    });
    describe('assertObjectColliders', function () {
        var assertBoxCollider;
        beforeEach(function () {
            assertBoxCollider = jest.spyOn(dataValidation, 'assertBoxCollider').mockReturnValue();
        });
        afterEach(function () {
            assertBoxCollider.mockRestore();
        });
        test('polygon collider', function () {
            var objectCollider = { type: 'POLYGON', isTrigger: false, usedByComposite: false };
            dataValidation.assertObjectCollider(assert, assertNotNullish, objectCollider, 'Collider', 1);
            expect(errors.length).toBe(0);
            expect(assertBoxCollider).toHaveBeenCalledTimes(0);
        });
        test('autobox collider', function () {
            var objectCollider = { type: 'AUTO_BOX', isTrigger: false, usedByComposite: false };
            dataValidation.assertObjectCollider(assert, assertNotNullish, objectCollider, 'Collider', 1);
            expect(errors.length).toBe(0);
            expect(assertBoxCollider).toHaveBeenCalledTimes(0);
        });
        test('box collider', function () {
            var objectCollider = { type: 'BOX', isTrigger: false, usedByComposite: false };
            dataValidation.assertObjectCollider(assert, assertNotNullish, objectCollider, 'Collider', 1);
            expect(errors.length).toBe(0);
            expect(assertBoxCollider).toHaveBeenCalledTimes(1);
            expect(assertBoxCollider).toHaveBeenLastCalledWith(assertNotNullish, objectCollider, 'Collider', 1);
        });
        test('no type', function () {
            var objectCollider = { isTrigger: false, usedByComposite: false };
            dataValidation.assertObjectCollider(assert, assertNotNullish, objectCollider, 'Collider', 1);
            expect(errors.length).toBe(1);
            expect(errors[0]).toBe('Collider 1: No collider type');
            expect(assertBoxCollider).toHaveBeenCalledTimes(0);
        });
        test('bad type', function () {
            var objectCollider = { type: 'BAD_TYPE', isTrigger: false, usedByComposite: false };
            dataValidation.assertObjectCollider(assert, assertNotNullish, objectCollider, 'Collider', 1);
            expect(errors.length).toBe(1);
            expect(errors[0]).toBe('Collider 1: Invalid collider type: BAD_TYPE. Only POLYGON and BOX are allowed');
            expect(assertBoxCollider).toHaveBeenCalledTimes(0);
        });
    });
    describe('assertBoxCollider', function () {
        test('valid', function () {
            var collider = {
                isTrigger: false,
                usedByComposite: false,
                size: {
                    x: 0,
                    y: 0
                },
                offset: {
                    x: 0,
                    y: 0
                }
            };
            dataValidation.assertBoxCollider(assertNotNullish, collider, 'Collider', 1);
            expect(errors.length).toBe(0);
        });
        test('no size', function () {
            var collider = {
                isTrigger: false,
                usedByComposite: false,
                offset: {
                    x: 0,
                    y: 0
                }
            };
            dataValidation.assertBoxCollider(assertNotNullish, collider, 'Collider', 1);
            expect(errors.length).toBe(1);
            expect(errors[0]).toBe('Collider 1: No size');
        });
        test('no offset', function () {
            var collider = {
                isTrigger: false,
                usedByComposite: false,
                size: {
                    x: 0,
                    y: 0
                }
            };
            dataValidation.assertBoxCollider(assertNotNullish, collider, 'Collider', 1);
            expect(errors.length).toBe(1);
            expect(errors[0]).toBe('Collider 1: No offset');
        });
        test('no offset or size', function () {
            var collider = {
                isTrigger: false,
                usedByComposite: false
            };
            dataValidation.assertBoxCollider(assertNotNullish, collider, 'Collider', 1);
            expect(errors.length).toBe(2);
            expect(errors[0]).toBe('Collider 1: No size');
            expect(errors[1]).toBe('Collider 1: No offset');
        });
    });
});
