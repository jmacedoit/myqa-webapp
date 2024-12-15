
/*
 * Module dependencies.
 */

import { Dialog } from '@mui/material';
import { DialogBodyContainer } from '../../layout/dialog-body-container';
import { StandardContentContainer } from 'src/ui/components/layout/standard-content-container';
import { StandardContentTitle } from 'src/ui/components/layout/standard-content-title';
import { selectAuthenticatedUser } from 'src/state/slices/authenticated-user';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppSelector } from 'src/ui/hooks/redux';
import { useTranslation } from 'react-i18next';
import ChangePasswordForm from './change-password-form';
import DisplayField from 'src/ui/components/info/display-field';
import React, { useState } from 'react';
import SimpleButton from 'src/ui/components/buttons/simple-button';
import StandardPage from 'src/ui/components/layout/standard-page';
import Type from 'src/ui/styles/type';
import styled from 'styled-components';

/*
 * Styles.
 */

const Section = styled.div`
  margin-bottom: ${units(4)}px;
`;

/*
 * Export AccountScreen.
 */

function AccountScreen() {
  const { t } = useTranslation();
  const authenticatedUser = useAppSelector(selectAuthenticatedUser);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const handleOpenChangePasswordDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setChangePasswordDialogOpen(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setChangePasswordDialogOpen(false);
  };

  // get user

  return (
    <>
      <StandardPage>
        <div style={{ paddingTop: units(8) }}>
          <StandardContentTitle>
            {t(translationKeys.screens.account.title)}
          </StandardContentTitle>

          <StandardContentContainer>
            <Section>
              <Type.H4>
                {t(translationKeys.screens.account.personalInformationTitle)}
              </Type.H4>

              <DisplayField
                label={'Email'}
                value={authenticatedUser?.email ?? ''}
              />

              <DisplayField
                label={'Display name'}
                value={authenticatedUser?.displayName ?? ''}
              />
            </Section>

            <Section style={{ margin: 0 }}>
              <Type.H4>
                {t(translationKeys.screens.account.securityTitle)}
              </Type.H4>

              <SimpleButton
                filled
                onClick={handleOpenChangePasswordDialog}
              >
                {t(translationKeys.screens.account.changePasswordLabel)}
              </SimpleButton>
            </Section>
          </StandardContentContainer>
        </div>
      </StandardPage>

      <Dialog
        PaperComponent={DialogBodyContainer}
        fullWidth
        maxWidth={'sm'}
        onClose={handleCloseChangePasswordDialog}
        open={changePasswordDialogOpen}
      >
        <ChangePasswordForm onPasswordChanged={handleCloseChangePasswordDialog} />
      </Dialog>
    </>
  );
}

export default React.memo(AccountScreen);
