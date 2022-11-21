import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getCreatureSetting } from '../../../../../../../../SharedLibrary/src/util/creatureType.util';
import { getItemSetting } from '../../../../../../../../SharedLibrary/src/util/itemType.util';
import { getObjectSetting } from '../../../../../../../../SharedLibrary/src/util/objectType.util';
import { useAppSelector } from '../../../../../hooks';
import { selectCreatureCategoriesByKey } from '../../../../../store/slices/creatures';
import { selectItemCategoriesByKey } from '../../../../../store/slices/items';
import { selectObjectCategoriesByKey, selectObjectSubCategoriesByKey } from '../../../../../store/slices/objects';
import Checkbox from '../../../../widgets/form/Checkbox';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type {
  CreatureSettings,
  CreatureType,
  ItemSettings,
  ItemType,
  ObjectSettings,
  ObjectSubCategory,
  ObjectType
} from '../../../../../../../../SharedLibrary/src/interface';

type ItemChildControl<K extends keyof ItemSettings> = (
  controlled: boolean,
  value: ItemSettings[K] | undefined,
  helperText: JSX.Element | null
) => JSX.Element;

type ItemOtherChildren<K extends keyof ItemSettings> = (
  value: ItemSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

type ObjectChildControl<K extends keyof ObjectSettings> = (
  controlled: boolean,
  value: ObjectSettings[K] | undefined,
  helperText: JSX.Element | null
) => JSX.Element;

type ObjectOtherChildren<K extends keyof ObjectSettings> = (
  value: ObjectSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

type CreatureChildControl<K extends keyof CreatureSettings> = (
  controlled: boolean,
  value: CreatureSettings[K] | undefined,
  helperText: JSX.Element | null
) => JSX.Element;

type CreatureOtherChildren<K extends keyof CreatureSettings> = (
  value: CreatureSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

export interface ItemSettingsProps<K extends keyof ItemSettings> extends BaseOverrideCardProps {
  type?: ItemType;
  setting: K;
  children: { control: ItemChildControl<K>; other?: ItemOtherChildren<K> };
  level?: 0 | 1;
}

export interface ObjectSettingsProps<K extends keyof ObjectSettings> extends BaseOverrideCardProps {
  type?: ObjectType | ObjectSubCategory;
  setting: K;
  children: { control: ObjectChildControl<K>; other?: ObjectOtherChildren<K> };
  level?: 0 | 1 | 2;
}

export interface CreatureSettingsProps<K extends keyof CreatureSettings> extends BaseOverrideCardProps {
  type?: CreatureType;
  setting: K;
  children: { control: CreatureChildControl<K>; other?: CreatureOtherChildren<K> };
  level?: 0 | 1;
}

export interface BaseOverrideCardProps {
  title?: string;
  onOverrideChange?: (overridden: boolean) => void;
  layout?: 'card' | 'inline' | 'subcard';
  controlStyle?: 'single' | 'multiple';
  sx?: SxProps<Theme> | undefined;
  wrapperSx?: SxProps<Theme> | undefined;
  disabled: boolean;
}

function useOverrideCard(props: BaseOverrideCardProps) {
  const { title, onOverrideChange, layout = 'card', controlStyle = 'single', sx, wrapperSx, disabled } = props;
  const [overridden, setOverridden] = useState(false);

  const overrideControl = useMemo(
    () => (
      <Checkbox
        label="Override"
        checked={overridden}
        size="small"
        onChange={(newValue) => {
          if (onOverrideChange) {
            onOverrideChange(newValue);
          }
        }}
        disabled={disabled}
      />
    ),
    [onOverrideChange, overridden, disabled]
  );

  const renderHelperText = useCallback(
    (controlledByText: string) => (
      <FormHelperText
        component="div"
        sx={
          layout === 'inline' ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0 } : {}
        }
      >
        <Box>{!overridden ? `Controlled by ${controlledByText}` : ''}</Box>
        {layout === 'inline' ? overrideControl : null}
      </FormHelperText>
    ),
    [layout, overridden, overrideControl]
  );

  const render = useCallback(
    (preRenderedControl: JSX.Element, renderedOther: JSX.Element | JSX.Element[] | null) => {
      const renderedControl = controlStyle === 'single' ? <FormBox>{preRenderedControl}</FormBox> : preRenderedControl;
      const content = renderedOther ? (
        <Box
          sx={{
            display: 'grid',
            alignItems: 'flex-start',
            ...wrapperSx
          }}
        >
          {renderedControl}
          {renderedOther}
        </Box>
      ) : (
        renderedControl
      );

      const blankTitle = layout === 'card' || layout === 'subcard' ? <Box /> : null;

      const renderedTitle = title ? (
        <Typography gutterBottom variant={layout === 'card' ? 'h6' : 'subtitle2'} component="div">
          {title}
        </Typography>
      ) : (
        blankTitle
      );

      if (layout === 'card') {
        return (
          <Card sx={{ ...sx }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {renderedTitle}
              {overrideControl}
            </Box>
            {content}
          </Card>
        );
      }

      if (layout === 'subcard') {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ...sx }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {renderedTitle}
              {overrideControl}
            </Box>
            {content}
          </Box>
        );
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'start', width: '100%', ...sx }}>
          {renderedTitle}
          {content}
        </Box>
      );
    },
    [controlStyle, layout, overrideControl, sx, title, wrapperSx]
  );

  return { overridden, setOverridden, renderHelperText, render };
}

export const OverriddenObjectPropertyCard = <K extends keyof ObjectSettings>(props: ObjectSettingsProps<K>) => {
  const { setting, type, children, level = 0 } = props;

  const { overridden, setOverridden, renderHelperText, render } = useOverrideCard(props);

  const categoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const subCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);

  const { value, controlledBy } = getObjectSetting(setting, type, categoriesByKey, subCategoriesByKey) as {
    value: ObjectSettings[K];
    controlledBy: 0 | 1 | 2;
  };

  const { control, other } = children;

  useEffect(() => {
    setOverridden(controlledBy === level);
  }, [controlledBy, level, setOverridden]);

  const helperText = useMemo(
    () => renderHelperText(controlledBy === 1 ? 'sub category' : 'category'),
    [controlledBy, renderHelperText]
  );

  const preRenderedControl = useMemo(
    () => control(controlledBy > level && !overridden, value, helperText),
    [control, controlledBy, helperText, level, overridden, value]
  );

  const renderedOther = useMemo(() => (other ? other(value) : null), [other, value]);

  return render(preRenderedControl, renderedOther);
};

export const OverriddenItemPropertyCard = <K extends keyof ItemSettings>(props: ItemSettingsProps<K>) => {
  const { setting, type, children, level = 0 } = props;

  const { overridden, setOverridden, renderHelperText, render } = useOverrideCard(props);

  const categoriesByKey = useAppSelector(selectItemCategoriesByKey);

  const { value, controlledBy } = getItemSetting(setting, type, categoriesByKey) as {
    value: ItemSettings[K];
    controlledBy: 0 | 1;
  };

  const { control, other } = children;

  useEffect(() => {
    setOverridden(controlledBy === level);
  }, [controlledBy, level, setOverridden]);

  const helperText = useMemo(() => renderHelperText('category'), [renderHelperText]);

  const preRenderedControl = useMemo(
    () => control(controlledBy > level && !overridden, value, helperText),
    [control, controlledBy, helperText, level, overridden, value]
  );

  const renderedOther = useMemo(() => (other ? other(value) : null), [other, value]);

  return render(preRenderedControl, renderedOther);
};

export const OverriddenCreaturePropertyCard = <K extends keyof CreatureSettings>(props: CreatureSettingsProps<K>) => {
  const { setting, type, children, level = 0 } = props;

  const { overridden, setOverridden, renderHelperText, render } = useOverrideCard(props);

  const categoriesByKey = useAppSelector(selectCreatureCategoriesByKey);

  const { value, controlledBy } = getCreatureSetting(setting, type, categoriesByKey) as {
    value: CreatureSettings[K];
    controlledBy: 0 | 1;
  };

  const { control, other } = children;

  useEffect(() => {
    setOverridden(controlledBy === level);
  }, [controlledBy, level, setOverridden]);

  const helperText = useMemo(() => renderHelperText('category'), [renderHelperText]);

  const preRenderedControl = useMemo(
    () => control(controlledBy > level && !overridden, value, helperText),
    [control, controlledBy, helperText, level, overridden, value]
  );

  const renderedOther = useMemo(() => (other ? other(value) : null), [other, value]);

  return render(preRenderedControl, renderedOther);
};
