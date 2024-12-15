
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import Footer from 'src/ui/components/footer';
import React from 'react';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';

/*
 * Styles.
 */

export const PageWrapper = styled.div`
  background-color: ${palette.darkGreen};
  width: 100%;
`;

const NoAutoMarginContainer = styled(Container)`
`;

const FillContainer = styled(NoAutoMarginContainer)<{ subtractHeight: number }>`
  min-height: calc(100vh - ${props => props.subtractHeight}px);
  height: 100%;
`;

/*
 * StandardPage component.
 */

function StandardPage(props: { children: React.ReactNode }) {
  const { height, observe } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      unobserve();
      observe();
    }
  });

  return (
    <PageWrapper>
      <FillContainer subtractHeight={height}>
        {props.children}
      </FillContainer>

      <NoAutoMarginContainer>
        <Row>
          <Col xs={12}>
            <div ref={observe}>
              <Footer color={palette.mildGreenDark} />
            </div>
          </Col>
        </Row>
      </NoAutoMarginContainer>
    </PageWrapper>
  );
}

/*
 * Export `StandardPage`.
 */

export default React.memo(StandardPage);
