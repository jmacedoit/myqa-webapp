
/*
 * Module dependencies.
 */

import { properties } from 'src/utils/types';

/*
 * Export breakpoints.
 */

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1380,
  xxl: 1600,
  xxxl: 1920
};

export default breakpoints;

export const breakpointKeys = properties<typeof breakpoints>(breakpoints);
