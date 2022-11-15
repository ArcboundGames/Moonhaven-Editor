import FormBox from '../layout/FormBox';
import NumberTextField from './NumberTextField';

import type { Vector2 } from '../../../../../../SharedLibrary/src/interface';

interface Vector2FieldProps {
  value: Vector2 | undefined;
  onChange?: (value: Vector2) => void;
  required?: boolean;
  error?: boolean;
  min?: Vector2;
  max?: Vector2;
  disabled?: boolean;
  helperText?: React.ReactNode;
  wholeNumber?: boolean;
}

const Vector2Field = ({
  value,
  onChange,
  required = false,
  error = false,
  min,
  max,
  disabled = false,
  helperText,
  wholeNumber = false
}: Vector2FieldProps) => (
  <>
    <FormBox>
      <NumberTextField
        label="X"
        helperText={helperText}
        value={value?.x}
        onChange={
          onChange
            ? (newValue) =>
                onChange({
                  x: newValue,
                  y: value?.y ?? 0
                })
            : undefined
        }
        disabled={disabled}
        required={required}
        error={
          error ||
          (value?.x !== undefined && min && (Number.isNaN(value.x) || value.x < min.x)) ||
          (value?.x !== undefined && max && (Number.isNaN(value.x) || value.x > max.x))
        }
        wholeNumber={wholeNumber}
      />
    </FormBox>
    <FormBox>
      <NumberTextField
        label="Y"
        helperText={helperText}
        value={value?.y}
        onChange={
          onChange
            ? (newValue) =>
                onChange({
                  x: value?.x ?? 0,
                  y: newValue
                })
            : undefined
        }
        disabled={disabled}
        required={required}
        error={
          error ||
          (value?.y !== undefined && min && (Number.isNaN(value.y) || value.y < min.y)) ||
          (value?.y !== undefined && max && (Number.isNaN(value.y) || value.y > max.y))
        }
        wholeNumber={wholeNumber}
      />
    </FormBox>
  </>
);

export default Vector2Field;
