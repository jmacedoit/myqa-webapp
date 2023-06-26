
/*
 * Module dependencies.
 */

import { AutoField, AutoForm } from 'uniforms-mui';
import { FieldWrapper, StyledErrorField } from 'src/ui/components/fields/form-misc';
import { FromSchema } from 'json-schema-to-ts';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { JSONSchemaType } from 'ajv';
import { addNotification } from 'src/state/slices/ui';
import { createDefaultValidator } from 'src/ui/ajv';
import { properties } from 'src/utils/types';
import { resetPassword } from 'src/services/backend/access-recovery';
import { routes } from 'src/ui/routes';
import { translationKeys as translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import MainButton from 'src/ui/components/buttons/main-button';
import PasswordChecks from 'src/ui/components/password-checks';
import QuickActionPage from 'src/ui/components/layout/quick-action-page';
import React, { useRef, useState } from 'react';
import TextField from 'src/ui/components/fields/text-field';
import Type from 'src/ui/styles/type';

/*
 * Reset password schema.
 */

const createResetPasswordSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: t(translationKeys.forms.common.password.label),
      component: TextField,
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
    }
  },
  additionalProperties: false,
  required: ['password', 'passwordRepetition'],
  errorMessage: {
    required: {
      password: t(translationKeys.forms.common.password.requiredError),
      passwordRepetition: t(translationKeys.forms.common.passwordRepetition.requiredError)
    },
    properties: {
      email: t(translationKeys.forms.common.email.invalidError),
      passwordRepetition: t(translationKeys.forms.common.passwordRepetition.nonMatchingError)
    }
  }
}) as const;

type ResetPasswordData = FromSchema<ReturnType<typeof createResetPasswordSchema>>;

/*
 * ResetPassword component.
 */

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formRef = useRef<any>(null);
  const [password, setPassword] = useState('');
  const passwordRedefinition = useMutation(async (data: ResetPasswordData & { token: string | null }) => {
    try {
      if (!data.token) {
        throw new Error();
      }

      await resetPassword(data.token, data.password);
    } catch (error) {
      dispatch(addNotification({
        message: t(translationKeys.forms.common.operationErrors.genericError),
        type: 'error'
      }));

      return;
    }

    navigate(routes.resetPasswordSuccess);
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const resetPasswordSchema = createResetPasswordSchema(t);
  const schemaValidator = createDefaultValidator(resetPasswordSchema as JSONSchemaType<ResetPasswordData>);
  const bridge = new JSONSchemaBridge(resetPasswordSchema, schemaValidator);

  return (
    <QuickActionPage>
      <Type.H3>
        {t(translationKeys.screens.resetPassword.title)}
      </Type.H3>

      <AutoForm
        onChangeModel={(model: ResetPasswordData) => {
          setPassword(model.password);
        }}
        onSubmit={(model: ResetPasswordData) => {
          passwordRedefinition.mutate({ ...model, token });
        }}
        ref={formRef}
        schema={bridge}
      >
        <div style={{ marginBottom: units(4), textAlign: 'left' }}>
          <FieldWrapper>
            <AutoField
              name={properties<ResetPasswordData>().password}
              type={'password'}
            />

            <StyledErrorField name={properties<ResetPasswordData>().password} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField name={properties<ResetPasswordData>().passwordRepetition} />

            <StyledErrorField name={properties<ResetPasswordData>().passwordRepetition} />
          </FieldWrapper>

          <div style={{ marginBottom: units(2), marginTop: units(3) }}>
            <PasswordChecks password={password} />
          </div>
        </div>

        <MainButton
          loading={passwordRedefinition.isLoading}
          onClick={event => {
            event.preventDefault();

            formRef.current?.submit();
          }}
        >
          {t(translationKeys.forms.resetPassword.submitLabel)}
        </MainButton>
      </AutoForm>
    </QuickActionPage>
  );
}

/*
 * Export the component.
 */

export default React.memo(ResetPassword);
