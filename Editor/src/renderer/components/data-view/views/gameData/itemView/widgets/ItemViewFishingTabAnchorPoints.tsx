import Box from '@mui/material/Box';

import { PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH } from '../../../../../../../../../SharedLibrary/src/constants';
import { toFishingPoleAnchorPoints } from '../../../../../../../../../SharedLibrary/src/util/converters.util';
import Vector2Field from '../../../../../widgets/form/Vector2Field';
import Card from '../../../../../widgets/layout/Card';
import FormBox from '../../../../../widgets/layout/FormBox';

import type { FishingPoleAnchorPoints } from '../../../../../../../../../SharedLibrary/src/interface';

export interface ShopTimesCardProps {
  label: string;
  data: FishingPoleAnchorPoints | undefined;
  disabled?: boolean;
  onChange: (changes: FishingPoleAnchorPoints) => void;
}

const ItemViewFishingTabAnchorPoints = ({ label, data, disabled = true, onChange }: ShopTimesCardProps) => {
  return (
    <Card header={label}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(2, minmax(0, 1fr))' }}>
        <FormBox sx={{ height: '70px' }}>Idle</FormBox>
        <Vector2Field
          value={data?.idle}
          helperText="Pixels"
          disabled={disabled}
          min={{
            x: 0,
            y: 0
          }}
          max={{
            x: PLAYER_SPRITE_WIDTH - 1,
            y: PLAYER_SPRITE_HEIGHT - 1
          }}
          onChange={(value) =>
            onChange(
              toFishingPoleAnchorPoints({
                ...data,
                idle: value
              })
            )
          }
        />
        <FormBox sx={{ height: '70px' }}>Casting</FormBox>
        <Vector2Field
          value={data?.casting}
          helperText="Pixels"
          disabled={disabled}
          min={{
            x: 0,
            y: 0
          }}
          max={{
            x: PLAYER_SPRITE_WIDTH - 1,
            y: PLAYER_SPRITE_HEIGHT - 1
          }}
          onChange={(value) =>
            onChange(
              toFishingPoleAnchorPoints({
                ...data,
                casting: value
              })
            )
          }
        />
        <FormBox sx={{ height: '70px' }}>Pulling</FormBox>
        <Vector2Field
          value={data?.pulling}
          helperText="Pixels"
          disabled={disabled}
          min={{
            x: 0,
            y: 0
          }}
          max={{
            x: PLAYER_SPRITE_WIDTH - 1,
            y: PLAYER_SPRITE_HEIGHT - 1
          }}
          onChange={(value) =>
            onChange(
              toFishingPoleAnchorPoints({
                ...data,
                pulling: value
              })
            )
          }
        />
      </Box>
    </Card>
  );
};

export default ItemViewFishingTabAnchorPoints;
