
/*
 * Module dependencies.
 */

import { ButtonProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { palette } from 'src/ui/styles/colors';
import { styled as styledMaterial } from '@mui/material/styles';
import { units } from 'src/ui/styles/dimensions';
import React from 'react';

/*
 * Styles.
 */

const StyledLoadingButton = styledMaterial(LoadingButton)<ButtonProps & { filled?: boolean, loading?: boolean }>`
  appearance: none;
  background-color: ${props => props.filled ? palette.extraDarkGreen : 'transparent'};
  border-radius: ${units(2)}px;
  border: none;
  box-shadow: ${props => props.filled ? '0px 4px 25px 5px rgba(4, 24, 18, 0.20), 0px 0px 7px -1px #101E1A, 0px 0px 75px 0px rgba(33, 47, 27, 0.20)' : 'none'}
  box-shadow: none;
  box-sizing: border-box;
  color: ${props => props.filled ? palette.white : 'inherit'};
  cursor: pointer;
  font-size: 1rem;
  font-style: normal;
  font-weight: normal;
  letter-spacing: -0.05em;
  line-height: 1.3333;
  margin: 0;
  padding: ${units(1)}px ${units(2)}px;
  text-transform: none;

  &:focus {
    outline: none;
  }

  &:hover {
    ${props => props.filled ? `background: ${palette.darkGreen};` : ''}
  }

  & .MuiLoadingButton-loadingIndicator {
    color: ${props => props.filled ? palette.white : palette.darkGreen};
    opacity: 0.5;
  }
`;

/*
 * File field component.
 */

function SimpleButton({ ...props }: ButtonProps & { filled?: boolean, loading?: boolean }) {
  return (
    <StyledLoadingButton {...props} />
  );
}

export default SimpleButton;
