
/*
 * Module dependencies.
 */

import { CircularProgress } from '@mui/material';
import { routes } from 'src/ui/routes';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useHref } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { verifyUserEmail } from 'src/services/backend/email-verification';
import MainButton from 'src/ui/components/buttons/main-button';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React from 'react';
import Type from 'src/ui/styles/type';

/*
 * EmailVerification component.
 */

function EmailVerification() {
  const { t } = useTranslation();
  const signInHref = useHref(routes.signIn);
  const verification = useMutation(async (token: string) => {
    await verifyUserEmail(token);
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  React.useEffect(() => {
    if (token) {
      verification.mutate(token);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const content = (
    <>
      {verification.isError || verification.isSuccess ? (
        <Type.Paragraph style={{ marginBottom: `${units(4)}px` }}>
          {verification.isSuccess && t(translationKeys.screens.emailVerfication.success)}
          {verification.isError && t(translationKeys.screens.emailVerfication.error)}
        </Type.Paragraph>
      ) : null}
      <MainButton href={signInHref}>
        {t(translationKeys.screens.emailVerfication.signInLabel)}
      </MainButton>
    </>
  );

  return (
    <QuickActionPage>
      <Type.H3 style={{ marginBottom: `${units(4)}px` }}>
        {t(translationKeys.screens.emailVerfication.title)}
      </Type.H3>

      {verification ? (
        <Type.Paragraph style={{ marginBottom: `${units(4)}px`, textAlign: 'center' }}>
          <CircularProgress />
        </Type.Paragraph>
      ) : content}

    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(EmailVerification);
