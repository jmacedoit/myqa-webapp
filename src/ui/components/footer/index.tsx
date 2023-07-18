
/*
 * Module dependencies.
 */

import { palette } from 'src/ui/styles/colors';
import { routes } from 'src/ui/routes';
import { staticUri } from 'src/utils/environment';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Type from 'src/ui/styles/type';
import UnderlinedButton from 'src/ui/components/buttons/underlined-button';
import breakpoints from 'src/ui/styles/breakpoints';
import styled from 'styled-components';

/*
 * Styles.
 */

const Container = styled.div`
  padding: ${units(3)}px ${units(4)}px;
  color: ${palette.neonGreen};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: ${breakpoints.md}px) {
    flex-direction: row;
  }
`;

const Logo = styled.img`
  width: 80px;
  margin: ${units(1)}px ${units(2)}px;
`;

const CopyrightText = styled(Type.Paragraph)`
  margin: ${units(2)}px ${units(2)}px;
  text-align: center;
`;

const LinksContainer = styled.div`
  text-align: center;
`;

const StyledUnderlinedButton = styled(UnderlinedButton)`
  margin: ${units(2)}px ${units(2)}px;
  text-align: center;
`;

/*
 * Footer component.
 */

function Footer(props: { color?: string }) {
  const { t } = useTranslation();
  const finalColor = props.color ?? palette.neonGreen;

  return (
    <Container>
      <Logo src={staticUri(`assets/images/myqa-logo-green.png`)} />

      <CopyrightText style={{ color: finalColor }}>
        {`Myqa © ${new Date().getFullYear()}`}
      </CopyrightText>

      <LinksContainer>
        <StyledUnderlinedButton
          color={finalColor}
          isLink
          key={'termsAndConditions'}
          target={'_blank'}
          to={routes.termsAndConditions}
        >
          {t(translationKeys.footer.termsAndConditionsLink)}
        </StyledUnderlinedButton>

        <StyledUnderlinedButton
          color={finalColor}
          isLink
          key={'privacyPolicy'}
          target={'_blank'}
          to={routes.privacyPolicy}
        >
          {t(translationKeys.footer.privacyPolicyLink)}
        </StyledUnderlinedButton>
      </LinksContainer>
    </Container>
  );
}

/*
 * Export `Footer` component.
 */

export default Footer;
