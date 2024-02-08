import Box from '@mui/material/Box';

import Checkbox from '../../../../widgets/form/Checkbox';
import NumberTextField from '../../../../widgets/form/NumberTextField';
import Card from '../../../../widgets/layout/Card';
import FormBox from '../../../../widgets/layout/FormBox';
import CampSpawnCard from './widgets/CampSpawnCard';

import type { CreatureType } from '../../../../../../../../SharedLibrary/src/interface';

export interface CreatureTypeSpawningTabProps {
  data: CreatureType;
  disabled: boolean;
  handleOnChange: (input: Partial<CreatureType>) => void;
}

const CreatureTypeSpawningTab = ({ data, disabled, handleOnChange }: CreatureTypeSpawningTabProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <Card header="General">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <NumberTextField
                label="Min Spawn Distance From Players"
                value={data.spawnDistanceMinFromPlayers}
                min={0}
                max={100}
                onChange={(value) =>
                  handleOnChange({
                    spawnDistanceMinFromPlayers: value
                  })
                }
                required
                disabled={disabled}
                error={data.spawnDistanceMinFromPlayers > data.spawnDistanceMaxFromPlayers}
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Max Spawn Distance From Players"
                value={data.spawnDistanceMaxFromPlayers}
                min={0}
                max={100}
                onChange={(value) =>
                  handleOnChange({
                    spawnDistanceMaxFromPlayers: value
                  })
                }
                required
                disabled={disabled}
                error={data.spawnDistanceMinFromPlayers > data.spawnDistanceMaxFromPlayers}
              />
            </FormBox>
            <FormBox>
              <NumberTextField
                label="Despawn Distance From Players"
                value={data.despawnDistanceFromPlayers}
                min={0}
                max={100}
                onChange={(value) =>
                  handleOnChange({
                    despawnDistanceFromPlayers: value
                  })
                }
                required
                disabled={disabled}
                error={
                  data.despawnDistanceFromPlayers > 0 &&
                  data.despawnDistanceFromPlayers <= data.spawnDistanceMaxFromPlayers
                }
              />
            </FormBox>
          </Box>
        </Card>
        <Card header="Random Spawns">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <FormBox>
              <Checkbox
                label="Enabled"
                checked={data.randomSpawnsEnabled}
                onChange={(value) =>
                  handleOnChange({
                    randomSpawnsEnabled: value
                  })
                }
                disabled={disabled}
              />
            </FormBox>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            {data.randomSpawnsEnabled ? (
              <>
                <FormBox>
                  <NumberTextField
                    label="Max Population"
                    value={data.maxPopulation}
                    min={1}
                    max={250}
                    onChange={(value) =>
                      handleOnChange({
                        maxPopulation: value
                      })
                    }
                    required
                    disabled={disabled}
                    wholeNumber
                  />
                </FormBox>
                <FormBox>
                  <NumberTextField
                    label="Dead Zone"
                    value={data.spawnDeadZoneRadius}
                    min={1}
                    max={250}
                    onChange={(value) =>
                      handleOnChange({
                        spawnDeadZoneRadius: value
                      })
                    }
                    required
                    disabled={disabled}
                    wholeNumber
                  />
                </FormBox>
              </>
            ) : null}
          </Box>
        </Card>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
        <CampSpawnCard
          campSpawns={data.campSpawns}
          onChange={(campSpawns) => handleOnChange({ campSpawns })}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

export default CreatureTypeSpawningTab;
