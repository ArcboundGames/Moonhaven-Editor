import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import TabPanel from 'renderer/components/widgets/TabPanel';
import { createCreatureSprites, createVector2 } from '../../../../../../../../SharedLibrary/src/util/converters.util';
import { useAppSelector, useDebounce } from '../../../../../hooks';
import { selectPath } from '../../../../../store/slices/data';
import { getSpriteCount } from '../../../../../util/sprite.util';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import SpritesCard from '../widgets/SpritesCard';

import type { CreatureType } from '../../../../../../../../SharedLibrary/src/interface';

export interface CreatureTypeSpriteTabProps {
  dataKeyChanged: boolean;
  data: CreatureType;
  disabled: boolean;
  handleOnChange: (input: Partial<CreatureType>) => void;
}

function a11yProps(index: number) {
  return {
    id: `creature-sprite-${index}`,
    'aria-controls': `creature-sprite-${index}`
  };
}

const CreatureTypeSpriteTab = ({ dataKeyChanged, data, disabled, handleOnChange }: CreatureTypeSpriteTabProps) => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const spriteWidth = useDebounce(data?.sprite?.width, dataKeyChanged ? 0 : 300);
  const spriteHeight = useDebounce(data?.sprite?.height, dataKeyChanged ? 0 : 300);

  const [[spriteCount, idleSpriteCount, deathSpriteCount], setSpriteCount] = useState<[number, number, number]>([
    0, 0, 0
  ]);
  const path = useAppSelector(selectPath);
  useEffect(() => {
    let alive = true;
    const spriteCountGetter = async () => {
      const newSpriteCount =
        path && data ? await getSpriteCount(path, 'creature', data.key, data.sprite?.width, data.sprite?.height) : 0;
      const newIdleSpriteCount =
        path && data
          ? await getSpriteCount(path, 'creature', `${data.key}-idle`, data.sprite?.width, data.sprite?.height)
          : 0;
      const newDeathSpriteCount =
        path && data
          ? await getSpriteCount(path, 'creature', `${data.key}-death`, data.sprite?.width, data.sprite?.height)
          : 0;

      if (alive) {
        setSpriteCount([newSpriteCount, newIdleSpriteCount, newDeathSpriteCount]);
      }
    };

    spriteCountGetter();

    return () => {
      alive = false;
    };
  }, [path, data]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="Sprite">
          <Typography gutterBottom variant="subtitle2" component="div">
            Size
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="Width"
                value={data.sprite?.width}
                onChange={(value) =>
                  handleOnChange({
                    sprite: {
                      ...(data.sprite ?? createCreatureSprites()),
                      width: value ?? 1
                    }
                  })
                }
                disabled={disabled}
                min={16}
                required
                helperText="Pixels"
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Height"
                value={data.sprite?.height}
                onChange={(value) =>
                  handleOnChange({
                    sprite: {
                      ...(data.sprite ?? createCreatureSprites()),
                      height: value ?? 1
                    }
                  })
                }
                disabled={disabled}
                min={16}
                helperText="Pixels"
                wholeNumber
                required
              />
            </FormBox>
          </Box>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ marginTop: 2 }}>
            Pivot Offset
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="X"
                value={data.sprite?.pivotOffset?.x}
                onChange={(value) =>
                  handleOnChange({
                    sprite: {
                      ...(data.sprite ?? createCreatureSprites()),
                      pivotOffset: {
                        ...(data.sprite?.pivotOffset ?? createVector2()),
                        x: value ?? 0
                      }
                    }
                  })
                }
                disabled={disabled}
                error={data.sprite?.pivotOffset !== undefined && data.sprite?.pivotOffset?.x === undefined}
                helperText="Pixels"
                wholeNumber
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Y"
                value={data.sprite?.pivotOffset?.y}
                onChange={(value) =>
                  handleOnChange({
                    sprite: {
                      ...(data.sprite ?? createCreatureSprites()),
                      pivotOffset: {
                        ...(data.sprite?.pivotOffset ?? createVector2()),
                        y: value ?? 0
                      }
                    }
                  })
                }
                disabled={disabled}
                error={data.sprite?.pivotOffset !== undefined && data.sprite?.pivotOffset?.y === undefined}
                helperText="Pixels"
                wholeNumber
              />
            </FormBox>
          </Box>
        </Card>
      </Box>
      {(spriteWidth ?? 0) >= 16 && (spriteHeight ?? 0) >= 16 ? (
        <Box display="flex" flexDirection="column" sx={{ width: '100%', px: 1 }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="creature type sprite tabs">
            <Tab label="Movement" {...a11yProps(0)} />
            <Tab label="Idle" {...a11yProps(1)} />
            <Tab label="Death" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={tab} index={0} sx={{ ml: -1, p: 0 }}>
            <SpritesCard
              key="sprites-card"
              section="creature"
              spriteCount={spriteCount}
              dataKey={data.key}
              dataKeyChanged={dataKeyChanged}
              spriteWidth={spriteWidth}
              spriteHeight={spriteHeight}
              disabled={disabled}
              sprites={data.sprite?.sprites}
              onChange={(index, sprite) => {
                const sprites = { ...(data.sprite?.sprites ?? {}) };
                if (sprite === undefined) {
                  delete sprites[index];
                } else {
                  sprites[index] = sprite;
                }
                handleOnChange({
                  sprite: {
                    ...(data.sprite ?? createCreatureSprites()),
                    sprites
                  }
                });
              }}
            />
          </TabPanel>
          <TabPanel value={tab} index={1} sx={{ ml: -1, p: 0 }}>
            <SpritesCard
              key="sprites-card"
              section="creature"
              spriteCount={idleSpriteCount}
              dataKey={`${data.key}-idle`}
              dataKeyChanged={dataKeyChanged}
              spriteWidth={spriteWidth}
              spriteHeight={spriteHeight}
              disabled={disabled}
              sprites={data.sprite?.idleSprites}
              onChange={(index, sprite) => {
                const idleSprites = { ...(data.sprite?.idleSprites ?? {}) };
                if (sprite === undefined) {
                  delete idleSprites[index];
                } else {
                  idleSprites[index] = sprite;
                }
                handleOnChange({
                  sprite: {
                    ...(data.sprite ?? createCreatureSprites()),
                    idleSprites
                  }
                });
              }}
            />
          </TabPanel>
          <TabPanel value={tab} index={2} sx={{ ml: -1, p: 0 }}>
            <SpritesCard
              key="sprites-card"
              section="creature"
              spriteCount={deathSpriteCount}
              dataKey={`${data.key}-death`}
              dataKeyChanged={dataKeyChanged}
              spriteWidth={spriteWidth}
              spriteHeight={spriteHeight}
              disabled={disabled}
              sprites={data.sprite?.deathSprites}
              onChange={(index, sprite) => {
                const deathSprites = { ...(data.sprite?.deathSprites ?? {}) };
                if (sprite === undefined) {
                  delete deathSprites[index];
                } else {
                  deathSprites[index] = sprite;
                }
                handleOnChange({
                  sprite: {
                    ...(data.sprite ?? createCreatureSprites()),
                    deathSprites
                  }
                });
              }}
            />
          </TabPanel>
        </Box>
      ) : null}
    </Box>
  );
};

export default CreatureTypeSpriteTab;
