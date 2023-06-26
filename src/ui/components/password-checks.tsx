
/*
 * Module dependencies.
 */

import { Check, Close } from '@mui/icons-material';
import { palette } from 'src/ui/styles/colors';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Type from 'src/ui/styles/type';

/*
 * PasswordChecks component.
 */

function PasswordChecks(props: { password: string }) {
  const { t } = useTranslation();
  const password = props.password || '';
  const passwordChecks = [
    {
      label: t(translationKeys.forms.signUp.passwordChecks.length.label),
      isValid: password.length >= 8 && password.length <= 24
    },
    {
      label: t(translationKeys.forms.signUp.passwordChecks.lowercase.label),
      isValid: /[a-z]/.test(password)
    },
    {
      label: t(translationKeys.forms.signUp.passwordChecks.uppercase.label),
      isValid: /[A-Z]/.test(password)
    },
    {
      label: t(translationKeys.forms.signUp.passwordChecks.number.label),
      isValid: /[0-9]/.test(password)
    },
    {
      label: t(translationKeys.forms.signUp.passwordChecks.specialCharacter.label),
      isValid: /[^a-zA-Z0-9]/.test(password)
    }
  ];

  const checks = passwordChecks.map((passwordCheck, index) => {
    return (
      <div
        key={index}
        style={{
          color: palette.extraDarkGreen,
          display: 'flex',
          alignItems: 'center',
          marginBottom: `${units(1)}px`
        }}
      >
        {
          passwordCheck.isValid ?
            <Check sx={{ color: 'inherit', fontSize: '1.1rem' }} /> :
            <Close sx={{ color: 'inherit', fontSize: '1.1rem' }} />
        }

        <Type.XSmall style={{ marginLeft: `${units(0.5)}px`, marginBottom: 0 }}>
          {passwordCheck.label}
        </Type.XSmall>
      </div>
    );
  });

  return (
    <div>
      <Type.Small style={{ display: 'block', marginBottom: `${units(1)}px` }}>
        {t(translationKeys.forms.signUp.passwordChecks.title)}
      </Type.Small>

      {checks}
    </div>
  );
}

/*
 * Export the component.
 */

export default React.memo(PasswordChecks);
