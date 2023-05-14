
/*
 * Module dependencies.
 */

import { createGlobalStyle } from 'styled-components';
import { staticUri } from 'src/utils/environment';
import React from 'react';
import colors from 'src/ui/styles/colors';

/*
 * Global style.
 */

export const GlobalStyle = React.memo(createGlobalStyle`
  @font-face {
    font-family: 'Telegraf';
    src: url(${staticUri(`/assets/fonts/Telegraf-UltraLight.otf`)});
    font-weight: 100;
  }

  @font-face {
    font-family: 'Telegraf';
    src: url(${staticUri(`assets/fonts/Telegraf-Regular.otf`)});
    font-weight: 400;
  }

  @font-face {
    font-family: 'Telegraf';
    src: url(${staticUri(`assets/fonts/Telegraf-Bold.otf`)});
    font-weight: 500;
  }

  @font-face {
    font-family: 'Telegraf';
    src: url(${staticUri(`assets/fonts/Telegraf-UltraBold.otf`)});
    font-weight: 800;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-Thin.otf`)});
    font-weight: 200;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-ThinSlanted.otf`)});
    font-weight: 200;
    font-style: italic;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-Regular.otf`)});
    font-weight: 400;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-RegularSlanted.otf`)});
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-Bold.otf`)});
    font-weight: 500;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-BoldSlanted.otf`)});
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-Heavy.otf`)});
    font-weight: 800;
  }


  @font-face {
    font-family: 'ObjectSans';
    descent-override: 0%;
    src: url(${staticUri(`assets/fonts/ObjectSans-HeavySlanted.otf`)});
    font-weight: 800;
    font-style: italic;
  }

  html {
    font-size: 15px;
    font-family: 'ObjectSans', sans-serif;
    color: ${colors.defaultText};
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`);
