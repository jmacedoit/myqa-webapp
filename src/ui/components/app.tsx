
/*
 * Module dependencies.
 */

import 'src/ui/i18n';
import { FromSchema } from 'json-schema-to-ts';
import { GlobalStyle } from 'src/ui/styles/global';
import { Helmet } from 'react-helmet';
import { IconButton, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import { JSONSchemaType } from 'ajv';
import { MenuRounded } from '@mui/icons-material';
import { Normalize } from 'styled-normalize';
import { Organization } from 'src/types/organizations';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ScreenClassProvider, setConfiguration } from 'react-grid-system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createDefaultValidator } from 'src/ui/ajv';
import { matchPath } from 'react-router';
import { routes } from 'src/ui/routes';
import { selectActiveOrganizationId, setActiveOrganizationId } from 'src/state/slices/ui';
import { selectAuthenticatedUser } from 'src/state/slices/authenticated-user';
import { selectOrganizations } from 'src/state/slices/data';
import { store } from 'src/state/store';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useTranslation } from 'react-i18next';
import AnswerScreen from './screens/answer';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import KnowledgeBaseScreen from './screens/knowledge-base';
import KnowledgeBasesListingScreen from './screens/knowledge-bases-listing';
import ProtectedRoute from './protected-route';
import React, { useCallback, useState } from 'react';
import SignIn from './screens/sign-in';
import Styleguide from './screens/styleguide';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import breakpoints from 'src/ui/styles/breakpoints';
import colors, { palette } from 'src/ui/styles/colors';
import styled from 'styled-components';
// eslint-disable-next-line sort-imports-es6-autofix/sort-imports-es6
import { AutoField, AutoForm } from 'uniforms-mui';
import EmailVerification from './screens/email-verification';
import SignUp from './screens/sign-up';
import SignUpSuccess from './screens/sign-up-success';
import VerifyEmail from './screens/verify-email';

/*
 * Setup tanstack react query client.
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    },
    mutations: {
      retry: 0
    }
  }
});

/*
 * Set react grid configuration.
 */

setConfiguration({
  breakpoints: [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl, breakpoints.xxl],
  containerWidths: [540, 740, 960, 1312, 1540, 1810],
  gutterWidth: 32
});

/*
 * Set material theme.
 */

const materialTheme = createTheme({
  breakpoints: {
    values: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl
    }
  },
  palette: {
    primary: {
      main: colors.defaultText
    },
    error: {
      main: colors.error
    }
  },
  typography: {
    fontFamily: '"Moderat", sans-serif'
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: palette.extraDarkGreen
          },
          '& input': {
            color: palette.extraDarkGreen
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: palette.darkGreen
            },
            '&:hover fieldset': {
              borderColor: palette.extraDarkGreen
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.extraDarkGreen
            },
            '&.Mui-error fieldset': {
              borderColor: colors.error
            }
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          display: 'none'
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        asterisk: {
          display: 'none'
        }
      }
    }
  }
});

/*
 * Styles.
 */

const Wrapper = styled.div`
  background: ${palette.darkGreen};
  width: 100vw;
  min-height: 100vh;
`;

const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 240px;
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
 * Export AppCore.
 */

export function AppCore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const authenticatedUser = useAppSelector(selectAuthenticatedUser);
  const organizations = useAppSelector(selectOrganizations);
  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const handleOpenMenu = useCallback(() => setMenuOpen(true), []);
  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);
  const dispatch = useAppDispatch();

  const questionSchema = createOrganizationSelectionSchema(t, organizations);
  const schemaValidator = createDefaultValidator(questionSchema as JSONSchemaType<OrganizationSelectionData>);
  const bridge = new JSONSchemaBridge(questionSchema, schemaValidator)

  return (
    <div>
      <Helmet>
        <title>
          {t(translationKeys.title)}
        </title>

        <link
          href='https://fonts.googleapis.com'
          rel='preconnect'
        />

        <link
          crossOrigin=''
          href='https://fonts.gstatic.com'
          rel='preconnect'
        />

        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,800&family=Quicksand:wght@400;600;700&display=swap'
          rel='stylesheet'
        />

        <link
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          rel='stylesheet'
        />

        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'
        />

        <meta
          content='width=device-width,initial-scale=1'
          name='viewport'
        />
      </Helmet>

      <Normalize />

      <GlobalStyle />

      <SwipeableDrawer
        anchor='left'
        onClose={handleCloseMenu}
        onOpen={handleOpenMenu}
        open={menuOpen}
      >
        <MenuContainer>
          {
            authenticatedUser && (
              <div style={{ padding: units(2) }}>
                {t(translationKeys.menu.greetingPrefix)}

                <b>
                  {authenticatedUser?.displayName}
                </b>
              </div>
            )
          }

          <div style={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
            <List>
              <ListItemButton
                key={routes.knowledgeBasesListing}
                onClick={() => navigate(routes.knowledgeBasesListing)}
                selected={!!matchPath(location.pathname, routes.knowledgeBasesListing)}
              >
                <ListItemIcon>
                  <WidgetsRoundedIcon />
                </ListItemIcon>

                <ListItemText primary={t(translationKeys.screens.knowledgeBases.title)} />
              </ListItemButton>
            </List>
          </div>

          <div style={{ padding: units(2) }}>
            <AutoForm
              autosave
              model={{ organization: activeOrganizationId as string }}
              onSubmit={(data: OrganizationSelectionData) => {
                dispatch(setActiveOrganizationId(data.organization));
              }}
              schema={bridge}
            >
              <AutoField
                initialValue={activeOrganizationId}
                name={'organization'}
              />
            </AutoForm>
          </div>
        </MenuContainer>
      </SwipeableDrawer>

      <Wrapper>
        <IconButton
          onClick={handleOpenMenu}
          size='large'
          sx={{ position: 'absolute' }}
        >
          <MenuRounded />
        </IconButton>

        <React.StrictMode>
          <Routes>
            <Route
              element={<Styleguide />}
              key={routes.styleguide}
              path={routes.styleguide}
            />

            <Route
              element={<SignIn />}
              key={routes.signIn}
              path={routes.signIn}
            />

            <Route
              element={<SignUp />}
              key={routes.signUp}
              path={routes.signUp}
            />

            <Route
              element={<SignIn />}
              key={routes.home}
              path={routes.home}
            />

            <Route
              element={<SignUpSuccess />}
              key={routes.signUpSuccess}
              path={routes.signUpSuccess}
            />

            <Route
              element={<VerifyEmail />}
              key={routes.verifyEmail}
              path={routes.verifyEmail}
            />

            <Route
              element={<EmailVerification />}
              key={routes.emailVerification}
              path={routes.emailVerification}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                element={<KnowledgeBaseScreen />}
                key={routes.knowledgeBase}
                path={routes.knowledgeBase}
              />

              <Route
                element={<KnowledgeBasesListingScreen />}
                key={routes.knowledgeBasesListing}
                path={routes.knowledgeBasesListing}
              />

              <Route
                element={<AnswerScreen />}
                key={routes.answer}
                path={routes.answer}
              />
            </Route>
          </Routes>
        </React.StrictMode>
      </Wrapper>
    </div>
  );
}

/*
 * App core wrapper, so that core component can use redux context, etc.
 */

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ScreenClassProvider>
          <ThemeProvider theme={materialTheme}>
            <AppCore />
          </ThemeProvider>
        </ScreenClassProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
