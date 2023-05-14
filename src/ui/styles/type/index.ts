
/*
 * Module dependencies.
 */

import { prop } from 'styled-tools';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Title components.
 */

export const H1 = styled.h1`
  font-family: 'ObjectSans', sans-serif;
  font-size: 5rem;
  font-weight: bold;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(5)}px;
  margin-top: 0;
`;

export const H2 = styled.h2`
  font-family: 'ObjectSans', sans-serif;
  font-size: 4rem;
  font-weight: bold;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(3)}px;
  margin-top: 0;
`;

export const H3 = styled.h3`
  font-family: 'ObjectSans', sans-serif;
  font-size: 3rem;
  font-weight: bold;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(3)}px;
  margin-top: 0;
`;

export const H4 = styled.h4`
  font-family: 'ObjectSans', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

/*
 * Content components.
 */

export const Paragraph = styled.p`
  font-family: 'ObjectSans', sans-serif;
  font-weight: 300;
  line-height: 1.5rem;
  font-size: 1rem;
  color: ${prop('color', 'inherit')}
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const Small = styled.small`
  font-family: 'ObjectSans', sans-serif;
  font-weight: 300;
  line-height: 1.5rem;
  font-size: 0.8rem;
  color: ${prop('color', 'inherit')}
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

/*
 * Export Type.
 */

export default {
  H1,
  H2,
  H3,
  H4,
  Paragraph,
  Small
};
