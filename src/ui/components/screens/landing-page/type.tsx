
/*
 * Module dependencies.
 */

import { defaultRootFontSizePx } from 'src/ui/styles/global';
import Type from 'src/ui/styles/type';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Title components.
 */

export const H1 = styled(Type.H1)`
  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${40 / defaultRootFontSizePx}rem;
  }
`;

export const H1Strong = styled(H1)`
  font-weight: bold;
`;

export const H2 = styled(Type.H2)`
  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${34 / defaultRootFontSizePx}rem;
  }
`;

export const H4 = styled(Type.H4)`
  font-size: ${34 / defaultRootFontSizePx}rem;

  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${24 / defaultRootFontSizePx}rem;
  }
`;

export const H5 = styled(Type.H5)`
  font-size: ${28 / defaultRootFontSizePx}rem;

  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${22 / defaultRootFontSizePx}rem;
  }
`;

export const H6 = styled(Type.ParagraphLarge)`
  font-size: ${22 / defaultRootFontSizePx}rem;
`;

export const ParagraphLarge = styled(Type.ParagraphLarge)`
  font-size: ${22 / defaultRootFontSizePx}rem;

  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${18 / defaultRootFontSizePx}rem;
  }
`;

export const Paragraph = styled(Type.Paragraph)`
  font-size: ${18 / defaultRootFontSizePx}rem;

  @media (max-width: ${breakpoints.md - 1}px) {
    font-size: ${14 / defaultRootFontSizePx}rem;
  }
`;

/*
 * Export LandingType.
 */

export default {
  H1,
  H1Strong,
  H2,
  H4,
  H5,
  H6,
  Paragraph,
  ParagraphLarge,
  XSmall: Type.XSmall
};
