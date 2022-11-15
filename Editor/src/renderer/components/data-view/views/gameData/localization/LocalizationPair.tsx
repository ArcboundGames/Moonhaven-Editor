import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

import TextField from '../../../../widgets/form/TextField';
import FormBox from '../../../../widgets/layout/FormBox';

interface LocalizationPairProps {
  inputRef: React.RefObject<HTMLInputElement>;
  localizationKey: string;
  defaultValue: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

const LocalizationPair = React.memo(
  ({ inputRef, localizationKey, defaultValue, disabled, onChange }: LocalizationPairProps) => {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '300px 3fr' }}>
        <FormBox key={`localization-key-${localizationKey}`}>
          <Typography variant="body1">{localizationKey}</Typography>
        </FormBox>
        <FormBox key={`localization-value-${localizationKey}-${defaultValue}`}>
          <TextField defaultValue={defaultValue} inputRef={inputRef} required disabled={disabled} onChange={onChange} />
        </FormBox>
      </Box>
    );
  }
);

LocalizationPair.displayName = 'LocalizationPair';

export default LocalizationPair;
