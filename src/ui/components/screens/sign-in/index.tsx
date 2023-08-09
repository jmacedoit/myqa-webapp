
/*
 * Module dependencies.
 */

import { AutoField, AutoForm } from 'uniforms-mui';
import { FieldWrapper, StyledErrorField } from 'src/ui/components/fields/form-misc';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { JSONSchemaType } from 'ajv';
import { addNotification, setActiveOrganizationId } from 'src/state/slices/ui';
import { authenticate, getAuthenticatedUser } from 'src/services/backend/authentication';
import { authenticateUser } from 'src/state/slices/authenticated-user';
import { createDefaultValidator } from 'src/ui/ajv';
import { getOrganizations } from 'src/services/backend/organizations';
import { palette } from 'src/ui/styles/colors';
import { properties } from 'src/utils/types';
import { routes } from 'src/ui/routes';
import { setOrganizationsAction } from 'src/state/slices/data';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useHref } from 'react-router';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainButton from 'src/ui/components/buttons/main-button';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React, { useCallback, useRef } from 'react';
import TextField from 'src/ui/components/fields/text-field';
import Type from 'src/ui/styles/type';
import UnderlinedButton from 'src/ui/components/buttons/underlined-button';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/*
 * Sign in schema.
 */

const creatSignInSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      component: TextField,
      title: t(translationKeys.forms.common.email.label)
    },
    password: {
      type: 'string',
      title: t(translationKeys.forms.common.password.label),
      component: TextField,
      showMaskPasswordControl: true
    }
  },
  additionalProperties: false,
  required: ['email', 'password'],
  errorMessage: {
    required: {
      email: t(translationKeys.forms.common.email.requiredError),
      password: t(translationKeys.forms.common.password.requiredError)
    },
    properties: {
      email: t(translationKeys.forms.common.email.invalidError)
    }
  }
}) as const;

type SignInData = FromSchema<ReturnType<typeof creatSignInSchema>>;

/*
 * SignIn component.
 */

function SignIn() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signUpHref = useHref(routes.signUp);
  const formRef = useRef<any>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleRecaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');

      return;
    }

    const token = await executeRecaptcha('SIGN_IN');

    return token;
  }, [executeRecaptcha]);

  const authentication = useMutation(async (data: SignInData) => {
    try {
      const recaptchaToken = await handleRecaptchaVerify();

      if (!recaptchaToken) {
        console.log('Recaptcha token not available');

        throw new Error('Recaptcha token not available');
      }

      await authenticate(data, recaptchaToken);

      dispatch(addNotification({
        message: t(translationKeys.forms.signIn.signInSuccessMessage),
        type: 'success'
      }));
    } catch (error) {
      console.log(error);

      if (error?.status === 401) {
        dispatch(addNotification({
          message: t(translationKeys.forms.signIn.operationErrors.wrongCredentials),
          type: 'error'
        }));
      } else {
        dispatch(addNotification({
          message: t(translationKeys.forms.common.operationErrors.genericError),
          type: 'error'
        }));
      }

      return;
    }

    const user = await getAuthenticatedUser();
    const organizations = await getOrganizations();

    dispatch(authenticateUser(user));
    dispatch(setOrganizationsAction(organizations));
    dispatch(setActiveOrganizationId(organizations.find(organization => organization.isPersonal)?.id ?? null));

    navigate(routes.knowledgeBasesListing);
  });

  const signInSchema = creatSignInSchema(t);
  const schemaValidator = createDefaultValidator(signInSchema as JSONSchemaType<SignInData>);
  const bridge = new JSONSchemaBridge(signInSchema, schemaValidator);

  return (
    <QuickActionPage>
      <Type.H3>
        {t(translationKeys.screens.signIn.title)}
      </Type.H3>

      <AutoForm
        onSubmit={(model: SignInData) => {
          authentication.mutate(model);
        }}
        ref={formRef}
        schema={bridge}
      >
        <div style={{ marginBottom: units(4), textAlign: 'left' }}>
          <FieldWrapper>
            <AutoField name={properties<SignInData>().email} />

            <StyledErrorField name={properties<SignInData>().email} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField
              name={properties<SignInData>().password}
              type={'password'}
            />

            <StyledErrorField name={properties<SignInData>().password} />
          </FieldWrapper>
        </div>

        <div style={{ marginBottom: units(6) }}>
          <MainButton
            loading={authentication.isLoading}
            onClick={event => {
              event.preventDefault();

              formRef.current?.submit();
            }}
            style={{ marginRight: units(1) }}
          >
            {t(translationKeys.forms.signIn.submitLabel)}
          </MainButton>

          <MainButton
            href={signUpHref}
            outlined
          >
            {t(translationKeys.screens.signIn.signUpButton)}
          </MainButton>
        </div>

        <UnderlinedButton
          color={palette.mildGreenDark}
          display={'block'}
          isLink
          to={routes.recoverPassword}
        >
          <Type.Paragraph style={{ marginBottom: 0 }}>
            {t(translationKeys.screens.signIn.forgotPasswordButton)}
          </Type.Paragraph>
        </UnderlinedButton>

      </AutoForm>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(SignIn);
