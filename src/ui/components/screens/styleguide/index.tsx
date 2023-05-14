
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { units } from 'src/ui/styles/dimensions';
import React, { useEffect, useRef } from 'react';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * StyledContainer.
 */

const StyledContainer = styled(Container)`
  padding-top: ${units(10)}px;
`;

/*
 * Export Styleguide.
 */

function Styleguide() {
  return (
    <>
      <StyledContainer>
        <Row>
          <Col xs={12}>
            <Type.H1>
              {'This is where it starts'}
            </Type.H1>

            <Type.H2>
              {'Why'}
            </Type.H2>

            <Type.H3>
              {'The beginning'}
            </Type.H3>

            <Type.H4>
              {'First stage'}
            </Type.H4>

            <Type.Paragraph>
              {`This is an example of a paragraph element in JSX. It can be used to display text or other content in a structured and readable format. Paragraphs are typically used to break up large blocks of text into smaller, more manageable chunks. They can also be used to add spacing and visual hierarchy to a page or application.`}
            </Type.Paragraph>

            <Type.Paragraph>
              {`One of the primary goals of astronomy is to understand the origins, evolution, and current state of the universe. Astronomers study the properties and behavior of celestial objects such as stars, galaxies, and planets to understand how they formed and how they will change over time. They also study the fundamental laws of physics and how they apply to the universe, such as gravity, electromagnetism, and quantum mechanics. Astronomy has played a significant role in our understanding of the universe and has led to major discoveries such as the existence of black holes, the age of the universe, and the discovery of planets beyond our solar system.`}
            </Type.Paragraph>

            <Type.Small>
              {`The Moon is slowly drifting away from Earth at a rate of approximately 3.8 centimeters per year.`}
            </Type.Small>
          </Col>
        </Row>
      </StyledContainer>
    </>
  );
}

export default React.memo(Styleguide);
