
/*
 * Module dependencies.
 */

import { defaultRootFontSizePx } from 'src/ui/styles/global';
import { prop } from 'styled-tools';
import { units } from 'src/ui/styles/dimensions';
import styled from 'styled-components';

/*
 * Title components.
 */

export const H1 = styled.h1`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: ${78 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(5)}px;
  margin-top: 0;
`;

export const H1Strong = styled(H1)`
  font-weight: bold;
`;

export const H2 = styled.h2`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${60 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(3)}px;
  margin-top: 0;
`;

export const H2Strong = styled.h2`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${60 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;;
  color: ${prop('color', 'inherit')};
  margin-bottom: ${units(3)}px;
  margin-top: 0;
`;

export const H3 = styled.h3`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${48 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;
  margin-bottom: ${units(3)}px;
  margin-top: 0;
`;

export const H4 = styled.h4`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${36 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const H5 = styled.h5`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: ${28 / defaultRootFontSizePx}rem;
  line-height: 0.967;
  letter-spacing: -0.05em;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const Paragraph = styled.p`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: ${18 / defaultRootFontSizePx}rem;
  line-height: 1.3333;
  letter-spacing: -0.05em;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const ParagraphLarge = styled.p`
  font-family: 'Moderat', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: ${24 / defaultRootFontSizePx}rem;
  line-height: 1.3333;
  letter-spacing: -0.05em;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const Small = styled.small`
  font-family: 'Moderat', sans-serif, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: ${14 / defaultRootFontSizePx}rem;
  line-height: 1.3333;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

export const SmallStrong = styled(Small)`
  font-weight: 500;
`;

export const XSmall = styled.small`
  font-family: 'Moderat', sans-serif, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: ${12 / defaultRootFontSizePx}rem;
  line-height: 1.3333;
  margin-bottom: ${units(2)}px;
  margin-top: 0;
`;

/*
 * Export Type.
 */

export default {
  H1,
  H1Strong,
  H2,
  H2Strong,
  H3,
  H4,
  Paragraph,
  ParagraphLarge,
  Small,
  SmallStrong,
  XSmall
};
