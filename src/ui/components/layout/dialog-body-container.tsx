
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Export `DialogBodyContainer` component.
 */

export const DialogBodyContainer = styled.div`
  box-shadow: 0px 0px 75px 0px rgba(33,47,27,0.10);
  padding: ${units(2)}px;
  border-radius: ${units(2)}px;
  background-color: ${palette.oliveGreen};
  max-height: 80vh;
  overflow-y: auto;
`;
