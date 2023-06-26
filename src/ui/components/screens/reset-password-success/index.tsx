
/*
 * Module dependencies.
 */

import { routes } from 'src/ui/routes';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useHref } from 'react-router';
import { useTranslation } from 'react-i18next';
import MainButton from 'src/ui/components/buttons/main-button';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React from 'react';
import Type from 'src/ui/styles/type';

/*
 * ResetPasswordSuccess component.
 */

function ResetPasswordSuccess() {
  const { t } = useTranslation();
  const signInHref = useHref(routes.signIn);

  return (
    <QuickActionPage>
      <Type.H3 style={{ marginBottom: `${units(4)}px` }}>
        {t(translationKeys.screens.resetPasswordSuccess.title)}
      </Type.H3>

      <Type.Paragraph style={{ marginBottom: `${units(4)}px` }}>
        {t(translationKeys.screens.resetPasswordSuccess.description)}
      </Type.Paragraph>

      <MainButton href={signInHref}>
        {t(translationKeys.screens.resetPasswordSuccess.signInLabel)}
      </MainButton>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(ResetPasswordSuccess);

