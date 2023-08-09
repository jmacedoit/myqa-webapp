
/*
 * Module dependencies.
 */

import 'src/ui/i18n';
import { Alert, Slide, Snackbar } from '@mui/material';
import { GlobalStyle } from 'src/ui/styles/global';
import { Helmet } from 'react-helmet';
import { MenuRounded } from '@mui/icons-material';
import { Normalize } from 'styled-normalize';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ScreenClassProvider, setConfiguration } from 'react-grid-system';
import { ThemeProvider, createTheme, styled as styledMaterial } from '@mui/material/styles';
import { gutterSize, units } from 'src/ui/styles/dimensions';
import { logOutUser, selectAuthenticatedUser } from 'src/state/slices/authenticated-user';
import { removeNotification, selectActiveOrganizationId, selectNotifications, setActiveOrganizationId } from 'src/state/slices/ui';
import { routes } from 'src/ui/routes';
import { selectOrganizations } from 'src/state/slices/data';
import { store } from 'src/state/store';
import { translationKeys } from 'src/translations';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useTranslation } from 'react-i18next';
import AnswerScreen from 'src/ui/components/screens/answers';
import KnowledgeBaseScreen from 'src/ui/components/screens/knowledge-base';
import KnowledgeBasesListingScreen from 'src/ui/components/screens/knowledge-bases-listing';
import ProtectedRoute from 'src/ui/components/protected-route';
import React, { useCallback, useEffect, useState } from 'react';
import SignIn from 'src/ui/components/screens/sign-in';
import Styleguide from 'src/ui/components/screens/styleguide';
import breakpoints from 'src/ui/styles/breakpoints';
import colors, { palette } from 'src/ui/styles/colors';
import styled from 'styled-components';
// eslint-disable-next-line sort-imports-es6-autofix/sort-imports-es6
import { NotificationMessage } from 'src/types/notification';
// eslint-disable-next-line no-duplicate-imports
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { logout } from 'src/services/backend/authentication';
import { staticUri } from 'src/utils/environment';
import { useAuthenticationHandler } from 'src/ui/hooks/authentication';
import Account from 'src/ui/components/screens/account';
import ButtonBase from 'src/ui/components/buttons/button-base';
import EmailVerification from 'src/ui/components/screens/email-verification';
import LandingPage from 'src/ui/components/screens/landing-page';
import Menu from './menu';
import RecoverPassword from 'src/ui/components/screens/recover-password';
import RecoverPasswordEmailSent from 'src/ui/components/screens/recover-password-email-sent';
import ResetPassword from 'src/ui/components/screens/reset-password';
import ResetPasswordSuccess from 'src/ui/components/screens/reset-password-success';
import SignUp from 'src/ui/components/screens/sign-up';
import SignUpSuccess from 'src/ui/components/screens/sign-up-success';
import VerifyEmail from 'src/ui/components/screens/verify-email';
import color from 'color';
import config from 'src/config';

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
  gutterWidth: gutterSize
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
    },
    success: {
      main: colors.success
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
  width: 100%;
  min-height: 100vh;
`;

const MenuButton = styledMaterial(ButtonBase)`
  background-color: ${palette.lightPurple};
  border-radius: 50%;
  box-shadow: 0px 0px 7px -1px #101E1A77;
  color: ${color(palette.lightPurple).darken(0.7).hex()};
  height: ${units(5)}px;
  padding: ${units(1)}px;
  position: fixed;
  width: ${units(5)}px;
  z-index: 1000;
  top: ${units(1)}px;
  left: ${units(1)}px;

  &:hover {
    background-color: ${color(palette.lightPurple).darken(0.05).hex()};
  }
`;

/*
 * Export AppCore.
 */

export function AppCore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const authenticatedUser = useAppSelector(selectAuthenticatedUser);
  const organizations = useAppSelector(selectOrganizations);
  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const notifications = useAppSelector(selectNotifications);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [previousTopNotification, setPreviousTopNotification] = useState<NotificationMessage>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleOpenMenu = useCallback(() => setMenuOpen(true), []);
  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);
  const dispatch = useAppDispatch();
  const { handleAuthenticatedRequest } = useAuthenticationHandler();

  useEffect(() => {
    if (notifications.length > 0) {
      const firstNotificationId = notifications[0]?.id;

      if (firstNotificationId !== previousTopNotification?.id) {
        setTimeout(() => {
          dispatch(removeNotification(firstNotificationId as string));
        }, 3000);
      }

      setSnackbarOpen(true);
      setPreviousTopNotification(notifications[0]);
    } else {
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
  }, [notifications]); // eslint-disable-line react-hooks/exhaustive-deps

  const logoutExecution = useMutation('logout', async () => {
    await handleAuthenticatedRequest(() => logout());

    dispatch(logOutUser());
  });

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

        <link
          href={staticUri('assets/images/favicon/apple-touch-icon.png')}
          rel='apple-touch-icon'
          sizes='180x180'
        />

        <link
          href={staticUri('assets/images/favicon/favicon-32x32.png')}
          rel='icon'
          sizes='32x32'
          type='image/png'
        />

        <link
          href={staticUri('assets/images/favicon/favicon-16x16.png')}
          rel='icon'
          sizes='16x16'
          type='image/png'
        />

        <link
          href={staticUri('assets/images/favicon/site.webmanifest')}
          rel='manifest'
        />

        <meta
          content='width=device-width,initial-scale=1'
          name='viewport'
        />
      </Helmet>

      <Normalize />

      <GlobalStyle />

      <Snackbar
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        key={previousTopNotification?.id}
        message={previousTopNotification?.message}
        open={snackbarOpen}
      >
        <Alert
          severity={previousTopNotification?.type}
          sx={{ color: palette.white }}
          variant={'filled'}
        >
          {previousTopNotification?.message}
        </Alert>
      </Snackbar>

      <Menu
        activeOrganizationId={activeOrganizationId}
        onChangeOrganization={organizationId => {
          dispatch(setActiveOrganizationId(organizationId));

          navigate(routes.knowledgeBasesListing);
        }}
        onClose={handleCloseMenu}
        onLogout={async () => { await logoutExecution.mutateAsync(); }}
        onOpen={handleOpenMenu}
        open={menuOpen}
        organizations={organizations}
        user={authenticatedUser}
      />

      <Wrapper>
        {authenticatedUser && (
          <MenuButton onClick={handleOpenMenu}>
            <MenuRounded sx={{ fontSize: '1.4rem' }} />
          </MenuButton>
        )}

        <React.StrictMode>
          <Routes>
            <Route
              element={<Styleguide />}
              key={routes.styleguide}
              path={routes.styleguide}
            />

            <Route
              element={(
                <GoogleReCaptchaProvider
                  reCaptchaKey={config.recaptcha.key}
                  useEnterprise
                >
                  <SignIn />
                </GoogleReCaptchaProvider>
              )}
              key={routes.signIn}
              path={routes.signIn}
            />

            <Route
              element={(
                <GoogleReCaptchaProvider
                  reCaptchaKey={config.recaptcha.key}
                  useEnterprise
                >
                  <SignUp />
                </GoogleReCaptchaProvider>
              )}
              key={routes.signUp}
              path={routes.signUp}
            />

            <Route
              element={(
                <LandingPage />
              )}
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

            <Route
              element={<RecoverPassword />}
              key={routes.recoverPassword}
              path={routes.recoverPassword}
            />

            <Route
              element={<RecoverPasswordEmailSent />}
              key={routes.recoverPasswordEmailSent}
              path={routes.recoverPasswordEmailSent}
            />

            <Route
              element={<ResetPassword />}
              key={routes.resetPassword}
              path={routes.resetPassword}
            />

            <Route
              element={<ResetPasswordSuccess />}
              key={routes.resetPasswordSuccess}
              path={routes.resetPasswordSuccess}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                element={<Account />}
                key={routes.account}
                path={routes.account}
              />

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
                key={routes.answers}
                path={routes.answers}
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

