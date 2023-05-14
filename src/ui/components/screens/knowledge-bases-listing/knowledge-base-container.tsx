
/*
 * Module dependencies.
 */

import { Paper } from '@mui/material';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Container for a knowledge base.
 */

const halfGutter = units(1);

export default styled(Paper)`
  display: inline-block;
  margin-left: ${halfGutter}px;
  margin-right: ${halfGutter}px;
  cursor: pointer;
  text-align: center;
  width: calc((100% - 3 * ${2 * halfGutter}px) / 3);
  position: relative;
  margin-bottom: ${2 * halfGutter}px;
`;
