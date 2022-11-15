import * as dataValidation from '../dataValidation';
import { createAssert } from '../util/assert.util';

import type { ProcessedRawCollider, ProcessedRawObjectCategory, ProcessedRawSprite } from '../interface';
import type { Assert } from '../util/assert.util';

describe('dataValidation', () => {
  let assert: Assert;
  let errors: string[];
  let objectCategory: ProcessedRawObjectCategory;

  beforeEach(() => {
    const assertSetup = createAssert();

    errors = assertSetup.errors;
    assert = assertSetup.assert;

    objectCategory = {
      sprite: {}
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('assertColliders', () => {
    let assertObjectSpriteColliders: jest.SpyInstance;
    let assertObjectColliders: jest.SpyInstance;
    beforeEach(() => {
      assertObjectSpriteColliders = jest.spyOn(dataValidation, 'assertObjectSpriteColliders').mockReturnValue();
      assertObjectColliders = jest.spyOn(dataValidation, 'assertObjectColliders').mockReturnValue();
    });

    afterEach(() => {
      assertObjectSpriteColliders.mockRestore();
      assertObjectColliders.mockRestore();
    });

    test('has colliders', () => {
      const colliders = [
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

      dataValidation.assertColliders(assert, objectCategory);

      expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(0);
      expect(assertObjectColliders).toHaveBeenCalledTimes(1);
      expect(assertObjectColliders).toHaveBeenLastCalledWith(assert, colliders, 'Generic collider');

      expect(errors.length).toBe(0);
    });

    test('has sprite colliders', () => {
      const spriteColliders = {};
      objectCategory.sprite = { sprites: spriteColliders };

      dataValidation.assertColliders(assert, objectCategory);

      expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(1);
      expect(assertObjectSpriteColliders).toHaveBeenLastCalledWith(assert, spriteColliders);
      expect(assertObjectColliders).toHaveBeenCalledTimes(0);

      expect(errors.length).toBe(0);
    });

    test('has colliders and sprite colliders', () => {
      const colliders = [
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

      const spriteColliders = {};
      objectCategory.sprite = { sprites: spriteColliders };

      dataValidation.assertColliders(assert, objectCategory);

      expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(1);
      expect(assertObjectSpriteColliders).toHaveBeenLastCalledWith(assert, spriteColliders);

      expect(assertObjectColliders).toHaveBeenCalledTimes(1);
      expect(assertObjectColliders).toHaveBeenLastCalledWith(assert, colliders, 'Generic collider');

      expect(errors.length).toBe(0);
    });

    test('no colliders', () => {
      dataValidation.assertColliders(assert, objectCategory);

      expect(assertObjectSpriteColliders).toHaveBeenCalledTimes(0);
      expect(assertObjectColliders).toHaveBeenCalledTimes(0);

      expect(errors.length).toBe(0);
    });
  });

  describe('assertObjectSpriteColliders', () => {
    let assertObjectColliders: jest.SpyInstance;
    beforeEach(() => {
      assertObjectColliders = jest.spyOn(dataValidation, 'assertObjectColliders').mockReturnValue();
    });

    afterEach(() => {
      assertObjectColliders.mockRestore();
    });

    test('calls assert object colliders for each sprite collider', () => {
      const sprite5Colliders = [
        {
          isTrigger: false,
          usedByComposite: false
        },
        {
          isTrigger: false,
          usedByComposite: false
        }
      ];

      const sprite13Colliders = [
        {
          isTrigger: false,
          usedByComposite: false
        }
      ];

      const spriteColliders: Record<string, ProcessedRawSprite> = {
        '5': {
          colliders: sprite5Colliders
        },
        '13': {
          colliders: sprite13Colliders
        }
      };

      dataValidation.assertObjectSpriteColliders(assert, spriteColliders);

      expect(assertObjectColliders).toHaveBeenCalledTimes(2);
      expect(assertObjectColliders).toHaveBeenNthCalledWith(1, assert, sprite5Colliders, 'Sprite 5 Collider');
      expect(assertObjectColliders).toHaveBeenNthCalledWith(2, assert, sprite13Colliders, 'Sprite 13 Collider');

      expect(errors.length).toBe(0);
    });

    test('no sprite colliders', () => {
      const spriteColliders = {};

      dataValidation.assertObjectSpriteColliders(assert, spriteColliders);

      expect(assertObjectColliders).toHaveBeenCalledTimes(0);

      expect(errors.length).toBe(0);
    });
  });

  describe('assertObjectColliders', () => {
    let assertBoxCollider: jest.SpyInstance;
    beforeEach(() => {
      assertBoxCollider = jest.spyOn(dataValidation, 'assertBoxCollider').mockReturnValue();
    });

    afterEach(() => {
      assertBoxCollider.mockRestore();
    });

    test('polygon collider', () => {
      const objectCollider: ProcessedRawCollider = { type: 'POLYGON', isTrigger: false, usedByComposite: false };
      dataValidation.assertObjectCollider(assert, objectCollider, 'Collider', 1);
      expect(errors.length).toBe(0);
      expect(assertBoxCollider).toHaveBeenCalledTimes(0);
    });

    test('box collider', () => {
      const objectCollider: ProcessedRawCollider = { type: 'BOX', isTrigger: false, usedByComposite: false };
      dataValidation.assertObjectCollider(assert, objectCollider, 'Collider', 1);
      expect(errors.length).toBe(0);
      expect(assertBoxCollider).toHaveBeenCalledTimes(1);
      expect(assertBoxCollider).toHaveBeenLastCalledWith(assert, objectCollider, 'Collider', 1);
    });

    test('no type', () => {
      const objectCollider: ProcessedRawCollider = { isTrigger: false, usedByComposite: false };
      dataValidation.assertObjectCollider(assert, objectCollider, 'Collider', 1);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Collider 1: No collider type');
      expect(assertBoxCollider).toHaveBeenCalledTimes(0);
    });

    test('bad type', () => {
      const objectCollider: ProcessedRawCollider = { type: 'BAD_TYPE', isTrigger: false, usedByComposite: false };
      dataValidation.assertObjectCollider(assert, objectCollider, 'Collider', 1);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Collider 1: Invalid collider type: BAD_TYPE. Only POLYGON and BOX are allowed');
      expect(assertBoxCollider).toHaveBeenCalledTimes(0);
    });
  });

  describe('assertBoxCollider', () => {
    test('valid', () => {
      const collider = {
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

      dataValidation.assertBoxCollider(assert, collider, 'Collider', 1);

      expect(errors.length).toBe(0);
    });

    test('no size', () => {
      const collider = {
        isTrigger: false,
        usedByComposite: false,
        offset: {
          x: 0,
          y: 0
        }
      };

      dataValidation.assertBoxCollider(assert, collider, 'Collider', 1);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Collider 1: No size');
    });

    test('no offset', () => {
      const collider: ProcessedRawCollider = {
        isTrigger: false,
        usedByComposite: false,
        size: {
          x: 0,
          y: 0
        }
      };

      dataValidation.assertBoxCollider(assert, collider, 'Collider', 1);

      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Collider 1: No offset');
    });

    test('no offset or size', () => {
      const collider = {
        isTrigger: false,
        usedByComposite: false
      };

      dataValidation.assertBoxCollider(assert, collider, 'Collider', 1);

      expect(errors.length).toBe(2);
      expect(errors[0]).toBe('Collider 1: No size');
      expect(errors[1]).toBe('Collider 1: No offset');
    });
  });
});
