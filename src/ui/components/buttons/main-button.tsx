
/*
 * Module dependencies.
 */

import { ButtonProps } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { defaultRootFontSizePx } from 'src/ui/styles/global';
import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import React from 'react';

/*
 * Styles.
 */

const buttonStyles = (props: ButtonProps & { outlined?: boolean }) => {
  return {
    appearance: 'none',
    border: props.outlined ? `1px solid ${palette.darkGreen}` : 'none',
    boxSizing: 'border-box',
    padding: `${props.outlined ? units(1.25) : units(1.25) + 1}px ${units(3)}px`,
    margin: 0,
    cursor: 'pointer',
    textTransform: 'none',
    fontWeight: 'normal',
    color: props.outlined ? palette.darkGreen : palette.white,
    backgroundColor: props.outlined ? 'transparent' : palette.neonGreen,
    borderRadius: `${units(8)}px`,
    fontStyle: 'normal',
    fontSize: `${18 / defaultRootFontSizePx}rem`,
    lineHeight: 1.3333,
    letterSpacing: '-0.05em',
    boxShadow: 'none',
    '&:focus': {
      outline: 'none'
    },
    '&:hover': {
      backgroundColor: props.outlined ? palette.oliveGreen : palette.mildGreen
    },
    '& .MuiLoadingButton-loadingIndicator': {
      color: props.outlined ? palette.darkGreen : palette.white
    }
  };
};

/*
 * File field component.
 */

function MainButton({ outlined, ...props }: ButtonProps & { outlined?: boolean, loading?: boolean }) {
  return (
    <LoadingButton
      sx={buttonStyles({ outlined })}
      {...props}
    />
  );
}

export default MainButton;
