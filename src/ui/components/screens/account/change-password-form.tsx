
/*
 * Module dependencies.
 */

import { AutoField, AutoForm } from 'uniforms-mui';
import { DialogActions } from '@mui/material';
import { ErrorObject, JSONSchemaType } from 'ajv';
import { FieldWrapper, StyledErrorField } from 'src/ui/components/fields/form-misc';
import { FromSchema } from 'json-schema-to-ts';
import { addNotification } from 'src/state/slices/ui';
import { changePassword } from 'src/services/backend/account';
import { createDefaultValidator } from 'src/ui/ajv';
import { properties } from 'src/utils/types';
import { translationKeys } from 'src/translations';
import { units } from 'src/ui/styles/dimensions';
import { useAppDispatch } from 'src/ui/hooks/redux';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import JSONSchemaBridge from 'uniforms-bridge-json-schema';
import PasswordChecks from 'src/ui/components/password-checks';
import React, { useRef, useState } from 'react';
import SimpleButton from 'src/ui/components/buttons/simple-button';
import TextField from 'src/ui/components/fields/text-field';
import Type from 'src/ui/styles/type';

/*
 * Reset password schema.
 */

const createResetPasswordSchema = (t: (key: string) => string) => ({
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
      title: t(translationKeys.forms.changePassword.oldPassword.label),
      component: TextField,
      showMaskPasswordControl: true
    },
    newPassword: {
      type: 'string',
      title: t(translationKeys.forms.changePassword.newPassword.label),
      component: TextField,
      pattern: '^(?!^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*|.{24,})$).*$',
      showMaskPasswordControl: true
    },
    passwordRepetition: {
      equalToAnother: {
        field: 'newPassword'
      },
      type: 'string',
      title: t(translationKeys.forms.changePassword.newPasswordRepetition.label),
      component: TextField,
      showMaskPasswordControl: true
    }
  },
  additionalProperties: false,
  required: ['oldPassword', 'newPassword', 'passwordRepetition'],
  errorMessage: {
    required: {
      oldPassword: t(translationKeys.forms.changePassword.oldPassword.requiredError),
      newPassword: t(translationKeys.forms.changePassword.newPassword.requiredError),
      passwordRepetition: t(translationKeys.forms.changePassword.newPasswordRepetition.requiredError)
    },
    properties: {
      passwordRepetition: t(translationKeys.forms.changePassword.newPasswordRepetition.nonMatchingError)
    }
  }
}) as const;

type ChangePasswordData = FromSchema<ReturnType<typeof createResetPasswordSchema>>;

/*
 * Export ChangePasswordForm.
 */

function ChangePasswordForm(props: {
  onPasswordChanged: () => void
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const [password, setPassword] = useState('');
  const passwordChange = useMutation(async (data: ChangePasswordData) => {
    try {
      await changePassword(data.oldPassword, data.newPassword);

      dispatch(addNotification({
        message: t(translationKeys.screens.changePassword.successMessage),
        type: 'success'
      }));
    } catch (error) {
      if (error?.status === 401) {
        dispatch(addNotification({
          message: t(translationKeys.forms.changePassword.operationErrors.wrongCredentials),
          type: 'error'
        }));
      } else {
        dispatch(addNotification({
          message: t(translationKeys.forms.common.operationErrors.genericError),
          type: 'error'
        }));
      }

      throw error;
    }
  });

  const changePasswordSchema = createResetPasswordSchema(t);
  const schemaValidator = createDefaultValidator(changePasswordSchema as JSONSchemaType<ChangePasswordData>, (error: ErrorObject) => {
    if (error?.instancePath === '/newPassword' && error?.keyword === 'pattern') {
      return {
        ...error,
        message: t(translationKeys.forms.changePassword.newPassword.patternError)
      };
    }

    return error;
  });

  const bridge = new JSONSchemaBridge(changePasswordSchema, schemaValidator);

  return (
    <>
      <Type.H3>
        {t(translationKeys.screens.changePassword.title)}
      </Type.H3>

      <AutoForm
        onChangeModel={(model: ChangePasswordData) => {
          setPassword(model.newPassword);
        }}
        onSubmit={async (model: ChangePasswordData) => {
          try {
            await passwordChange.mutateAsync(model);

            await props.onPasswordChanged();
          } catch (error) {
            // Do nothing.
          }
        }}
        ref={formRef}
        schema={bridge}
      >
        <div style={{ marginBottom: units(4), textAlign: 'left' }}>
          <FieldWrapper>
            <AutoField
              name={properties<ChangePasswordData>().oldPassword}
              type={'password'}
            />

            <StyledErrorField name={properties<ChangePasswordData>().oldPassword} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField
              name={properties<ChangePasswordData>().newPassword}
              type={'password'}
            />

            <StyledErrorField name={properties<ChangePasswordData>().newPassword} />
          </FieldWrapper>

          <FieldWrapper>
            <AutoField name={properties<ChangePasswordData>().passwordRepetition} />

            <StyledErrorField name={properties<ChangePasswordData>().passwordRepetition} />
          </FieldWrapper>

          <div style={{ marginBottom: units(2), marginTop: units(3) }}>
            <PasswordChecks password={password} />
          </div>
        </div>

        <DialogActions>
          <SimpleButton
            loading={passwordChange.isLoading}
            onClick={event => {
              event.preventDefault();

              formRef.current?.submit();
            }}
          >
            {t(translationKeys.forms.changePassword.submitLabel)}
          </SimpleButton>
        </DialogActions>
      </AutoForm>
    </>
  );
}

export default React.memo(ChangePasswordForm);
