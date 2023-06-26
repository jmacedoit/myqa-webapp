
/*
 * Module dependencies.
 */

import { createGlobalStyle } from 'styled-components';
import { staticUri } from 'src/utils/environment';
import colors from 'src/ui/styles/colors';

/*
 * Global style.
 */

export const defaultRootFontSizePx = 16;

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Thin-Italic.ttf')}) format('truetype');
    font-weight: 100;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Thin.ttf')}) format('truetype');
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Light-Italic.ttf')}) format('truetype');
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Light.ttf')}) format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Regular-Italic.ttf')}) format('truetype');
    font-weight: normal;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Regular.ttf')}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Medium-Italic.ttf')}) format('truetype');
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Medium.ttf')}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Bold-Italic.ttf')}) format('truetype');
    font-weight: bold;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Bold.ttf')}) format('truetype');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Black-Italic.ttf')}) format('truetype');
    font-weight: 900;
    font-style: italic;
  }

  @font-face {
    font-family: 'Moderat';
    src: url(${staticUri('assets/fonts/Moderat-Black.ttf')}) format('truetype');
    font-weight: 900;
    font-style: normal;
  }



  html {
    font-size: ${defaultRootFontSizePx}px;
    font-family: 'Moderat', sans-serif;
    color: ${colors.defaultText};
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;
