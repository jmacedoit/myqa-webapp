
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import { units } from 'src/ui/styles/dimensions';
import React from 'react';
import styled from 'styled-components';
/*
 * Styles.
 */

export const QuickActionPageWrapper = styled.div`
  background-color: ${palette.extraDarkGreen};
`;

const StyledColumn = styled(Col)`;
  text-align: center;
`;

export const QuickActionPageContentPositioner = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${units(10)}px;
  padding-bottom: ${units(10)}px;
`;

const QuickActionPageContentContainer = styled.div`
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
      <Container>
        <Row>
          <StyledColumn lg={3} />

          <StyledColumn
            lg={6}
            xs={12}
          >
            <QuickActionPageContentPositioner>
              <QuickActionPageContentContainer>
                {props.children}
              </QuickActionPageContentContainer>
            </QuickActionPageContentPositioner>
          </StyledColumn>
        </Row>
      </Container>
    </QuickActionPageWrapper>
  );
}

/*
 * Export `QuickActionPage`.
 */

export default React.memo(QuickActionPage);
