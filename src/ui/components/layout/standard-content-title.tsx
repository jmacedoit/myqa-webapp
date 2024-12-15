
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Export `StandardContentTitle` component.
 */

export const StandardContentTitle = styled(Type.H3)`
  color: ${palette.white};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: clip
`;
