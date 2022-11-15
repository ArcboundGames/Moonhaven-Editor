import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

import {
  PLACEMENT_LAYER_IN_AIR,
  PLACEMENT_LAYER_IN_GROUND,
  PLACEMENT_LAYER_ON_GROUND
} from '../../../../../../../../SharedLibrary/src/constants';
import { createObjectSprite } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import Checkbox from '../../../../widgets/form/Checkbox';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import FormBox from '../../../../widgets/layout/FormBox';

import type { Sprite } from '../../../../../../../../SharedLibrary/src/interface';

export interface SpriteExtraDataProps {
  index: number;
  showDefaultSprite: boolean;
  defaultSprite: number | undefined;
  canChangeDefaultSprite: boolean;
  sprite: Sprite | undefined;
  onDefaultSpriteChange: ((defaultSprite: number) => void) | undefined;
  onChange: (index: number, sprite: Partial<Sprite>) => void;
  disabled: boolean;
}

export const SpriteExtraData = ({
  index,
  showDefaultSprite,
  defaultSprite,
  canChangeDefaultSprite,
  sprite,
  onDefaultSpriteChange,
  onChange,
  disabled
}: SpriteExtraDataProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {showDefaultSprite ? (
        <FormBox key="default-sprite" sx={{ width: 'auto' }}>
          <Checkbox
            label="Default Sprite"
            checked={index === (defaultSprite ?? 0)}
            onChange={canChangeDefaultSprite ? () => onDefaultSpriteChange?.(index) : undefined}
            disabled={disabled || !canChangeDefaultSprite || index === (defaultSprite ?? 0)}
          />
        </FormBox>
      ) : null}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: '0.35em' }}>
          Pivot Offset
        </Typography>
        <Checkbox
          label="Override"
          checked={Boolean(sprite?.pivotOffset)}
          size="small"
          onChange={(newValue) =>
            onChange(index, {
              ...(sprite ?? createObjectSprite()),
              pivotOffset: newValue ? { x: 0, y: 0 } : undefined
            })
          }
          disabled={disabled || !canChangeDefaultSprite || index === (defaultSprite ?? 0)}
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <FormBox>
          <NumberTextField
            label="X"
            value={sprite?.pivotOffset?.x}
            onChange={(value) => {
              onChange(index, {
                ...(sprite ?? createObjectSprite()),
                pivotOffset: {
                  x: value,
                  y: sprite?.pivotOffset?.y ?? 0
                }
              });
            }}
            disabled={disabled || sprite?.pivotOffset === undefined}
            error={
              (sprite?.pivotOffset !== undefined && sprite?.pivotOffset?.x === undefined) ||
              (sprite?.pivotOffset?.x ?? 0) % 1 !== 0
            }
            helperText="Pixels"
          />
        </FormBox>
        <FormBox>
          <NumberTextField
            label="Y"
            value={sprite?.pivotOffset?.y}
            onChange={(value) => {
              onChange(index, {
                ...(sprite ?? createObjectSprite()),
                pivotOffset: {
                  x: sprite?.pivotOffset?.x ?? 0,
                  y: value
                }
              });
            }}
            disabled={disabled || sprite?.pivotOffset === undefined}
            error={
              (sprite?.pivotOffset !== undefined && sprite?.pivotOffset?.y === undefined) ||
              (sprite?.pivotOffset?.y ?? 0) % 1 !== 0
            }
            helperText="Pixels"
          />
        </FormBox>
      </Box>
      {sprite?.pivotOffset === undefined ? (
        <FormHelperText key="offset-controlled-by" component="div">
          Controlled by base pivot offset
        </FormHelperText>
      ) : null}
      <Typography gutterBottom variant="subtitle2" component="div" sx={{ mt: 4 }}>
        Sprite Offset
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <FormBox>
          <NumberTextField
            label="X"
            value={sprite?.spriteOffset?.x}
            onChange={(value) => {
              onChange(index, {
                ...(sprite ?? createObjectSprite()),
                spriteOffset: {
                  x: value,
                  y: sprite?.spriteOffset?.y ?? 0
                }
              });
            }}
            disabled={disabled}
            error={
              (sprite?.spriteOffset !== undefined && sprite?.spriteOffset?.x === undefined) ||
              (sprite?.spriteOffset?.x ?? 0) % 1 !== 0
            }
            helperText="Pixels"
          />
        </FormBox>
        <FormBox>
          <NumberTextField
            label="Y"
            value={sprite?.spriteOffset?.y}
            onChange={(value) => {
              onChange(index, {
                ...(sprite ?? createObjectSprite()),
                spriteOffset: {
                  x: sprite?.spriteOffset?.x ?? 0,
                  y: value
                }
              });
            }}
            disabled={disabled}
            error={
              (sprite?.spriteOffset !== undefined && sprite?.spriteOffset?.y === undefined) ||
              (sprite?.spriteOffset?.y ?? 0) % 1 !== 0
            }
            helperText="Pixels"
          />
        </FormBox>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        <FormBox>
          <Select
            label="Placement Layer Override"
            disabled={disabled}
            value={sprite?.placementLayer}
            onChange={(newValue) =>
              onChange(index, {
                ...(sprite ?? createObjectSprite()),
                placementLayer: newValue
              })
            }
            options={[
              {
                label: 'In Ground',
                value: PLACEMENT_LAYER_IN_GROUND
              },
              {
                label: 'On Ground',
                value: PLACEMENT_LAYER_ON_GROUND
              },
              {
                label: 'In Air',
                value: PLACEMENT_LAYER_IN_AIR
              }
            ]}
          />
        </FormBox>
      </Box>
    </Box>
  );
};
