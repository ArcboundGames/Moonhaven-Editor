import Box from '@mui/material/Box';
import { useMemo } from 'react';

import {
  FISHING_ITEM_TYPE_FISH,
  FISHING_ITEM_TYPE_LURE,
  FISHING_ITEM_TYPE_NONE,
  FISHING_ITEM_TYPE_POLE
} from '../../../../../../../../SharedLibrary/src/constants';
import { toFishingItemType } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import { getItemSetting } from '../../../../../../../../SharedLibrary/src/util/itemType.util';
import { useAppSelector } from '../../../../../hooks';
import { selectItemCategoriesByKey } from '../../../../../store/slices/items';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Select from '../../../../widgets/form/Select';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import { OverriddenItemPropertyCard } from '../widgets/OverriddenPropertyCard';
import ItemViewFishingTabAnchorPoints from './widgets/ItemViewFishingTabAnchorPoints';

import type { ItemType } from '../../../../../../../../SharedLibrary/src/interface';

export interface ItemViewFishingTabProps {
  data: ItemType;
  disabled: boolean;
  handleOnChange: (input: Partial<ItemType>) => void;
}

const ItemViewFishingTab = ({ data, disabled, handleOnChange }: ItemViewFishingTabProps) => {
  const itemCategoriesByKey = useAppSelector(selectItemCategoriesByKey);

  const fishingItemType = useMemo(
    () => getItemSetting('fishingItemType', data, itemCategoriesByKey),
    [data, itemCategoriesByKey]
  ).value;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <OverriddenItemPropertyCard
          title="Fishing"
          type={data}
          setting="fishingItemType"
          onOverrideChange={(overridden) =>
            handleOnChange({
              settings: {
                ...data.settings,
                fishingItemType: overridden ? FISHING_ITEM_TYPE_NONE : undefined
              }
            })
          }
          disabled={disabled}
        >
          {{
            control: (controlled, value, helperText) => (
              <Select
                label="Fishing Item Type"
                required
                disabled={controlled || disabled}
                value={value}
                helperText={helperText}
                onChange={
                  controlled
                    ? undefined
                    : (newValue) =>
                        handleOnChange({
                          settings: {
                            ...data.settings,
                            fishingItemType: toFishingItemType(newValue)
                          }
                        })
                }
                options={[
                  {
                    label: 'None',
                    value: FISHING_ITEM_TYPE_NONE,
                    emphasize: true
                  },
                  {
                    label: 'Pole',
                    value: FISHING_ITEM_TYPE_POLE
                  },
                  {
                    label: 'Lure',
                    value: FISHING_ITEM_TYPE_LURE
                  },
                  {
                    label: 'Fish',
                    value: FISHING_ITEM_TYPE_FISH
                  }
                ]}
              />
            )
          }}
        </OverriddenItemPropertyCard>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        {fishingItemType === FISHING_ITEM_TYPE_POLE ? (
          <>
            <ItemViewFishingTabAnchorPoints
              key="north-facing-anchors"
              label="North Facing Anchors"
              data={data.fishingPoleAnchorPointsNorth}
              disabled={disabled}
              onChange={(value) =>
                handleOnChange({
                  fishingPoleAnchorPointsNorth: value
                })
              }
            />
            <ItemViewFishingTabAnchorPoints
              key="east-facing-anchors"
              label="East Facing Anchors"
              data={data.fishingPoleAnchorPointsEast}
              disabled={disabled}
              onChange={(value) =>
                handleOnChange({
                  fishingPoleAnchorPointsEast: value
                })
              }
            />
            <ItemViewFishingTabAnchorPoints
              key="south-facing-anchors"
              label="South Facing Anchors"
              data={data.fishingPoleAnchorPointsSouth}
              disabled={disabled}
              onChange={(value) =>
                handleOnChange({
                  fishingPoleAnchorPointsSouth: value
                })
              }
            />
            <ItemViewFishingTabAnchorPoints
              key="west-facing-anchors"
              label="West Facing Anchors"
              data={data.fishingPoleAnchorPointsWest}
              disabled={disabled}
              onChange={(value) =>
                handleOnChange({
                  fishingPoleAnchorPointsWest: value
                })
              }
            />
          </>
        ) : null}
        {fishingItemType === FISHING_ITEM_TYPE_FISH ? (
          <Card header="Fish">
            <FormBox>
              <NumberTextField
                label="Fish Experience"
                value={data.fishExperience}
                min={1}
                onChange={(value) => handleOnChange({ fishExperience: value })}
                required
                disabled={disabled}
                wholeNumber
              />
            </FormBox>
          </Card>
        ) : null}
      </Box>
    </Box>
  );
};

export default ItemViewFishingTab;
