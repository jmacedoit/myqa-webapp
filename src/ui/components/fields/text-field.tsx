
/*
 * Module dependencies.
 */

import { FieldProps, connectField, filterDOMProps } from 'uniforms';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { palette } from 'src/ui/styles/colors';
import React from 'react';
import TextField, {
  TextFieldProps as MUITextFieldProps
} from '@mui/material/TextField';

export type TextFieldProps = FieldProps<string, MUITextFieldProps> & { showMaskPasswordControl?: boolean };

/*
 * TextField component.
 */

function CustomTextField({
  disabled,
  error,
  errorMessage,
  helperText,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  readOnly,
  showInlineError,
  showMaskPasswordControl = false,
  type = 'text',
  value = '',
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  let manipulatedType = type;

  if (showMaskPasswordControl) {
    manipulatedType = showPassword ? 'text' : 'password';
  }

  return (
    <TextField
      InputLabelProps={{ required: false }}
      disabled={disabled}
      error={!!error}
      fullWidth
      helperText={!!error && showInlineError && errorMessage || helperText}
      inputProps={{ readOnly }}
      label={label}
      margin='dense'
      name={name}
      onChange={event => disabled || onChange(event.target.value)}
      placeholder={placeholder}
      ref={inputRef}
      type={manipulatedType}
      value={value}
      {...filterDOMProps(props)}
      InputProps={{
        endAdornment: !showMaskPasswordControl ? null : (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              edge='end'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff sx={{ color: palette.extraDarkGreen }} /> : <Visibility sx={{ color: palette.extraDarkGreen }} />}
            </IconButton>
          </InputAdornment>
        ),
        required: false
      }}
    />
  );
}

/*
 * Export `TextField` component.
 */

export default connectField<TextFieldProps>(CustomTextField, { kind: 'leaf' });
