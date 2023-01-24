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

/**
 * Boolean Utils
 */
interface BooleanControlProps {
  label: string | undefined;
  onChange: (newValue: boolean) => void;
  disabled: boolean;
  controlled: boolean;
  value: boolean | undefined;
  helperText: JSX.Element | null;
}

export const BooleanControl = ({ label, onChange, disabled, controlled, value, helperText }: BooleanControlProps) => {
  return (
    <Checkbox
      key="checkbox"
      label={label ?? ''}
      checked={value}
      onChange={onChange}
      disabled={disabled || controlled}
      helperText={helperText}
    />
  );
};

/**
 * Override Card
 */

type ItemChildControl<K extends keyof ItemSettings> = (props: {
  controlled: boolean;
  value: ItemSettings[K] | undefined;
  onChange: (newValue: ItemSettings[K]) => void;
  helperText: JSX.Element | null;
}) => JSX.Element;

type ItemOtherChildren<K extends keyof ItemSettings> = (
  value: ItemSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

type ObjectChildControl<K extends keyof ObjectSettings> = (props: {
  controlled: boolean;
  value: ObjectSettings[K] | undefined;
  onChange: (newValue: ObjectSettings[K]) => void;
  helperText: JSX.Element | null;
}) => JSX.Element;

type ObjectOtherChildren<K extends keyof ObjectSettings> = (
  value: ObjectSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

type CreatureChildControl<K extends keyof CreatureSettings> = (props: {
  controlled: boolean;
  value: CreatureSettings[K] | undefined;
  onChange: (newValue: CreatureSettings[K]) => void;
  helperText: JSX.Element | null;
}) => JSX.Element;

type CreatureOtherChildren<K extends keyof CreatureSettings> = (
  value: CreatureSettings[K] | undefined
) => JSX.Element | JSX.Element[] | null;

export interface BaseItemSettingsProps<K extends keyof ItemSettings> extends BaseOverrideCardProps {
  type: ItemType;
  setting: K;
  defaultValue: Required<ItemSettings>[K];
  onChange: (value: ItemType) => void;
  children: { control: ItemChildControl<K>; other?: ItemOtherChildren<K> };
  level?: 0 | 1;
}

export interface VariantItemSettingsProps<K extends keyof ItemSettings>
  extends Omit<BaseItemSettingsProps<K>, 'children'> {
  variant: 'boolean';
  children?: { other?: ItemOtherChildren<K> };
}

export type ItemSettingsProps<K extends keyof ItemSettings> = BaseItemSettingsProps<K> | VariantItemSettingsProps<K>;

export interface BaseObjectSettingsProps<K extends keyof ObjectSettings, T extends ObjectType | ObjectSubCategory>
  extends BaseOverrideCardProps {
  type: T;
  setting: K;
  defaultValue: Required<ObjectSettings>[K];
  onChange: (value: T) => void;
  children: { control: ObjectChildControl<K>; other?: ObjectOtherChildren<K> };
  level?: 0 | 1 | 2;
}

export interface VariantObjectSettingsProps<K extends keyof ObjectSettings, T extends ObjectType | ObjectSubCategory>
  extends Omit<BaseObjectSettingsProps<K, T>, 'children'> {
  variant: 'boolean';
  children?: { other?: ObjectOtherChildren<K> };
}

export type ObjectSettingsProps<K extends keyof ObjectSettings, T extends ObjectType | ObjectSubCategory> =
  | BaseObjectSettingsProps<K, T>
  | VariantObjectSettingsProps<K, T>;

export interface BaseCreatureSettingsProps<K extends keyof CreatureSettings> extends BaseOverrideCardProps {
  type: CreatureType;
  setting: K;
  defaultValue: Required<CreatureSettings>[K];
  onChange: (value: CreatureType) => void;
  children: { control: CreatureChildControl<K>; other?: CreatureOtherChildren<K> };
  level?: 0 | 1;
}

export interface VariantCreatureSettingsProps<K extends keyof CreatureSettings>
  extends Omit<BaseCreatureSettingsProps<K>, 'children'> {
  variant: 'boolean';
  children?: { other?: CreatureOtherChildren<K> };
}

export type CreatureSettingsProps<K extends keyof CreatureSettings> =
  | BaseCreatureSettingsProps<K>
  | VariantCreatureSettingsProps<K>;

export interface BaseOverrideCardProps {
  title?: string;
  label?: string;
  layout?: 'card' | 'inline' | 'subcard';
  controlStyle?: 'single' | 'multiple';
  sx?: SxProps<Theme> | undefined;
  wrapperSx?: SxProps<Theme> | undefined;
  disabled: boolean;
}

interface UseOverrideCardProps {
  title: string | undefined;
  layout: 'card' | 'inline' | 'subcard' | undefined;
  controlStyle: 'single' | 'multiple' | undefined;
  sx: SxProps<Theme> | undefined;
  wrapperSx: SxProps<Theme> | undefined;
  disabled: boolean;
  onChange: (overriden: boolean) => void;
}

function useOverrideCard({
  title,
  onChange,
  layout = 'card',
  controlStyle = 'single',
  sx,
  wrapperSx,
  disabled
}: UseOverrideCardProps) {
  const [overridden, setOverridden] = useState(false);

  const overrideControl = useMemo(
    () => (
      <Checkbox
        label="Override"
        checked={overridden}
        size="small"
        onChange={(newValue) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        disabled={disabled}
      />
    ),
    [overridden, disabled, onChange]
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

type AllSettings = ObjectSettings | ItemSettings | CreatureSettings;
type AllTypes<S extends AllSettings> = S extends ObjectSettings
  ? ObjectType | ObjectSubCategory
  : S extends ItemSettings
  ? ItemType
  : CreatureType;

interface UseOnChangeProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>> {
  setting: K;
  type: T;
  onChange: (newValue: T) => void;
}

const useOnChange = function <S extends AllSettings, K extends keyof S, T extends AllTypes<S>>({
  onChange,
  type,
  setting
}: UseOnChangeProps<S, K, T>) {
  return useCallback(
    (newValue: S[K] | undefined) => {
      onChange({
        ...type,
        settings: {
          ...type.settings,
          [setting]: newValue
        }
      } as T);
    },
    [onChange, setting, type]
  );
};

interface UseOnOverrideChangeProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>> {
  setting: K;
  defaultValue: S[K];
  type: T;
  onChange: (newValue: T) => void;
}

const useOnOverrideChange = function <S extends AllSettings, K extends keyof S, T extends AllTypes<S>>({
  onChange,
  type,
  setting,
  defaultValue
}: UseOnOverrideChangeProps<S, K, T>) {
  const handleOnChange = useOnChange<S, K, T>({ onChange, type, setting });

  return useCallback(
    (overriden: boolean) => {
      handleOnChange(overriden ? defaultValue : undefined);
    },
    [defaultValue, handleOnChange]
  );
};

interface UseOnControlChangeProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>> {
  setting: K;
  controlled: boolean;
  type: T;
  onChange: (newValue: T) => void;
}

const useOnControlChange = function <S extends AllSettings, K extends keyof S, T extends AllTypes<S>>({
  onChange,
  type,
  setting,
  controlled
}: UseOnControlChangeProps<S, K, T>) {
  const handleOnChange = useOnChange<S, K, T>({ onChange, type, setting });

  return useCallback(
    (newValue: S[K]) => {
      if (controlled) {
        return;
      }
      handleOnChange(Array.isArray(newValue) && newValue.length === 0 ? undefined : newValue);
    },
    [controlled, handleOnChange]
  );
};

type ChildControl<S extends AllSettings, K extends keyof S> = (props: {
  controlled: boolean;
  value: S[K] | undefined;
  onChange: (newValue: S[K]) => void;
  helperText: JSX.Element | null;
}) => JSX.Element;

type OtherChildren<S extends AllSettings, K extends keyof S> = (
  value: S[K] | undefined
) => JSX.Element | JSX.Element[] | null;

interface BaseUseRenderedComponentsProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>>
  extends BaseOverrideCardProps {
  controlledBy: number;
  level?: number;
  setting: K;
  defaultValue: S[K];
  type: T;
  onChange: (newValue: T) => void;
  children: { control: ChildControl<S, K>; other?: OtherChildren<S, K> };
  value: S[K] | undefined;
}

interface VariantUseRenderedComponentsProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>>
  extends Omit<BaseUseRenderedComponentsProps<S, K, T>, 'children'> {
  variant: 'boolean';
  children?: { other?: OtherChildren<S, K> };
}

export type UseRenderedComponentsProps<S extends AllSettings, K extends keyof S, T extends AllTypes<S>> =
  | BaseUseRenderedComponentsProps<S, K, T>
  | VariantUseRenderedComponentsProps<S, K, T>;

function isVariant<S extends AllSettings, K extends keyof S, T extends AllTypes<S>>(
  props: UseRenderedComponentsProps<S, K, T>
): props is VariantUseRenderedComponentsProps<S, K, T> {
  return Boolean('variant' in props && props.variant);
}

const useRenderedComponents = <S extends AllSettings, K extends keyof S, T extends AllTypes<S>>(
  props: UseRenderedComponentsProps<S, K, T>
) => {
  const {
    onChange,
    setting,
    type,
    defaultValue,
    controlledBy,
    title,
    label,
    level = 0,
    layout,
    controlStyle,
    sx,
    wrapperSx,
    disabled,
    value
  } = props;

  const onOverrideChange = useOnOverrideChange<S, K, T>({ onChange, setting, type, defaultValue });

  const { overridden, setOverridden, renderHelperText, render } = useOverrideCard({
    title,
    layout,
    controlStyle,
    sx,
    wrapperSx,
    disabled,
    onChange: onOverrideChange
  });

  useEffect(() => {
    setOverridden(controlledBy === level);
  }, [controlledBy, level, setOverridden]);

  const helperText = useMemo(
    () => renderHelperText(controlledBy === 1 ? 'sub category' : 'category'),
    [controlledBy, renderHelperText]
  );

  const controlled = useMemo(() => controlledBy > level && !overridden, [controlledBy, level, overridden]);

  const onControlChange = useOnControlChange<S, K, T>({ onChange, setting, type, controlled });

  const preRenderedControl = useMemo(() => {
    if (isVariant(props)) {
      return (
        <BooleanControl
          label={label ?? title}
          controlled={controlled}
          value={value === undefined ? undefined : Boolean(value)}
          helperText={helperText}
          disabled={disabled}
          onChange={onChange as unknown as (newValue: boolean) => void}
        />
      );
    } else {
      return props.children.control({
        controlled: controlledBy > level && !overridden,
        value,
        helperText,
        onChange: onControlChange
      });
    }
  }, [
    controlled,
    controlledBy,
    disabled,
    helperText,
    label,
    level,
    onChange,
    onControlChange,
    overridden,
    props,
    title,
    value
  ]);

  const renderedOther = useMemo(
    () => (props.children?.other ? props.children?.other(value) : null),
    [props.children, value]
  );

  return useMemo(() => render(preRenderedControl, renderedOther), [preRenderedControl, render, renderedOther]);
};

export const OverriddenObjectPropertyCard = <K extends keyof ObjectSettings, T extends ObjectType | ObjectSubCategory>(
  props: ObjectSettingsProps<K, T>
) => {
  const { setting, type } = props;

  const categoriesByKey = useAppSelector(selectObjectCategoriesByKey);
  const subCategoriesByKey = useAppSelector(selectObjectSubCategoriesByKey);
  const { value, controlledBy } = getObjectSetting(setting, type, categoriesByKey, subCategoriesByKey);

  return useRenderedComponents({ ...props, value, controlledBy });
};

export const OverriddenItemPropertyCard = <K extends keyof ItemSettings>(props: ItemSettingsProps<K>) => {
  const { setting, type } = props;

  const categoriesByKey = useAppSelector(selectItemCategoriesByKey);
  const { value, controlledBy } = getItemSetting(setting, type, categoriesByKey);

  return useRenderedComponents({ ...props, value, controlledBy });
};

export const OverriddenCreaturePropertyCard = <K extends keyof CreatureSettings>(props: CreatureSettingsProps<K>) => {
  const { setting, type } = props;

  const categoriesByKey = useAppSelector(selectCreatureCategoriesByKey);
  const { value, controlledBy } = getCreatureSetting(setting, type, categoriesByKey);

  return useRenderedComponents({ ...props, value, controlledBy });
};
