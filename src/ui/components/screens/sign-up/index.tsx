
/*
 * Module dependencies.
 */

import { AutoField, AutoForm } from 'uniforms-mui';
import { ErrorObject, JSONSchemaType } from 'ajv';
import { FieldWrapper, StyledErrorField } from 'src/ui/components/fields/form-misc';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { Trans, useTranslation } from 'react-i18next';
import { addNotification } from 'src/state/slices/ui';
import { createDefaultValidator } from 'src/ui/ajv';
import { palette } from 'src/ui/styles/colors';
import { properties } from 'src/utils/types';
import { registerUser } from 'src/services/backend/users';
import { routes } from 'src/ui/routes';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import MainButton from 'src/ui/components/buttons/main-button';
import PasswordChecks from 'src/ui/components/password-checks';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React, { useRef, useState } from 'react';
import TextField from 'src/ui/components/fields/text-field';
import Type from 'src/ui/styles/type';
import UnderlinedButton from 'src/ui/components/buttons/underlined-button';

/*
 * Sign up schema.
 */

const creatSignUpSchema = (t: (key: string) => string, termsAndConditionsLabel: React.ReactNode) => ({
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
      pattern: '^(?!^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*|.{24,})$).*$',
      showMaskPasswordControl: true
    },
    passwordRepetition: {
      equalToAnother: {
        field: 'password'
      },
      type: 'string',
      title: t(translationKeys.forms.common.passwordRepetition.label),
      component: TextField,
      showMaskPasswordControl: true
    },
    termsAndConditions: {
      type: 'boolean',
      title: t(translationKeys.forms.common.termsAndConditions.label),
      label: termsAndConditionsLabel,
      const: true
    }
  },
  additionalProperties: false,
  required: ['email', 'password', 'passwordRepetition', 'termsAndConditions'],
  errorMessage: {
    required: {
      email: t(translationKeys.forms.common.email.requiredError),
      password: t(translationKeys.forms.common.password.requiredError),
      passwordRepetition: t(translationKeys.forms.common.passwordRepetition.requiredError),
      termsAndConditions: t(translationKeys.forms.common.termsAndConditions.requiredError)
    },
    properties: {
      email: t(translationKeys.forms.common.email.invalidError),
      passwordRepetition: t(translationKeys.forms.common.passwordRepetition.nonMatchingError)
    }
  }
}) as const;

type SignUpData = FromSchema<ReturnType<typeof creatSignUpSchema>>;

/*
 * SignUp component.
 */

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const userRegistration = useMutation(async (data: SignUpData) => {
    try {
      await registerUser(data);

      navigate(routes.signUpSuccess);
    } catch (error) {
      if (error?.status === 409) {
        dispatch(addNotification({
          message: t(translationKeys.forms.signUp.operationErrors.emailAlreadyRegisteredError),
          type: 'error'
        }));
      } else {
        dispatch(addNotification({
          message: t(translationKeys.forms.signUp.operationErrors.genericError),
          type: 'error'
        }));
      }
    }
  });

  const termsAndConditionsLabel = (
    <span>
      <Type.Paragraph style={{ marginBottom: 0 }}>
        <Trans
          components={[
            (
              <UnderlinedButton
                color={palette.mildGreen}
                isLink
                key={'termsAndConditions'}
                target={'_blank'}
                to={routes.termsAndConditions}
              >
                {t('termsAndConditionsLink')}
              </UnderlinedButton>
            ),
            (
              <UnderlinedButton
                color={palette.mildGreen}
                isLink
                key={'privacyPolicy'}
                target={'_blank'}
                to={routes.privacyPolicy}
              >
                {t('privacyPolicyLink')}
              </UnderlinedButton>
            )
          ]}
          i18nKey={translationKeys.forms.common.termsAndConditions.label}
        />
      </Type.Paragraph>
    </span>
  );

  const signUpSchema = creatSignUpSchema(t, termsAndConditionsLabel);
  const schemaValidator = createDefaultValidator(signUpSchema as JSONSchemaType<SignUpData>, (error: ErrorObject) => {
    if (error?.instancePath === '/password' && error?.keyword === 'pattern') {
      return {
        ...error,
        message: t(translationKeys.forms.common.password.patternError)
      };
    }

    if (error?.instancePath === '/termsAndConditions' && error?.keyword === 'const') {
      return {
        ...error,
        message: t(translationKeys.forms.common.termsAndConditions.requiredError)
      };
    }

    return error;
  });

  const bridge = new JSONSchemaBridge(signUpSchema, schemaValidator);

  return (
    <QuickActionPage>
      <Type.H3>
        {t(translationKeys.screens.signUp.title)}
      </Type.H3>

      <AutoForm
        onChangeModel={(model: SignUpData) => {
          setPassword(model.password);
        }}
        onSubmit={(model: SignUpData) => {
          userRegistration.mutate(model);
        }}
        ref={formRef}
        schema={bridge}
      >
        <div style={{ marginBottom: units(4), textAlign: 'left' }}>
          <FieldWrapper>
            <AutoField name={properties<SignUpData>().email} />

            <StyledErrorField name={properties<SignUpData>().email} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField
              name={properties<SignUpData>().password}
              type={'password'}
            />

            <StyledErrorField name={properties<SignUpData>().password} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField name={properties<SignUpData>().passwordRepetition} />

            <StyledErrorField name={properties<SignUpData>().passwordRepetition} />
          </FieldWrapper>

          <div style={{ marginBottom: units(2), marginTop: units(3) }}>
            <PasswordChecks password={password} />
          </div>

          <FieldWrapper>
            <AutoField name={properties<SignUpData>().termsAndConditions} />

            <StyledErrorField name={properties<SignUpData>().termsAndConditions} />
          </FieldWrapper>
        </div>

        <MainButton
          loading={userRegistration.isLoading}
          onClick={event => {
            event.preventDefault();

            formRef.current?.submit();
          }}
          style={{ marginRight: units(1) }}
        >
          {t(translationKeys.forms.signUp.submitLabel)}
        </MainButton>
      </AutoForm>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(SignUp);
