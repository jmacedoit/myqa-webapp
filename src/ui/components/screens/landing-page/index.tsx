
/*
 * Module dependencies.
 */

import Hero from './hero';
import HowItWorks from './how-it-works';
import React from 'react';

/*
 * Styles.
 */

/*
 * Landing page component.
 */

function LandingPage() {
  return (
    <div>
      <Hero />

      <HowItWorks />
    </div>
  );
}

/*
 * Export the component.
 */

export default React.memo(LandingPage);
