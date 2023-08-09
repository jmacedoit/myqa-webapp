
/*
 * Module dependencies.
 */

import { AuthenticatedUser } from 'src/types/users';
import { AutoField, AutoForm } from 'uniforms-mui';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaType } from 'ajv';
import { Organization } from 'src/types/organizations';
import { SwipeableDrawer } from '@mui/material';
import { addNotification } from 'src/state/slices/ui';
import { createDefaultValidator } from 'src/ui/ajv';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { palette } from 'src/ui/styles/colors';
import { routes } from 'src/ui/routes';
import { styled as styledMaterial } from '@mui/material/styles';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useTranslation } from 'react-i18next';
import ButtonBase from 'src/ui/components/buttons/button-base';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import React from 'react';
import Type from 'src/ui/styles/type';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import color from 'color';
import styled from 'styled-components';

/*
 * Styles.
 */

const MenuContainer = styled.div`
  color: ${color(palette.purple).darken(0.7).hex()};
  padding: ${units(2)}px;
  background: ${palette.lightPurple};
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 280px;
`;

const MenuButton = styledMaterial(ButtonBase)<{ selected: boolean }>`
  color: ${color(palette.purple).darken(0.8).hex()};
  background-color: ${props => props.selected ? color(palette.lightPurple).darken(0.05).hex() : 'transparent'};
  border-radius: ${units(2)}px;
  margin-bottom: ${units(1)}px;
  padding: ${units(2)}px;

  &:hover {
    background-color: ${props => props.selected ? color(palette.lightPurple).darken(0.1).hex() : color(palette.lightPurple).darken(0.05).hex()};
  }
`;

const ButtonsContainer = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`;

const BottomControlsContainer = styled(ButtonsContainer.withComponent('div'))`
  flex: initial;
`;

/*
 * Organization selection schema.
 */

function createOrganizationSelectionSchema(t: (key: string) => string, organizations: Organization[]) {
  return {
    type: 'object',
    properties: {
      organization: {
        type: 'string',
        options: [
          ...organizations.map(organization => ({
            label: organization.name,
            value: organization.id
          }))
        ]
      }
    },
    required: ['organization'],
    additionalProperties: false
  } as const;
}

type OrganizationSelectionData = FromSchema<ReturnType<typeof createOrganizationSelectionSchema>>;

/*
 * Menu routes.
 */

const menuRoutes = [{
  path: routes.account,
  icon: <ContactPageIcon />,
  label: translationKeys.screens.menu.navigation.account
}, {
  path: routes.knowledgeBasesListing,
  icon: <WidgetsRoundedIcon />,
  label: translationKeys.screens.menu.navigation.knowledgeBases
}, {
  path: routes.answers,
  icon: <LiveHelpIcon />,
  label: translationKeys.screens.menu.navigation.qaChats
}];

/*
 * Menu component.
 */

function Menu(props: {
  onClose: () => void,
  onOpen: () => void,
  onLogout: () => Promise<void>,
  open: boolean,
  user: AuthenticatedUser | null,
  organizations: Organization[],
  activeOrganizationId: string | null,
  onChangeOrganization: (organizationId: string) => void
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const questionSchema = createOrganizationSelectionSchema(t, props.organizations);
  const schemaValidator = createDefaultValidator(questionSchema as JSONSchemaType<OrganizationSelectionData>);
  const bridge = new JSONSchemaBridge(questionSchema, schemaValidator);

  return (
    <SwipeableDrawer
      anchor='left'
      onClose={props.onClose}
      onOpen={props.onOpen}
      open={props.open}
    >
      <MenuContainer>
        {
          props.user && (
            <Type.Paragraph style={{ margin: 0 }}>
              {t(translationKeys.menu.greetingPrefix)}

              <strong>
                {props.user?.displayName}
              </strong>
            </Type.Paragraph>
          )
        }

        <ButtonsContainer>
          {
            menuRoutes.map(menuRoute => (
              <MenuButton
                key={menuRoute.path}
                onClick={() => {
                  props.onClose();

                  navigate(menuRoute.path);
                }}
                selected={!!matchPath(location.pathname, menuRoute.path)}
              >
                {menuRoute.icon}

                <Type.ParagraphSmall style={{ fontWeight: matchPath(location.pathname, menuRoute.path) ? 600 : 400, flex: 1, margin: `0 0 0 ${units(2)}px` }}>
                  {t(menuRoute.label)}
                </Type.ParagraphSmall>
              </MenuButton>
            ))
          }
        </ButtonsContainer>

        <BottomControlsContainer>
          <MenuButton
            onClick={async () => {
              await props.onLogout();

              props.onClose();

              navigate(routes.signIn);

              dispatch(addNotification({
                message: t(translationKeys.screens.menu.logoutSuccessMessage),
                type: 'success'
              }));
            }}
            selected={false}
          >
            {<PowerOffIcon />}

            <Type.ParagraphSmall style={{ fontWeight: 400, flex: 1, margin: `0 0 0 ${units(2)}px` }}>
              {t(translationKeys.screens.menu.navigation.logout)}
            </Type.ParagraphSmall>
          </MenuButton>

          <div style={{ display: 'none' }}>
            <AutoForm
              autosave
              model={{ organization: props.activeOrganizationId as string }}
              onSubmit={(data: OrganizationSelectionData) => {
                props.onChangeOrganization(data.organization);
              }}
              schema={bridge}
            >
              <AutoField
                initialValue={props.activeOrganizationId}
                name={'organization'}
              />
            </AutoForm>
          </div>
        </BottomControlsContainer>
      </MenuContainer>
    </SwipeableDrawer>
  );
}

/*
 * Export `Menu` component.
 */

export default Menu;
