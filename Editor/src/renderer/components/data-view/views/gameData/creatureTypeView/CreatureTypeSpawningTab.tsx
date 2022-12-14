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
                label="Spawn Distance From Players"
                value={data.spawnDistanceFromPlayers}
                min={1}
                max={100}
                onChange={(value) =>
                  handleOnChange({
                    spawnDistanceFromPlayers: value
                  })
                }
                required
                disabled={disabled}
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
            {data.randomSpawnsEnabled ? (
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
