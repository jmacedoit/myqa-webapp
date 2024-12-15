
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import Footer from 'src/ui/components/footer';
import React from 'react';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

export const QuickActionPageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${palette.extraDarkGreen};
`;

const StyledCol = styled(Col)`;
  text-align: center;
`;

const StyledSpacerCol = styled(StyledCol)`
  display: none;

  @media (min-width: ${breakpoints.lg}px) {
    display: initial;
  }
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
`;

const FillRow = styled(Row)`
  align-items: center !important;
  flex: 1 !important;
`;

export const QuickActionPageContentPositioner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${units(10)}px;
  padding-bottom: ${units(10)}px;
`;

const ContentContainer = styled.div`
  width: 100%;
  border-radius: ${units(2)}px;
  background-color: ${palette.lightGreen};
  box-shadow: 0px 0px 75px rgba(33, 47, 27, 0.2), 0px 0px 7px -1px #101E1A, 0px 4px 25px 5px rgba(4, 24, 18, 0.5);
  padding: ${units(6)}px ${units(4)}px;
  color: ${palette.extraDarkGreen};
`;

/*
 * QuickActionPage component.
 */

function QuickActionPage(props: { children: React.ReactNode }) {
  return (
    <QuickActionPageWrapper>
      <StyledContainer>
        <FillRow>
          <StyledSpacerCol
            lg={3}
            xs={0}
          />

          <StyledCol
            lg={6}
            xs={12}
          >
            <QuickActionPageContentPositioner>
              <ContentContainer>
                {props.children}
              </ContentContainer>
            </QuickActionPageContentPositioner>
          </StyledCol>
        </FillRow>

        <Row>
          <Col xs={12}>
            <Footer color={palette.mildGreenDark} />
          </Col>
        </Row>
      </StyledContainer>
    </QuickActionPageWrapper>
  );
}

/*
 * Export `QuickActionPage`.
 */

export default React.memo(QuickActionPage);
