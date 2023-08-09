
/*
 * Module dependencies.
 */

import { Col, Container, Row, useScreenClass } from 'react-grid-system';
import { palette } from 'src/ui/styles/colors';
import { routes } from 'src/ui/routes';
import { screenClassAtLeast, screenClassAtMost } from 'src/ui/utils';
import { staticUri } from 'src/utils/environment';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ButtonBase from 'src/ui/components/buttons/button-base';
import LandingType from 'src/ui/components/screens/landing-page/type';
import React from 'react';
import breakpoints, { breakpointKeys } from 'src/ui/styles/breakpoints';
import color from 'color';
import styled from 'styled-components';

/*
 * Styles.
 */

const HeroWrapper = styled.div`
  overflow: hidden;
  position: relative;
  background-color: ${palette.extraDarkGreen};
  min-height: 100vh;
  padding: ${units(6)}px 0 ${units(20)}px 0;

  @media (max-width: ${breakpoints.md - 1}px) {
    padding: ${units(4)}px 0 ${units(5)}px 0;
  }
`;

const BlurredTree = styled.img`
  transform: translateY(-66%) translateX(54%) rotate(-90deg);
  filter: blur(25px);
  width: 120vw;
  max-width: 1700px;
  min-width: 600px;
`;

const Logo = styled.img`
  width: 182px;

  @media (max-width: ${breakpoints.md - 1}px) {
    width: 106px;
  }
`;

const NavButton = styledMaterial(ButtonBase)`
  display: flex;
  align-items: center;
  color: ${palette.white};
  padding: ${units(0.5)}px ${units(7.5)}px;
  border: 2px solid ${palette.white};
  border-radius: ${units(4)}px;
  text-align: center;

  svg {
    transition: all 0.2s ease;
  }

  &:hover {
    svg {
      transform: translateX(5px);
    }
  }

  @media (max-width: ${breakpoints.md - 1}px) {
    border: none;
    padding: ${units(1)}px ${units(2)}px;
  }
`;

const SignUpButton = styledMaterial(ButtonBase)`
  color: ${palette.white};
  padding: ${units(2)}px ${units(10)}px;
  background-color: ${palette.orange};
  border-radius: ${units(4)}px;
  text-align: center;

  &:hover {
    background-color: ${color(palette.orange).darken(0.1).hex()};
  }

  @media (max-width: ${breakpoints.md - 1}px) {
    padding: ${units(1)}px ${units(4)}px;
  }

  p {
    transform: translateY(-2px);
  }
`;

const ColInnerWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 450px);
  height: 100%;

  @media (max-width: ${breakpoints.md - 1}px) {
    min-height: initial;
  }
`;

const HeroImageContainer = styled.div`
  @media (max-width: ${breakpoints.md - 1}px) {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: 'center
  }
`;

const myUseScreenClass = useScreenClass ?? (() => breakpointKeys.lg);

/*
 * Hero component.
 */

function Hero() {
  const signInHref = useHref(routes.signIn);
  const signUpHref = useHref(routes.signUp);
  const screenClass = myUseScreenClass();
  const { t } = useTranslation();

  return (
    <HeroWrapper>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0
        }}
      >
        <BlurredTree src={staticUri(`assets/images/tree1.png`)} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: 0
        }}
      >
        <img
          src={staticUri(`assets/vectors/landing-page/background-curves.svg`)}
          style={{
            width: '100vw',
            maxHeight: '400px'
          }}
        />
      </div>

      <Container>
        <Row>
          <Col xs={12}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Logo src={staticUri(`assets/images/myqa-logo.png`)} />

              <div style={{ flex: 1 }} />

              <NavButton href={signInHref}>
                <LandingType.ParagraphLarge style={{ fontWeight: 500, margin: `0 ${units(1)}px 0 0` }}>
                  {t(translationKeys.screens.landingPage.hero.signInButton)}
                </LandingType.ParagraphLarge>

                <ArrowForwardIcon sx={{ marginBottom: '-4px' }} />
              </NavButton>
            </div>
          </Col>
        </Row>

        <Row style={{ paddingTop: `${units(8)}px` }}>
          <Col
            md={6}
            xs={12}
          >
            <ColInnerWrapper>
              <div style={{ marginBottom: `${units(5)}px` }}>
                <LandingType.H1Strong style={{ color: `${palette.lightGreen}`, margin: 0, display: 'inline' }}>
                  {t(translationKeys.screens.landingPage.hero.titleHighlight)}
                </LandingType.H1Strong>

                <LandingType.H1 style={{ color: `${palette.lightGreen}`, margin: 0, display: 'inline' }}>
                  {t(translationKeys.screens.landingPage.hero.titleRest)}
                </LandingType.H1>
              </div>

              <LandingType.H4 style={{ color: `${palette.neonGreen}`, display: 'inline-block', marginBottom: `${units(4)}px` }}>
                <span style={{ fontWeight: 300 }}>
                  {`AI + ${t(translationKeys.screens.landingPage.hero.yourDataEquationElement)} =`}
                </span>

                {' '}

                <div style={{ display: 'inline-block', position: 'relative' }}>
                  {'myqa'}

                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', lineHeight: 0 }}>
                    <img
                      src={staticUri(`assets/vectors/landing-page/curvy-underline.svg`)}
                      width={'100%'}
                    />
                  </div>
                </div>
              </LandingType.H4>

              {screenClassAtMost(screenClass, breakpointKeys.sm) && (
                <img
                  src={staticUri(`assets/vectors/landing-page/hero.svg`)}
                  style={{ marginBottom: `${units(4)}px` }}
                  width={'100%'}
                />
              )}

              <LandingType.ParagraphLarge
                style={{
                  color: `${palette.white}`,
                  fontWeight: 200,
                  marginBottom: `${units(6)}px`,
                  whiteSpace: 'pre-line'
                }}
              >
                {t(translationKeys.screens.landingPage.hero.elevatorPitch)}
              </LandingType.ParagraphLarge>

              <SignUpButton
                fullWidth={screenClassAtMost(screenClass, breakpointKeys.sm)}
                href={signUpHref}
              >
                <LandingType.ParagraphLarge style={{ fontWeight: 500, margin: 0 }}>
                  {t(translationKeys.screens.landingPage.hero.callToAction)}
                </LandingType.ParagraphLarge>
              </SignUpButton>
            </ColInnerWrapper>
          </Col>

          {screenClassAtLeast(screenClass, breakpointKeys.md) && (
            <Col
              md={6}
              style={{ position: 'relative' }}
              xs={12}
            >
              <ColInnerWrapper>
                <HeroImageContainer>
                  <img
                    src={staticUri(`assets/vectors/landing-page/hero.svg`)}
                    width={'100%'}
                  />
                </HeroImageContainer>
              </ColInnerWrapper>
            </Col>
          )}
        </Row>
      </Container>
    </HeroWrapper>
  );
}

/*
 * Export the component.
 */

export default React.memo(Hero);
