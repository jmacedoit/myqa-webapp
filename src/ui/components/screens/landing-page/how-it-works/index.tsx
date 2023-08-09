
/*
 * Module dependencies.
 */

import { Col, Container, Row } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import { staticUri } from 'src/utils/environment';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import LandingType from 'src/ui/components/screens/landing-page/type';
import React from 'react';
import breakpoints from 'src/ui/styles/breakpoints';
import color from 'color';
import styled from 'styled-components';

/*
 * Styles.
 */

const Wrapper = styled.div`
  background-color: ${palette.extraExtraDarkGreen};
  padding: ${units(4)}px 0 ${units(20)}px 0;

  @media (max-width: ${breakpoints.md - 1}px) {
    padding: ${units(8)}px 0 ${units(10)}px 0;
  }
`;

const HowItWorksTitle = styled(LandingType.H2)`
  color: ${palette.neonGreen};
  text-align: center;
  margin-bottom: ${units(12)}px;

  @media (max-width: ${breakpoints.md - 1}px) {
    text-align: left;
    margin-bottom: ${units(8)}px;
  }
`;

const StepContainer = styled.div`
  text-align: center;

  @media (max-width: ${breakpoints.md - 1}px) {
    text-align: left;
    margin-bottom: ${units(8)}px;
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: ${breakpoints.md - 1}px) {
    flex-direction: row;
  }
`;

const StepNumber = styled(LandingType.H4)`
  width: ${units(3.5)}px;
  height: ${units(3.5)}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${palette.neonGreen};
  box-shadow: 0px 4px 15px ${color(palette.neonGreen).fade(0.4).hex()}, 0px 0px 2px ${palette.neonGreen};
  margin-right: ${units(2)}px;
`;

const StepNumberText = styled(LandingType.Paragraph)`
  margin: 0;
  font-weight: 600;
  margin-top: -1px;
  margin-left: -2px;
`;

const StepTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  margin-bottom: ${units(5)}px;

  @media (max-width: ${breakpoints.md - 1}px) {
    justify-content: flex-start;
    margin-bottom: ${units(2)}px;
  }
`;

const StepTitle = styled(LandingType.H6)`
  color: ${palette.lightGreen};
  display: inline;
`;

const StepDescription = styled(LandingType.Paragraph)`
  margin: 0;
  color: ${palette.lightGreen};
  font-weight: 200;
  margin-top: ${units(4)}px;
`;

const StepImage = styled.img`
  width: 95%;

  @media (max-width: ${breakpoints.md - 1}px) {
    width: 100%;
  }
`;

const StepImageContainer = styled.div`
  flex: 1;
`;

const StepDescriptionContainer = styled.div`
  flex: 1;

  @media (max-width: ${breakpoints.md - 1}px) {
    padding-left: ${units(2)}px;
  }
`;

/*
 * HowItWorks component.
 */

function HowItWorks() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Container>
        <Row>
          <Col xs={12}>
            <HowItWorksTitle>
              {t(translationKeys.screens.landingPage.howItWorks.title)}
            </HowItWorksTitle>
          </Col>
        </Row>

        <Row>
          <Col
            md={4}
            xs={12}
          >
            <StepContainer>
              <StepTitleContainer>
                <StepNumber>
                  <StepNumberText>
                    {'1'}
                  </StepNumberText>
                </StepNumber>

                <StepTitle style={{ display: 'inline' }}>
                  {t(translationKeys.screens.landingPage.howItWorks.step1.title)}
                </StepTitle>
              </StepTitleContainer>

              <StepContent>
                <StepImageContainer>
                  <StepImage src={staticUri(`assets/images/landing-page/how-it-works-step-1.png`)} />
                </StepImageContainer>

                <StepDescriptionContainer>
                  <StepDescription>
                    {t(translationKeys.screens.landingPage.howItWorks.step1.description)}
                  </StepDescription>
                </StepDescriptionContainer>
              </StepContent>
            </StepContainer>
          </Col>

          <Col
            md={4}
            xs={12}
          >
            <StepContainer>
              <StepTitleContainer>
                <StepNumber>
                  <StepNumberText>
                    {'2'}
                  </StepNumberText>
                </StepNumber>

                <StepTitle style={{ display: 'inline' }}>
                  {t(translationKeys.screens.landingPage.howItWorks.step2.title)}
                </StepTitle>
              </StepTitleContainer>

              <StepContent>
                <StepImageContainer>
                  <StepImage src={staticUri(`assets/images/landing-page/how-it-works-step-2.png`)} />
                </StepImageContainer>

                <StepDescriptionContainer>
                  <StepDescription>
                    {t(translationKeys.screens.landingPage.howItWorks.step2.description)}
                  </StepDescription>
                </StepDescriptionContainer>
              </StepContent>
            </StepContainer>
          </Col>

          <Col
            md={4}
            xs={12}
          >
            <StepContainer>
              <StepTitleContainer>
                <StepNumber>
                  <StepNumberText>
                    {'3'}
                  </StepNumberText>
                </StepNumber>

                <StepTitle style={{ display: 'inline' }}>
                  {t(translationKeys.screens.landingPage.howItWorks.step3.title)}
                </StepTitle>
              </StepTitleContainer>

              <StepContent>
                <StepImageContainer>
                  <StepImage src={staticUri(`assets/images/landing-page/how-it-works-step-3.png`)} />
                </StepImageContainer>

                <StepDescriptionContainer>
                  <StepDescription>
                    {t(translationKeys.screens.landingPage.howItWorks.step3.description)}
                  </StepDescription>
                </StepDescriptionContainer>
              </StepContent>
            </StepContainer>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

/*
 * Export the component.
 */

export default React.memo(HowItWorks);
