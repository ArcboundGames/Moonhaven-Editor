/* eslint-disable react/no-array-index-key */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';

import { OBJECT_SPRITE_TARGET_SIZE } from '../../../../../../../../SharedLibrary/src/constants';
import Card from '../../../../widgets/layout/Card';
import SpriteImage from '../../../../widgets/SpriteImage';
import { SpriteExtraData } from './SpriteExtraData';

import type { Section, Sprite } from '../../../../../../../../SharedLibrary/src/interface';

export interface SpriteFieldsProps {
  section: Section;
  index: number;
  total: number;
  dataKey: string;
  dataKeyChanged: boolean;
  spriteWidth: number | undefined;
  spriteHeight: number | undefined;
  showDefaultSprite: boolean;
  defaultSprite: number | undefined;
  canChangeDefaultSprite: boolean;
  onDefaultSpriteChange: ((defaultSprite: number) => void) | undefined;
  disabled: boolean;
  sprite: Sprite | undefined;
  onChange: (index: number, sprite: Partial<Sprite>) => void;
}

const SpriteFields = ({
  section,
  index,
  total,
  dataKey,
  dataKeyChanged,
  spriteWidth,
  spriteHeight,
  showDefaultSprite,
  defaultSprite,
  canChangeDefaultSprite,
  onDefaultSpriteChange,
  disabled,
  sprite,
  onChange
}: SpriteFieldsProps) => {
  const image = useMemo(() => {
    if (dataKeyChanged) {
      return null;
    }

    return (
      <Box
        key={`${section}-sprite-${index}`}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            m: 1,
            mt: 2,
            mb: 2,
            height: `${
              spriteHeight
                ? Math.floor(OBJECT_SPRITE_TARGET_SIZE / spriteHeight) * spriteHeight
                : OBJECT_SPRITE_TARGET_SIZE
            }px`
          }}
        >
          <Box sx={{ ml: 1 }}>
            <SpriteImage
              dataKey={dataKey}
              width={spriteWidth}
              height={spriteHeight}
              sprite={index}
              type={section}
              targetSize={
                spriteHeight
                  ? Math.floor(OBJECT_SPRITE_TARGET_SIZE / spriteHeight) * spriteHeight
                  : OBJECT_SPRITE_TARGET_SIZE
              }
            />
          </Box>
        </Box>
      </Box>
    );
  }, [dataKey, dataKeyChanged, index, section, spriteHeight, spriteWidth]);

  return (
    <Box sx={index < total - 1 ? { borderBottom: 1, borderColor: 'divider', pb: 2 } : {}}>
      <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
        {`Sprite ${index + 1}`}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {image}
        <SpriteExtraData
          index={index}
          showDefaultSprite={showDefaultSprite}
          defaultSprite={defaultSprite}
          canChangeDefaultSprite={canChangeDefaultSprite}
          onDefaultSpriteChange={onDefaultSpriteChange}
          disabled={disabled}
          sprite={sprite}
          onChange={onChange}
        />
      </Box>
    </Box>
  );
};

export interface SpritesCardProps {
  section: Section;
  spriteCount: number;
  dataKey: string;
  dataKeyChanged: boolean;
  spriteWidth: number | undefined;
  spriteHeight: number | undefined;
  showDefaultSprite?: boolean;
  defaultSprite?: number;
  canChangeDefaultSprite?: boolean;
  onDefaultSpriteChange?: (defaultSprite: number) => void;
  disabled: boolean;
  sprites: Record<string, Sprite | undefined> | undefined;
  onChange: (index: number, sprite: Partial<Sprite>) => void;
}

// eslint-disable-next-line react/display-name
const SpritesCard = React.memo(
  ({
    section,
    spriteCount,
    dataKey,
    dataKeyChanged,
    spriteWidth,
    spriteHeight,
    showDefaultSprite,
    defaultSprite,
    canChangeDefaultSprite,
    onDefaultSpriteChange,
    disabled,
    sprites,
    onChange
  }: SpritesCardProps) => {
    return (
      <Card header="Sprites">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        {[...Array(spriteCount)].map((_, index) => (
          <SpriteFields
            key={`sprite-${index}`}
            section={section}
            index={index}
            total={spriteCount}
            dataKey={dataKey}
            dataKeyChanged={dataKeyChanged}
            spriteWidth={spriteWidth}
            spriteHeight={spriteHeight}
            showDefaultSprite={showDefaultSprite ?? false}
            defaultSprite={showDefaultSprite ? defaultSprite : undefined}
            canChangeDefaultSprite={Boolean(showDefaultSprite && canChangeDefaultSprite)}
            onDefaultSpriteChange={showDefaultSprite ? onDefaultSpriteChange : undefined}
            disabled={disabled}
            sprite={sprites?.[index]}
            onChange={onChange}
          />
        ))}
      </Card>
    );
  }
);

export default SpritesCard;
