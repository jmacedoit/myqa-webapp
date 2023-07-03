
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Export `StandardContentContainer` component.
 */

export const StandardContentContainer = styled.div`
  position: relative;
  padding: ${units(4)}px;
  border-radius: ${units(2)}px;
  background-color: ${palette.oliveGreen};
  box-shadow: 0px 4px 25px 5px rgba(4, 24, 18, 0.20), 0px 0px 7px -1px #101E1A, 0px 0px 75px 0px rgba(33, 47, 27, 0.20);
`;
