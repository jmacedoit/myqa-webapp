
/*
 * Module dependencies.
 */

import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React from 'react';
import Type from 'src/ui/styles/type';

/*
 * RecoverPasswordEmailSent component.
 */

function RecoverPasswordEmailSent() {
  const { t } = useTranslation();

  return (
    <QuickActionPage>
      <Type.H3 style={{ marginBottom: `${units(4)}px` }}>
        {t(translationKeys.screens.passwordRecoveryEmailSent.title)}
      </Type.H3>

      <Type.Paragraph style={{ marginBottom: `${units(4)}px` }}>
        {t(translationKeys.screens.passwordRecoveryEmailSent.description)}
      </Type.Paragraph>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(RecoverPasswordEmailSent);

