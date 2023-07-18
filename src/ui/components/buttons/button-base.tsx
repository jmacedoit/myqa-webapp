
/*
 * Module dependencies.
 */

import { ButtonProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled as styledMaterial } from '@mui/material/styles';

/*
 * Styles.
 */

const ButtonBase = styledMaterial(LoadingButton)<ButtonProps>`
  appearance: none;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 1rem;
  font-style: normal;
  font-weight: normal;
  margin: 0px 0px 0px 0px;
  text-transform: none;
  min-width: 0;

  &:focus {
    outline: none;
  }
`;

export default ButtonBase;
