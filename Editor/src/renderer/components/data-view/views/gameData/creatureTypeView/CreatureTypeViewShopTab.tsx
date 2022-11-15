import Box from '@mui/material/Box';

import { DAYS_IN_A_WEEK } from '../../../../../../../../SharedLibrary/src/constants';
import { createCreatureShop } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import EventAutocomplete from '../../../../widgets/form/event/EventAutocomplete';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import ShopItemsCard from './widgets/ShopItemsCard';
import ShopTimesCard from './widgets/ShopTimesCard';

import type { CreatureType, LocalizedItemType } from '../../../../../../../../SharedLibrary/src/interface';

export interface CreatureTypeViewShopTabProps {
  data: CreatureType;
  itemsByKey: Record<string, LocalizedItemType>;
  disabled: boolean;
  handleOnChange: (input: Partial<CreatureType>) => void;
}

const CreatureTypeViewShopTab = ({ data, itemsByKey, disabled, handleOnChange }: CreatureTypeViewShopTabProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Shop Open Event" sx={{ overflow: 'visible' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
            <FormBox sx={{ position: 'relative' }}>
              <EventAutocomplete
                label="Trigger Event"
                value={data?.shop?.openingEvent}
                onChange={(openingEvent) =>
                  handleOnChange({
                    shop: {
                      ...(data.shop || createCreatureShop()),
                      openingEvent
                    }
                  })
                }
              />
            </FormBox>
          </Box>
        </Card>
        <ShopTimesCard
          openTimes={data.shop?.openTimes || Array(DAYS_IN_A_WEEK)}
          closeTimes={data.shop?.closeTimes || Array(DAYS_IN_A_WEEK)}
          disabled={disabled}
          onChange={(changes) => {
            handleOnChange({
              shop: {
                ...(data.shop || createCreatureShop()),
                ...changes
              }
            });
          }}
        />
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <ShopItemsCard
          prices={data.shop?.prices || {}}
          disabled={disabled}
          itemsByKey={itemsByKey}
          onChange={(prices) => {
            handleOnChange({
              shop: {
                ...(data.shop || createCreatureShop()),
                prices
              }
            });
          }}
        />
      </Box>
    </Box>
  );
};

export default CreatureTypeViewShopTab;
