
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Container for a knowledge base.
 */

export const halfSpacing = units(2);

export default styled.button<{ inGridOf: number }>`
  all: unset;
  appearance: none;
  box-sizing: border-box;
  cursor: pointer;
  color: ${palette.white};
  background-color: ${palette.extraDarkGreen};
  box-shadow: 0px 4px 25px 5px rgba(4, 24, 18, 0.20);
  border-radius: ${units(2)}px;
  border: 0px solid ${palette.darkGreen};
  display: inline-block;
  margin-bottom: ${2 * halfSpacing}px;
  margin-left: ${halfSpacing}px;
  margin-right: ${halfSpacing}px;
  margin-top: 0;
  outline: none;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 0.2s ease-in-out;
  width: ${props => `calc((100% - ${props.inGridOf} * ${2 * halfSpacing}px) / ${props.inGridOf})`};
  overflow: hidden;

  &:focus-visible {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.5);
  };

  &:hover {
    box-shadow: 0px 4px 25px 5px rgba(4, 24, 18, 0.60);
  };
`;
