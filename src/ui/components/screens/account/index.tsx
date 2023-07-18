
/*
 * Module dependencies.
 */

import { StandardContentContainer } from 'src/ui/components/layout/standard-content-container';
import { StandardContentTitle } from 'src/ui/components/layout/standard-content-title';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useTranslation } from 'react-i18next';
import React from 'react';
import StandardPage from 'src/ui/components/layout/standard-page';
import Type from 'src/ui/styles/type';

/*
 * Styles.
 */

/*
 * Export AccountScreen.
 */

function AccountScreen() {
  const { t } = useTranslation();

  return (
    <>
      <StandardPage>
        <div style={{ paddingTop: units(8) }}>
          <StandardContentTitle>
            {t(translationKeys.screens.account.title)}
          </StandardContentTitle>

          <StandardContentContainer>
            <Type.Paragraph>
              {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec ali'}
            </Type.Paragraph>
          </StandardContentContainer>
        </div>
      </StandardPage>
    </>
  );
}

export default React.memo(AccountScreen);
